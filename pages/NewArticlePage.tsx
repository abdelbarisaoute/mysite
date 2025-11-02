
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArticleContext } from '../context/ArticleContext';
import { Article } from '../types';
import { githubService } from '../services/githubService';

const NewArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { isAuthenticated } = useContext(AuthContext);
  const { addArticle } = useContext(ArticleContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
        alert("Please fill out all fields.");
        return;
    }

    setIsSaving(true);

    const articleId = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newArticle: Article = {
        id: articleId,
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    // Add article to context (which saves to localStorage)
    addArticle(newArticle);

    // If GitHub is configured, commit to repository
    if (githubService.isConfigured()) {
      try {
        // Generate the article file content
        const fileContent = `import { Article } from '../../types';

export const ${articleId.replace(/-/g, '')}: Article = {
  id: '${articleId}',
  title: '${title.trim().replace(/'/g, "\\'")}',
  date: '${newArticle.date}',
  summary: '${summary.trim().replace(/'/g, "\\'")}',
  content: \`${content.trim().replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
};
`;
        
        await githubService.commitFile({
          path: `data/articles/${articleId}.ts`,
          content: fileContent,
          message: `Add new article "${title.trim()}" via web interface`,
        });
        
        alert('Article created and committed to GitHub! The site will be redeployed shortly.');
      } catch (error) {
        console.error('Failed to commit to GitHub:', error);
        alert('Article created locally, but failed to commit to GitHub. Please check your settings and try again.');
      }
    } else {
      alert('Article created locally only. Configure GitHub in Settings to commit changes to the repository.');
    }

    setIsSaving(false);
    navigate(`/article/${newArticle.id}`);
  };

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
            <button type="button" onClick={() => navigate('/contents')} disabled={isSaving} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? 'Saving...' : 'Save Article'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default NewArticlePage;