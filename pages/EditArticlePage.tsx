
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArticleContext } from '../context/ArticleContext';
import { Article } from '../types';
import { generateArticleFileContent, downloadFile } from '../utils/articleFileGenerator';
import { saveArticleToRepository, isGitHubConfigured } from '../utils/githubAPI';

const EditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useContext(AuthContext);
  const { articles, updateArticle } = useContext(ArticleContext);
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [githubConfigured, setGithubConfigured] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check if GitHub is configured
    isGitHubConfigured().then(setGithubConfigured);
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
        const articleToEdit = articles.find(article => article.id === id);
        if (articleToEdit) {
          setTitle(articleToEdit.title);
          setSummary(articleToEdit.summary);
          setContent(articleToEdit.content);
          setCurrentArticle(articleToEdit);
        } else if (id) {
            alert('Article not found!');
            navigate('/contents');
        }
    }
  }, [id, articles, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title.trim() || !summary.trim() || !content.trim()) {
        alert("Please fill out all fields.");
        return;
    }
    const articleToEdit = articles.find(article => article.id === id);
    if (!articleToEdit) return;

    setIsSaving(true);
    setSaveStatus(null);

    const updatedArticle: Article = {
        ...articleToEdit,
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
    };

    // Update in localStorage
    updateArticle(updatedArticle);

    // Try to save to repository automatically
    if (githubConfigured) {
      const result = await saveArticleToRepository(updatedArticle, true);
      
      if (result.success) {
        setSaveStatus({
          type: 'success',
          message: 'Article updated successfully in repository!'
        });
        // Wait a moment to show the success message
        setTimeout(() => {
          navigate(`/article/${updatedArticle.id}`);
        }, 1500);
      } else {
        setSaveStatus({
          type: 'error',
          message: `Failed to update in repository: ${result.error || 'Unknown error'}`
        });
        setIsSaving(false);
      }
    } else {
      // If GitHub not configured, just navigate after local update
      navigate(`/article/${updatedArticle.id}`);
    }
  };

  const handleDownloadFile = () => {
    if (!currentArticle) return;
    
    const updatedArticle: Article = {
      ...currentArticle,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
    };
    
    const fileContent = generateArticleFileContent(updatedArticle);
    const filename = `${updatedArticle.id}.ts`;
    downloadFile(fileContent, filename);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-blue-500">Edit Article</h1>
      
      {saveStatus && (
        <div className={`mb-4 p-3 rounded-md border ${
          saveStatus.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-sm font-semibold ${
            saveStatus.type === 'success' 
              ? 'text-green-800 dark:text-green-200' 
              : 'text-red-800 dark:text-red-200'
          }`}>
            {saveStatus.type === 'success' ? '✓ ' : '⚠ '}
            {saveStatus.message}
          </p>
        </div>
      )}

      {githubConfigured ? (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Auto-save enabled: Changes will be saved to repository automatically
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💾 Manual save: You can download the updated file after editing
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="Write your article content here. You can use Markdown and LaTeX ($...$ or $$...$$)."
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
            {!githubConfigured && (
              <button 
                type="button" 
                onClick={handleDownloadFile}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
              >
                📥 Download File
              </button>
            )}
            <button type="button" onClick={() => navigate(`/article/${id}`)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition">Cancel</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticlePage;
