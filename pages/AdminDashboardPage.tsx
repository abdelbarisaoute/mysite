
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArticleContext } from '../context/ArticleContext';
import { Article } from '../types';

// Helper function to get repository information
const getRepositoryInfo = () => {
  const repoOwner = import.meta.env.VITE_GITHUB_OWNER || window.location.hostname.split('.')[0] || 'abdelbarisaoute';
  const repoName = import.meta.env.VITE_GITHUB_REPO || window.location.pathname.split('/')[1] || 'mysite';
  return { repoOwner, repoName };
};

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { articles } = useContext(ArticleContext);
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    summary: '',
    content: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // GitHub token configuration state
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [tokenConfigured, setTokenConfigured] = useState(false);
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
    
    // Load saved GitHub token and repo info from localStorage
    const savedToken = localStorage.getItem('githubToken');
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    
    if (savedToken) {
      setGithubToken(savedToken);
      setTokenConfigured(true);
    }
    
    // Initialize repo info from environment or localStorage
    const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
    setRepoOwner(savedRepoOwner || defaultOwner);
    setRepoName(savedRepoName || defaultName);
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };
  
  const handleSaveTokenSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!githubToken.trim() || !repoOwner.trim() || !repoName.trim()) {
      setMessage({ 
        type: 'error', 
        text: 'All fields are required.' 
      });
      return;
    }
    
    // Save token and repo info to localStorage
    localStorage.setItem('githubToken', githubToken.trim());
    localStorage.setItem('githubRepoOwner', repoOwner.trim());
    localStorage.setItem('githubRepoName', repoName.trim());
    
    setTokenConfigured(true);
    setShowTokenSetup(false);
    setMessage({ 
      type: 'success', 
      text: 'GitHub token configured successfully! You can now upload articles automatically.' 
    });
  };
  
  const handleRemoveToken = () => {
    if (window.confirm('Are you sure you want to remove the GitHub token configuration?')) {
      localStorage.removeItem('githubToken');
      localStorage.removeItem('githubRepoOwner');
      localStorage.removeItem('githubRepoName');
      setGithubToken('');
      // Reset to default values from getRepositoryInfo
      const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
      setRepoOwner(defaultOwner);
      setRepoName(defaultName);
      setTokenConfigured(false);
      setMessage({ 
        type: 'success', 
        text: 'GitHub token removed. Articles will be downloaded as files.' 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      date: '',
      summary: '',
      content: '',
    });
    setEditingArticle(null);
    setShowCreateForm(false);
  };

  const handleEdit = (article: Article) => {
    setFormData(article);
    setEditingArticle(article);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateArticleId = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const generateArticleContent = (article: Article): string => {
    const variableName = article.id
      .split('-')
      .map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');

    // Properly escape the content for TypeScript template literal
    const escapeForTemplate = (str: string): string => {
      return str
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/`/g, '\\`')     // Escape backticks
        .replace(/\$/g, '\\$')    // Escape dollar signs
        .replace(/'/g, "\\'");    // Escape single quotes
    };

    return `import { Article } from '../../types';

export const ${variableName}: Article = {
  id: '${article.id}',
  title: '${escapeForTemplate(article.title)}',
  date: '${article.date}',
  summary: '${escapeForTemplate(article.summary)}',
  content: \`${escapeForTemplate(article.content)}\`
};
`;
  };

  const downloadArticleFile = (article: Article) => {
    const content = generateArticleContent(article);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.id}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveToGitHub = async (article: Article): Promise<boolean> => {
    // Try to get token from localStorage first, then fall back to environment variable
    const token = localStorage.getItem('githubToken') || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      setMessage({ 
        type: 'error', 
        text: 'GitHub token not configured. Download the file manually or set up GitHub token in settings.' 
      });
      downloadArticleFile(article);
      return false;
    }

    const content = generateArticleContent(article);
    
    // Use TextEncoder for proper UTF-8 encoding
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const base64Content = btoa(String.fromCharCode(...data));
    
    // Use saved repo info if available, otherwise use default detection
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
    const repoOwnerToUse = savedRepoOwner || defaultOwner;
    const repoNameToUse = savedRepoName || defaultName;
    const filePath = `data/articles/${article.id}.ts`;

    try {
      // Check if file exists (for updates)
      let sha: string | undefined;
      try {
        const getResponse = await fetch(
          `https://api.github.com/repos/${repoOwnerToUse}/${repoNameToUse}/contents/${filePath}`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
        if (getResponse.ok) {
          const data = await getResponse.json();
          sha = data.sha;
        }
      } catch (e) {
        // File doesn't exist, that's fine for new articles
      }

      // Create or update the file
      const commitMessage = editingArticle 
        ? `Update article: ${article.title}`
        : `Add new article: ${article.title}`;

      const response = await fetch(
        `https://api.github.com/repos/${repoOwnerToUse}/${repoNameToUse}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commitMessage,
            content: base64Content,
            sha: sha,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save to GitHub');
      }

      return true;
    } catch (error) {
      console.error('GitHub API error:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to save to repository: ${error instanceof Error ? error.message : 'Unknown error'}. Downloading file instead.` 
      });
      downloadArticleFile(article);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    // Generate ID from title if creating new article
    const articleId = editingArticle ? formData.id : generateArticleId(formData.title);
    
    const article: Article = {
      ...formData,
      id: articleId,
      date: formData.date || new Date().toISOString().split('T')[0],
    };

    // Save to GitHub
    const success = await saveToGitHub(article);
    
    setIsSubmitting(false);

    if (success) {
      setMessage({ 
        type: 'success', 
        text: `Article "${article.title}" has been ${editingArticle ? 'updated' : 'created'} and committed to GitHub! The site will automatically rebuild and deploy within 1-2 minutes. Use Ctrl+Shift+R (Cmd+Shift+R on Mac) to hard refresh and see the changes immediately.` 
      });
      resetForm();
    }
  };

  const handleDelete = async (article: Article) => {
    if (!window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      return;
    }

    // Try to get token from localStorage first, then fall back to environment variable
    const token = localStorage.getItem('githubToken') || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      setMessage({ 
        type: 'error', 
        text: 'GitHub token not configured. Cannot delete files from repository.' 
      });
      return;
    }

    setIsSubmitting(true);
    // Use saved repo info if available, otherwise use default detection
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
    const repoOwnerToUse = savedRepoOwner || defaultOwner;
    const repoNameToUse = savedRepoName || defaultName;
    const filePath = `data/articles/${article.id}.ts`;

    try {
      // Get the file SHA
      const getResponse = await fetch(
        `https://api.github.com/repos/${repoOwnerToUse}/${repoNameToUse}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error('File not found in repository');
      }

      const data = await getResponse.json();
      
      // Delete the file
      const deleteResponse = await fetch(
        `https://api.github.com/repos/${repoOwnerToUse}/${repoNameToUse}/contents/${filePath}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Delete article: ${article.title}`,
            sha: data.sha,
          }),
        }
      );

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.message || 'Failed to delete from GitHub');
      }

      setMessage({ 
        type: 'success', 
        text: `Article "${article.title}" has been deleted from GitHub. The site will automatically rebuild and deploy within 1-2 minutes. Use Ctrl+Shift+R (Cmd+Shift+R on Mac) to hard refresh and see the changes immediately.` 
      });
    } catch (error) {
      console.error('GitHub API error:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to delete from repository: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }

    setIsSubmitting(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* GitHub Token Setup Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">GitHub Auto-Upload Settings</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {tokenConfigured 
                ? '✅ GitHub token configured - articles will be uploaded automatically' 
                : '⚠️ No GitHub token configured - articles will be downloaded as files'}
            </p>
          </div>
          {tokenConfigured && !showTokenSetup && (
            <button
              onClick={() => setShowTokenSetup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
            >
              Update Settings
            </button>
          )}
          {!tokenConfigured && !showTokenSetup && (
            <button
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Your GitHub username or organization
                </p>
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The name of your repository
                </p>
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
              <li>Articles will be automatically committed to your repository</li>
              <li>Each commit triggers automatic redeployment</li>
              <li>Your token is stored securely in your browser</li>
            </ul>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              <strong>Security Note:</strong> Your token is stored in your browser's localStorage and never sent to any third-party servers. Only use this on trusted devices. For production deployments, consider using environment variables or GitHub repository secrets.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Form */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {editingArticle ? 'Edit Article' : 'Create New Article'}
          </h2>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              New Article
            </button>
          )}
        </div>

        {showCreateForm && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to use today's date
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="summary" className="block text-sm font-medium mb-2">
                Summary *
              </label>
              <textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Content * (Supports Markdown and LaTeX)
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                rows={12}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use $$ for block equations and $ for inline equations (e.g., $e = mc^2$)
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition-colors"
              >
                {isSubmitting ? 'Saving...' : (editingArticle ? 'Update Article' : 'Create Article')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Existing Articles */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Existing Articles ({articles.length})</h2>
        
        <div className="space-y-4">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{article.date}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{article.summary}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(article)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {articles.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No articles yet. Create your first article above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
