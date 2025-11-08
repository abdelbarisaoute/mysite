import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArticleContext } from '../context/ArticleContext';
import { Article, Annex, AnnexPart } from '../types';
import ArticlePreview from '../components/ArticlePreview';
import ImageUpload from '../components/ImageUpload';
import { annexData } from '../data/annex';
import { generateId } from '../utils/idGenerator';
import TabNavigation from '../components/admin/TabNavigation';
import GitHubSettings from '../components/admin/GitHubSettings';
import ResumeEditor from '../components/admin/ResumeEditor';
import { 
  saveFileToGitHub, 
  deleteFileFromGitHub, 
  escapeForString, 
  escapeForTemplate,
  encodeToBase64
} from '../utils/githubApi';

// Helper function to get repository information
const getRepositoryInfo = () => {
  const repoOwner = import.meta.env.VITE_GITHUB_OWNER || window.location.hostname.split('.')[0] || 'abdelbarisaoute';
  const repoName = import.meta.env.VITE_GITHUB_REPO || window.location.pathname.split('/')[1] || 'mysite';
  return { repoOwner, repoName };
};

// Common deployment message
const DEPLOYMENT_INFO = 'The site will automatically rebuild within 1-2 minutes. Press Ctrl+Shift+R (Cmd+Shift+R on Mac) to see changes immediately.';

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { articles } = useContext(ArticleContext);
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('resume');
  
  // Message state
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Articles state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    summary: '',
    content: '',
  });
  const [showPreview, setShowPreview] = useState(true);
  
  // Annex editing state
  const [showAnnexForm, setShowAnnexForm] = useState(false);
  const [annexFormData, setAnnexFormData] = useState<Annex>(annexData);
  const [showAnnexPreview, setShowAnnexPreview] = useState(true);
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);
  const [partFormData, setPartFormData] = useState<AnnexPart>({
    id: '',
    title: '',
    content: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
    
    // Load saved annex from localStorage
    const savedAnnex = localStorage.getItem('annex');
    if (savedAnnex) {
      try {
        const parsedAnnex = JSON.parse(savedAnnex);
        setAnnexFormData(parsedAnnex);
      } catch (e) {
        console.error('Failed to parse saved annex:', e);
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const tabs = [
    { id: 'resume', label: '📄 Resume', icon: '📄' },
    { id: 'articles', label: '📝 Articles', icon: '📝' },
    { id: 'annex', label: '📋 Annex', icon: '📋' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  // Article functions
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
    try {
      // Validate base64 encoding works
      encodeToBase64(content);
    } catch (error) {
      console.error('Base64 encoding error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to encode article content. The content may contain unsupported characters.' 
      });
      return false;
    }
    
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
    const repoOwnerToUse = savedRepoOwner || defaultOwner;
    const repoNameToUse = savedRepoName || defaultName;
    const filePath = `data/articles/${article.id}.ts`;

    const commitMessage = editingArticle 
      ? `Update article: ${article.title}`
      : `Add new article: ${article.title}`;

    const result = await saveFileToGitHub(
      { token, owner: repoOwnerToUse, repo: repoNameToUse },
      filePath,
      content,
      commitMessage
    );

    if (!result.success) {
      console.error('GitHub API error:', result.error);
      setMessage({ 
        type: 'error', 
        text: `Failed to save to repository: ${result.error}. Downloading file instead.` 
      });
      downloadArticleFile(article);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const articleId = editingArticle ? formData.id : generateArticleId(formData.title);
    
    const article: Article = {
      ...formData,
      id: articleId,
      date: formData.date || new Date().toISOString().split('T')[0],
    };

    const success = await saveToGitHub(article);
    
    setIsSubmitting(false);

    if (success) {
      setMessage({ 
        type: 'success', 
        text: `Article "${article.title}" has been ${editingArticle ? 'updated' : 'created'} and committed to GitHub! ${DEPLOYMENT_INFO}` 
      });
      resetForm();
    }
  };

  const handleDelete = async (article: Article) => {
    if (!window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      return;
    }

    const token = localStorage.getItem('githubToken') || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      setMessage({ 
        type: 'error', 
        text: 'GitHub token not configured. Cannot delete files from repository.' 
      });
      return;
    }

    setIsSubmitting(true);
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
    const repoOwnerToUse = savedRepoOwner || defaultOwner;
    const repoNameToUse = savedRepoName || defaultName;
    const filePath = `data/articles/${article.id}.ts`;

    const result = await deleteFileFromGitHub(
      { token, owner: repoOwnerToUse, repo: repoNameToUse },
      filePath,
      `Delete article: ${article.title}`
    );

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: `Article "${article.title}" has been deleted from GitHub. ${DEPLOYMENT_INFO}` 
      });
    } else {
      console.error('GitHub API error:', result.error);
      setMessage({ 
        type: 'error', 
        text: `Failed to delete from repository: ${result.error}` 
      });
    }

    setIsSubmitting(false);
  };

  // Annex functions
  const saveAnnexToGitHub = async (annex: Annex): Promise<boolean> => {
    const token = localStorage.getItem('githubToken') || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      setMessage({ 
        type: 'error', 
        text: 'GitHub token not configured. Annex saved locally only.' 
      });
      return false;
    }

    const partsCode = annex.parts.map(part => `    {
      id: '${escapeForString(part.id)}',
      title: '${escapeForString(part.title)}',
      content: \`${escapeForTemplate(part.content)}\`
    }`).join(',\n');

    const content = `import { Annex } from '../types';

export const annexData: Annex = {
  id: '${escapeForString(annex.id)}',
  title: '${escapeForString(annex.title)}',
  parts: [
${partsCode}
  ]
};
`;
    
    try {
      // Validate base64 encoding works
      encodeToBase64(content);
    } catch (error) {
      console.error('Base64 encoding error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to encode annex content. The content may contain unsupported characters.' 
      });
      return false;
    }
    
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    const { repoOwner: defaultOwner, repoName: defaultName } = getRepositoryInfo();
    const repoOwnerToUse = savedRepoOwner || defaultOwner;
    const repoNameToUse = savedRepoName || defaultName;
    const filePath = 'data/annex.ts';

    const result = await saveFileToGitHub(
      { token, owner: repoOwnerToUse, repo: repoNameToUse },
      filePath,
      content,
      `Update annex: ${annex.title}`
    );

    if (!result.success) {
      console.error('GitHub API error:', result.error);
      setMessage({ 
        type: 'error', 
        text: `Failed to save to repository: ${result.error}. Annex saved locally only.` 
      });
      return false;
    }

    return true;
  };

  const handleAnnexSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    localStorage.setItem('annex', JSON.stringify(annexFormData));

    const success = await saveAnnexToGitHub(annexFormData);
    
    setIsSubmitting(false);

    if (success) {
      setMessage({ 
        type: 'success', 
        text: `Annex "${annexFormData.title}" has been updated and committed to GitHub! ${DEPLOYMENT_INFO}` 
      });
    } else {
      setMessage({ 
        type: 'success', 
        text: `Annex "${annexFormData.title}" has been saved locally. Changes will be visible immediately but won't be committed to GitHub.` 
      });
    }
    
    setShowAnnexForm(false);
  };

  const handleAddPart = () => {
    setEditingPartIndex(null);
    setPartFormData({
      id: '',
      title: '',
      content: ''
    });
    setShowAnnexForm(true);
  };

  const handleEditPart = (index: number) => {
    setEditingPartIndex(index);
    setPartFormData(annexFormData.parts[index]);
    setShowAnnexForm(true);
  };

  const handleDeletePart = (index: number) => {
    if (!window.confirm(`Are you sure you want to delete "${annexFormData.parts[index].title}"?`)) {
      return;
    }
    const updatedParts = annexFormData.parts.filter((_, i) => i !== index);
    const updatedAnnex = { ...annexFormData, parts: updatedParts };
    setAnnexFormData(updatedAnnex);
    localStorage.setItem('annex', JSON.stringify(updatedAnnex));
    setMessage({ 
      type: 'success', 
      text: 'Part deleted successfully. Click "Save All Parts" to commit to GitHub.' 
    });
  };

  const handlePartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const partId = editingPartIndex !== null 
      ? partFormData.id 
      : generateId(partFormData.title);
    
    const part: AnnexPart = {
      ...partFormData,
      id: partId
    };

    let updatedParts: AnnexPart[];
    if (editingPartIndex !== null) {
      updatedParts = annexFormData.parts.map((p, i) => i === editingPartIndex ? part : p);
    } else {
      updatedParts = [...annexFormData.parts, part];
    }

    const updatedAnnex = { ...annexFormData, parts: updatedParts };
    setAnnexFormData(updatedAnnex);
    
    setShowAnnexForm(false);
    setEditingPartIndex(null);
    setPartFormData({ id: '', title: '', content: '' });
    
    setMessage({ 
      type: 'success', 
      text: `Part "${part.title}" ${editingPartIndex !== null ? 'updated' : 'added'} successfully. Click "Save All Parts" to commit to GitHub.` 
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          type="button"
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

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Resume Tab */}
      {activeTab === 'resume' && (
        <ResumeEditor 
          onMessage={setMessage}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </h2>
              <div className="flex gap-2">
                {showCreateForm && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                )}
                {!showCreateForm && (
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    New Article
                  </button>
                )}
              </div>
            </div>

            {showCreateForm && (
              <div className={`admin-preview-grid ${showPreview ? 'with-preview' : ''}`}>
                <div className="space-y-4">
                  <form onSubmit={handleSubmit} id="article-form">
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
                        Content * (Supports LaTeX syntax)
                      </label>
                      <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                        rows={12}
                        required
                      />
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
                        <p className="font-semibold mb-1">💡 LaTeX Support:</p>
                        <div className="space-y-1">
                          <p>• <strong>Inline math:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">$E = mc^2$</code></p>
                          <p>• <strong>Display math:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">$$\int_0^\infty e^{"{-x}"} dx = 1$$</code></p>
                          <p>• <strong>Bold/Italic:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">\textbf{"{}"}, \textit{"{}"}</code></p>
                          <p>• <strong>Sections:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">\section{"{}"}, \subsection{"{}"}</code></p>
                        </div>
                      </div>
                      
                      <ImageUpload 
                        articleId={formData.id || 'new-article'}
                        onImageInsert={(markdown) => {
                          setFormData({ 
                            ...formData, 
                            content: formData.content + '\n\n' + markdown 
                          });
                        }} 
                      />
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
                </div>

                {showPreview && (
                  <div>
                    <ArticlePreview
                      title={formData.title}
                      date={formData.date}
                      summary={formData.summary}
                      content={formData.content}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

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
                        type="button"
                        onClick={() => handleEdit(article)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
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
      )}

      {/* Annex Tab */}
      {activeTab === 'annex' && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Annex Editor - Multiple Parts</h2>
            <div className="flex gap-2">
              {!showAnnexForm && (
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Add New Part
                </button>
              )}
            </div>
          </div>

          {showAnnexForm && (
            <div className={`admin-preview-grid ${showAnnexPreview ? 'with-preview' : ''} mb-6`}>
              <div className="space-y-4">
                <form onSubmit={handlePartSubmit} id="part-form">
                  <div className="mb-4">
                    <label htmlFor="part-title" className="block text-sm font-medium mb-2">
                      Part Title *
                    </label>
                    <input
                      type="text"
                      id="part-title"
                      value={partFormData.title}
                      onChange={(e) => setPartFormData({ ...partFormData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="part-content" className="block text-sm font-medium mb-2">
                      Content * (Supports LaTeX syntax)
                    </label>
                    <textarea
                      id="part-content"
                      value={partFormData.content}
                      onChange={(e) => setPartFormData({ ...partFormData, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                      rows={20}
                      required
                    />
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
                      <p className="font-semibold mb-1">💡 Features:</p>
                      <div className="space-y-1">
                        <p>• <strong>Tables:</strong> Use Markdown table syntax (| Header | ... |)</p>
                        <p>• <strong>Math:</strong> $inline$ or $$display$$ formulas</p>
                        <p>• <strong>Sections:</strong> \section{"{}"}, \subsection{"{}"}</p>
                        <p>• <strong>Special blocks:</strong> \begin{"{remarque}"} ... \end{"{remarque}"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                      {editingPartIndex !== null ? 'Update Part' : 'Add Part'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAnnexForm(false);
                        setEditingPartIndex(null);
                        setPartFormData({ id: '', title: '', content: '' });
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAnnexPreview(!showAnnexPreview)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors ml-auto"
                    >
                      {showAnnexPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>
                </form>
              </div>

              {showAnnexPreview && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Preview</h3>
                  <ArticlePreview
                    title={partFormData.title}
                    date=""
                    summary=""
                    content={partFormData.content}
                  />
                </div>
              )}
            </div>
          )}

          {!showAnnexForm && (
            <div>
              <div className="mb-4 text-gray-600 dark:text-gray-400">
                <p className="mb-2">Annex title: <strong>{annexFormData.title}</strong></p>
                <p className="text-sm mb-4">Each part is independent and will be rendered separately on the annex page.</p>
              </div>
              
              <div className="space-y-4">
                {annexFormData.parts && annexFormData.parts.map((part, index) => (
                  <div 
                    key={part.id} 
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{part.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Part {index + 1} of {annexFormData.parts.length}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => handleEditPart(index)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePart(index)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!annexFormData.parts || annexFormData.parts.length === 0) && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No parts yet. Click "Add New Part" to create the first part!
                  </p>
                )}
              </div>

              {annexFormData.parts && annexFormData.parts.length > 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAnnexSubmit}
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save All Parts to GitHub'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <GitHubSettings onMessage={setMessage} />
      )}
    </div>
  );
};

export default AdminDashboardPage;
