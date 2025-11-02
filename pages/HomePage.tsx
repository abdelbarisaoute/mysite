
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { ArticleContext } from '../context/ArticleContext';
import { AuthContext } from '../context/AuthContext';
import { homeContent as initialHomeContent } from '../data/content';
import { githubService } from '../services/githubService';

const HomePage: React.FC = () => {
  const { articles } = useContext(ArticleContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialHomeContent.title);
  const [description, setDescription] = useState(initialHomeContent.description);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved content from localStorage
    const savedTitle = localStorage.getItem('homeTitle');
    const savedDescription = localStorage.getItem('homeDescription');
    
    if (savedTitle) setTitle(savedTitle);
    if (savedDescription) setDescription(savedDescription);
    
    setEditedTitle(savedTitle || initialHomeContent.title);
    setEditedDescription(savedDescription || initialHomeContent.description);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Save to localStorage
    localStorage.setItem('homeTitle', editedTitle);
    localStorage.setItem('homeDescription', editedDescription);
    setTitle(editedTitle);
    setDescription(editedDescription);

    // If GitHub is configured, commit to repository
    if (githubService.isConfigured()) {
      try {
        const fileContent = `export const homeContent = {
  title: "${editedTitle.replace(/"/g, '\\"')}",
  description: "${editedDescription.replace(/"/g, '\\"')}"
};
`;
        await githubService.commitFile({
          path: 'data/content.ts',
          content: fileContent,
          message: 'Update home page content via web interface',
        });
        alert('Changes saved and committed to GitHub! The site will be redeployed shortly.');
      } catch (error) {
        console.error('Failed to commit to GitHub:', error);
        alert('Changes saved locally, but failed to commit to GitHub. Please check your settings and try again.');
      }
    } else {
      alert('Changes saved locally only. Configure GitHub in Settings to commit changes to the repository.');
    }

    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedDescription(description);
    setIsEditing(false);
  };

  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Title</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <button onClick={handleCancel} disabled={isSaving} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              {isAuthenticated && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {description}
            </p>
          </>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-blue-500">Latest Publications</h2>
        <div className="space-y-8">
          {latestArticles.map((article: Article) => (
            <article key={article.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md dark:hover:bg-gray-700/40 transition-shadow">
              <header>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 className="text-2xl font-bold">
                  <Link to={`/article/${article.id}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </Link>
                </h3>
              </header>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{article.summary}</p>
              <Link to={`/article/${article.id}`} className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold">
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;