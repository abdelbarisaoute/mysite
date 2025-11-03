
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isGitHubConfigured } from '../utils/githubAPI';

interface GitHubMetadata {
  owner: string;
  repo: string;
  branch: string;
}

const GitHubSetupPage: React.FC = () => {
  const [githubConfigured, setGithubConfigured] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [githubInfo, setGithubInfo] = useState<GitHubMetadata | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkConfiguration();
    loadGitHubInfo();
  }, []);

  const checkConfiguration = async () => {
    setIsChecking(true);
    const configured = await isGitHubConfigured();
    setGithubConfigured(configured);
    setIsChecking(false);
  };

  const loadGitHubInfo = async () => {
    try {
      const response = await fetch('/mysite/metadata.json');
      if (response.ok) {
        const metadata = await response.json();
        if (metadata.github) {
          setGithubInfo(metadata.github);
        }
      }
    } catch (error) {
      console.error('Failed to load GitHub metadata:', error);
    }
  };

  const repoUrl = githubInfo 
    ? `https://github.com/${githubInfo.owner}/${githubInfo.repo}`
    : 'https://github.com/[your-username]/[your-repo]';
  
  const deployedUrl = githubInfo
    ? `https://${githubInfo.owner}.github.io/${githubInfo.repo}/`
    : 'https://[username].github.io/[repository-name]/';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-blue-500">
        GitHub Auto-Save Setup
      </h1>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-md border ${
        isChecking 
          ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
          : githubConfigured
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      }`}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">
            {isChecking ? '🔄' : githubConfigured ? '✅' : '⚠️'}
          </span>
          <div>
            <p className={`font-semibold ${
              isChecking
                ? 'text-gray-800 dark:text-gray-200'
                : githubConfigured
                ? 'text-green-800 dark:text-green-200'
                : 'text-yellow-800 dark:text-yellow-200'
            }`}>
              {isChecking ? 'Checking configuration...' : githubConfigured ? 'GitHub Auto-Save is Enabled' : 'GitHub Auto-Save is Not Configured'}
            </p>
            <p className={`text-sm ${
              isChecking
                ? 'text-gray-600 dark:text-gray-400'
                : githubConfigured
                ? 'text-green-700 dark:text-green-300'
                : 'text-yellow-700 dark:text-yellow-300'
            }`}>
              {isChecking 
                ? 'Please wait while we verify your setup...'
                : githubConfigured
                ? 'Articles will be automatically saved to your GitHub repository'
                : 'Follow the steps below to enable automatic article saving'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Enable automatic saving of articles directly to your GitHub repository! 
          Once configured, every article you create or edit will be automatically committed and pushed to your repository.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Follow these steps to set up GitHub auto-save:
        </p>
      </div>

      {/* Step-by-Step Guide */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-start mb-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">1</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Create a GitHub Personal Access Token</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                You need to create a personal access token that will allow the website to commit files to your repository.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)</a></li>
                <li>Click <strong>"Generate new token (classic)"</strong></li>
                <li>Give it a descriptive name (e.g., "Article Auto-Save for mysite")</li>
                <li>Set an expiration date (recommended: 90 days or custom)</li>
                <li><strong>Select the <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">repo</code> scope</strong> (this gives full control of private repositories)</li>
                <li>Scroll down and click <strong>"Generate token"</strong></li>
                <li><strong>⚠️ Copy the token immediately</strong> (you won't be able to see it again!)</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-start mb-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">2</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Add Token as a Repository Secret</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Store your token securely in GitHub repository secrets so the deployment workflow can use it.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Go to your repository on GitHub: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">{repoUrl}</code></li>
                <li>Click <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></li>
                <li>Click <strong>"New repository secret"</strong></li>
                <li>Set the name to: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm font-bold">VITE_GITHUB_TOKEN</code></li>
                <li>Paste your personal access token in the value field</li>
                <li>Click <strong>"Add secret"</strong></li>
              </ol>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-start mb-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">3</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Verify the Deployment Workflow</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Ensure your deployment workflow is configured to use the token. The file <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">.github/workflows/deploy.yml</code> should include:
              </p>
              <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm">
{`- name: Build
  run: npm run build
  env:
    VITE_GITHUB_TOKEN: \${{ secrets.VITE_GITHUB_TOKEN }}`}
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-3">
                ✅ This configuration is already included in your deployment workflow!
              </p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-start mb-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">4</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Test the Setup</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                After completing the previous steps, test that everything works:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Push a change to the <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">main</code> branch to trigger a deployment</li>
                <li>Wait for the GitHub Actions workflow to complete (check the Actions tab)</li>
                <li>Navigate to your deployed site at <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">{deployedUrl}</code></li>
                <li>
                  <button 
                    onClick={checkConfiguration}
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    🔄 Refresh Status
                  </button>
                  {' '}to check if GitHub auto-save is now enabled
                </li>
                <li>Go to <strong>/new-article</strong> and create a test article</li>
                <li>The article should be automatically saved to your repository!</li>
                <li>Check your repository - you should see a new commit in <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">data/articles/</code></li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">🎯 How It Works</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Automatically commit new articles to <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">data/articles/[article-id].ts</code></span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Generate properly formatted TypeScript files</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Push changes directly to your GitHub repository</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Trigger automatic redeployment via GitHub Actions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Show success/error status messages</span>
          </li>
        </ul>
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-yellow-900 dark:text-yellow-100">🔧 Troubleshooting</h3>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-semibold">"GitHub not configured" message appears:</p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Verify you've added the <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">VITE_GITHUB_TOKEN</code> secret in repository settings</li>
              <li>Check that your GitHub Actions workflow includes the <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">env</code> section in the build step</li>
              <li>Ensure you've pushed changes and triggered a new deployment</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">"Failed to save to repository" error:</p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Verify your personal access token has the <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">repo</code> scope</li>
              <li>Check if your token has expired (tokens can expire after 90 days)</li>
              <li>Ensure the token has permissions for your repository</li>
              <li>Check the browser console for detailed error messages</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Token expired:</p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Generate a new personal access token following Step 1</li>
              <li>Update the <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">VITE_GITHUB_TOKEN</code> secret in your repository settings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Local Development (Optional) */}
      <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">💻 Local Development Setup (Optional)</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          If you want to test auto-save during local development:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
          <li>Copy <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">.env.example</code> to <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">.env</code> in your project root:
            <pre className="bg-gray-800 text-gray-200 p-2 rounded mt-2 text-sm">cp .env.example .env</pre>
          </li>
          <li>Edit <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">.env</code> and add your token:
            <pre className="bg-gray-800 text-gray-200 p-2 rounded mt-2 text-sm">VITE_GITHUB_TOKEN=your_personal_access_token_here</pre>
          </li>
          <li><strong>⚠️ Important:</strong> Never commit the <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">.env</code> file (it's already in <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">.gitignore</code>)</li>
          <li>Restart your development server:
            <pre className="bg-gray-800 text-gray-200 p-2 rounded mt-2 text-sm">npm run dev</pre>
          </li>
        </ol>
      </div>

      {/* Manual Save Fallback */}
      <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">📁 Manual Save Option (Fallback)</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          If automatic saving is not configured or fails, you can still manage articles manually:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
          <li>Click <strong>"Download Article File"</strong> after creating/editing an article</li>
          <li>Save the downloaded <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">.ts</code> file to <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">data/articles/</code> in your local repository</li>
          <li>Commit and push the changes manually:
            <pre className="bg-gray-800 text-gray-200 p-2 rounded mt-2 text-sm">{`git add data/articles/your-article.ts
git commit -m "Add new article"
git push`}</pre>
          </li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3 justify-end">
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Back to Admin
        </button>
        <button
          onClick={() => navigate('/new-article')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Create New Article
        </button>
      </div>
    </div>
  );
};

export default GitHubSetupPage;
