import React, { useState, useEffect } from 'react';

interface GitHubSettingsProps {
  onMessage: (message: { type: 'success' | 'error', text: string }) => void;
}

const getRepositoryInfo = () => {
  const repoOwner = import.meta.env.VITE_GITHUB_OWNER || window.location.hostname.split('.')[0] || 'abdelbarisaoute';
  const repoName = import.meta.env.VITE_GITHUB_REPO || window.location.pathname.split('/')[1] || 'mysite';
  return { repoOwner, repoName };
};

const GitHubSettings: React.FC<GitHubSettingsProps> = ({ onMessage }) => {
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [tokenConfigured, setTokenConfigured] = useState(false);
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('githubToken');
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    
    if (savedToken) {
      setGithubToken(savedToken);
      setTokenConfigured(true);
    }
    
    const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
    setRepoOwner(savedRepoOwner || defaultOwner);
    setRepoName(savedRepoName || defaultName);
  }, []);

  const handleSaveTokenSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubToken.trim() || !repoOwner.trim() || !repoName.trim()) {
      onMessage({ 
        type: 'error', 
        text: 'All fields are required.' 
      });
      return;
    }
    
    localStorage.setItem('githubToken', githubToken.trim());
    localStorage.setItem('githubRepoOwner', repoOwner.trim());
    localStorage.setItem('githubRepoName', repoName.trim());
    
    setTokenConfigured(true);
    setShowTokenSetup(false);
    onMessage({ 
      type: 'success', 
      text: 'GitHub token configured successfully! You can now upload content automatically.' 
    });
  };
  
  const handleRemoveToken = () => {
    if (window.confirm('Are you sure you want to remove the GitHub token configuration?')) {
      localStorage.removeItem('githubToken');
      localStorage.removeItem('githubRepoOwner');
      localStorage.removeItem('githubRepoName');
      setGithubToken('');
      const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
      setRepoOwner(defaultOwner);
      setRepoName(defaultName);
      setTokenConfigured(false);
      onMessage({ 
        type: 'success', 
        text: 'GitHub token removed. Content will be downloaded as files.' 
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">GitHub Auto-Upload Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {tokenConfigured 
              ? '✅ GitHub token configured - content will be uploaded automatically' 
              : '⚠️ No GitHub token configured - content will be downloaded as files'}
          </p>
        </div>
        {tokenConfigured && !showTokenSetup && (
          <button
            type="button"
            onClick={() => setShowTokenSetup(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            Update Settings
          </button>
        )}
        {!tokenConfigured && !showTokenSetup && (
          <button
            type="button"
            onClick={() => setShowTokenSetup(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Setup GitHub Token
          </button>
        )}
      </div>
      
      {showTokenSetup && (
        <form onSubmit={handleSaveTokenSettings} className="space-y-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <label htmlFor="githubToken" className="block text-sm font-medium mb-2">
              GitHub Personal Access Token *
            </label>
            <input
              type="password"
              id="githubToken"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              placeholder="Enter your GitHub Personal Access Token"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Create a token at{' '}
              <a 
                href="https://github.com/settings/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                github.com/settings/tokens
              </a>
              {' '}with <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">repo</code> scope
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="repoOwner" className="block text-sm font-medium mb-2">
                Repository Owner *
              </label>
              <input
                type="text"
                id="repoOwner"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="your-github-username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="repoName" className="block text-sm font-medium mb-2">
                Repository Name *
              </label>
              <input
                type="text"
                id="repoName"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="mysite"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={() => setShowTokenSetup(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Cancel
            </button>
            {tokenConfigured && (
              <button
                type="button"
                onClick={handleRemoveToken}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors ml-auto"
              >
                Remove Token
              </button>
            )}
          </div>
        </form>
      )}
      
      {!showTokenSetup && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-bold mb-2">How it works:</h3>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>Setup your GitHub token once from this page</li>
            <li>Content will be automatically committed to your repository</li>
            <li>Each commit triggers automatic redeployment</li>
            <li>Your token is stored securely in your browser</li>
          </ul>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
            <strong>Security Note:</strong> Your token is stored in your browser's localStorage and never sent to any third-party servers. Only use this on trusted devices.
          </p>
        </div>
      )}
    </div>
  );
};

export default GitHubSettings;
