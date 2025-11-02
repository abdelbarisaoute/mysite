
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GitHubContext } from '../context/GitHubContext';

const SettingsPage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isGitHubConfigured, configureGitHub, clearGitHubConfig, getGitHubConfig } = useContext(GitHubContext);
  const navigate = useNavigate();

  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [token, setToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [showToken, setShowToken] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    // Load existing configuration
    const config = getGitHubConfig();
    if (config) {
      setOwner(config.owner);
      setRepo(config.repo);
      setBranch(config.branch || 'main');
      // Don't show the token for security reasons
    }
  }, [isAuthenticated, navigate, getGitHubConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!owner.trim() || !repo.trim() || !token.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    try {
      configureGitHub({
        owner: owner.trim(),
        repo: repo.trim(),
        token: token.trim(),
        branch: branch.trim() || 'main',
      });
      setMessage({ type: 'success', text: 'GitHub configuration saved successfully! Your edits will now be committed to the repository.' });
      setToken(''); // Clear token from form for security
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration. Please try again.' });
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the GitHub configuration? Your edits will only be saved locally after this.')) {
      clearGitHubConfig();
      setOwner('');
      setRepo('');
      setToken('');
      setBranch('main');
      setMessage({ type: 'success', text: 'GitHub configuration cleared. Edits will now be saved locally only.' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-blue-500">Settings</h1>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">GitHub Integration</h2>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
          Configure GitHub integration to commit your content changes directly to the repository. 
          This will trigger automatic redeployment of your website.
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Status: {isGitHubConfigured ? (
            <span className="font-semibold text-green-600 dark:text-green-400">✓ Configured (changes will be committed)</span>
          ) : (
            <span className="font-semibold text-orange-600 dark:text-orange-400">✗ Not configured (changes saved locally only)</span>
          )}
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Repository Owner <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g., abdelbarisaoute"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="repo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Repository Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g., mysite"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Branch
          </label>
          <input
            type="text"
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Personal Access Token <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              {showToken ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Create a token at{' '}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub Settings
            </a>
            {' '}with <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">repo</code> scope.
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {isGitHubConfigured && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition"
            >
              Clear Configuration
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
          >
            Save Configuration
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
        <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Setup Instructions</h3>
        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
          <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub Settings → Developer settings → Personal access tokens</a></li>
          <li>Click "Generate new token" (classic)</li>
          <li>Give it a descriptive name (e.g., "MyWebsite Content Editor")</li>
          <li>Select the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">repo</code> scope</li>
          <li>Click "Generate token" and copy it</li>
          <li>Paste the token here along with your repository owner and name</li>
        </ol>
      </div>
    </div>
  );
};

export default SettingsPage;
