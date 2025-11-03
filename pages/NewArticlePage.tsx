
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArticleContext } from '../context/ArticleContext';
import { Article } from '../types';
import { generateArticleFileContent, downloadFile } from '../utils/articleFileGenerator';
import { saveArticleToRepository, isGitHubConfigured } from '../utils/githubAPI';


const NewArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [savedArticle, setSavedArticle] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [githubConfigured, setGithubConfigured] = useState(false);
  
  const { isAuthenticated } = useContext(AuthContext);
  const { addArticle } = useContext(ArticleContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check if GitHub is configured
    isGitHubConfigured().then(setGithubConfigured);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
        alert("Please fill out all fields.");
        return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    const newArticle: Article = {
        id: (() => {
          // Generate ID from title
          let id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          // Remove leading/trailing hyphens
          id = id.replace(/^-+|-+$/g, '');
          // Ensure ID is not empty and doesn't start with a number
          if (!id || /^[0-9]/.test(id)) {
            id = 'article-' + (id || Date.now());
          }
          return id;
        })(),
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    // Save to localStorage first
    addArticle(newArticle);
    setSavedArticle(newArticle);

    // Try to save to repository automatically
    if (githubConfigured) {
      const result = await saveArticleToRepository(newArticle, false);
      
      if (result.success) {
        setSaveStatus({
          type: 'success',
          message: 'Article saved successfully to repository! The changes will appear after the next deployment.'
        });
      } else {
        setSaveStatus({
          type: 'error',
          message: `Failed to save to repository: ${result.error || 'Unknown error'}. You can download the file manually.`
        });
      }
    } else {
      setSaveStatus({
        type: 'info',
        message: 'GitHub not configured. You can download the file manually to add it to your repository.'
      });
    }

    setIsSaving(false);
    setShowInstructions(true);
  };

  const handleDownloadFile = () => {
    if (!savedArticle) return;
    
    const fileContent = generateArticleFileContent(savedArticle);
    const filename = `${savedArticle.id}.ts`;
    downloadFile(fileContent, filename);
  };

  const handleContinue = () => {
    if (savedArticle) {
      navigate(`/article/${savedArticle.id}`);
    }
  };

  if (showInstructions && savedArticle) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-green-500">Article Saved!</h1>
        
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-green-800 dark:text-green-200 font-semibold mb-2">✓ Article saved to browser storage</p>
          <p className="text-sm text-green-700 dark:text-green-300">Your article is now visible on the website.</p>
        </div>

        {saveStatus && (
          <div className={`mb-6 p-4 rounded-md border ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : saveStatus.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <p className={`font-semibold mb-2 ${
              saveStatus.type === 'success' 
                ? 'text-green-800 dark:text-green-200' 
                : saveStatus.type === 'error'
                ? 'text-red-800 dark:text-red-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}>
              {saveStatus.type === 'success' ? '✓ ' : saveStatus.type === 'error' ? '⚠ ' : 'ℹ '}
              {saveStatus.type === 'success' ? 'Saved to Repository' : saveStatus.type === 'error' ? 'Repository Save Failed' : 'Manual Save Required'}
            </p>
            <p className={`text-sm ${
              saveStatus.type === 'success' 
                ? 'text-green-700 dark:text-green-300' 
                : saveStatus.type === 'error'
                ? 'text-red-700 dark:text-red-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {saveStatus.message}
            </p>
          </div>
        )}

        {(!githubConfigured || saveStatus?.type === 'error') && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">📁 Manual Save Option</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              You can manually download and save the article file to your repository:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
              <li>Click "Download Article File" below</li>
              <li>Save to <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">data/articles/{savedArticle.id}.ts</code></li>
              <li>Commit and push to your repository</li>
            </ol>

            <button
              onClick={handleDownloadFile}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition mb-2"
            >
              📥 Download Article File
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => navigate('/contents')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition"
          >
            Back to Contents
          </button>
          <button
            onClick={handleContinue}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition"
          >
            View Article
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-blue-500">Create New Article</h1>
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
            <button type="button" onClick={() => navigate('/contents')} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition">Cancel</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Article'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default NewArticlePage;