
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArticleContext } from '../context/ArticleContext';
import { Article } from '../types';
import { generateArticleFileContent, downloadFile, generateImportStatement, generateArrayItem } from '../utils/articleFileGenerator';

const NewArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [savedArticle, setSavedArticle] = useState<Article | null>(null);
  
  const { isAuthenticated } = useContext(AuthContext);
  const { addArticle } = useContext(ArticleContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
        alert("Please fill out all fields.");
        return;
    }

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

    addArticle(newArticle);
    setSavedArticle(newArticle);
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
        <h1 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-green-500">Article Saved Successfully!</h1>
        
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-green-800 dark:text-green-200 font-semibold mb-2">✓ Article saved to browser storage</p>
          <p className="text-sm text-green-700 dark:text-green-300">Your article is now visible on the website.</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">📁 Save to Repository (Optional)</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            To persist this article permanently in your repository, follow these steps:
          </p>
          
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
            <li>Click the "Download Article File" button below to download the TypeScript file</li>
            <li>Save the file to <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">data/articles/{savedArticle.id}.ts</code></li>
            <li>Update <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">data/articles/index.ts</code> by adding:
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs overflow-x-auto">
                <div>{generateImportStatement(savedArticle)}</div>
                <div className="mt-1">// Add to the articles array:</div>
                <div>{generateArrayItem(savedArticle)}</div>
              </div>
            </li>
            <li>Commit and push the changes to your repository</li>
          </ol>

          <button
            onClick={handleDownloadFile}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition mb-2"
          >
            📥 Download Article File
          </button>
        </div>

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
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition">Save Article</button>
        </div>
      </form>
    </div>
  );
};

export default NewArticlePage;