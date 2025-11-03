
import React, { useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ContentRenderer from '../components/ContentRenderer';
import TableOfContents from '../components/TableOfContents';
import { AuthContext } from '../context/AuthContext';
import { ArticleContext } from '../context/ArticleContext';
import { githubService } from '../services/githubService';
import { escapeStringLiteral, escapeTemplateLiteral, generateValidIdentifier } from '../utils/codeGeneration';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, updateArticle, deleteArticle } = useContext(ArticleContext);
  const article = articles.find(a => a.id === id);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(article?.title || '');
  const [editedSummary, setEditedSummary] = useState(article?.summary || '');
  const [editedContent, setEditedContent] = useState(article?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleEdit = () => {
    if (article) {
      setEditedTitle(article.title);
      setEditedSummary(article.summary);
      setEditedContent(article.content);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!article) return;

    setIsSaving(true);

    const updatedArticle = {
      ...article,
      title: editedTitle,
      summary: editedSummary,
      content: editedContent,
    };

    // Update in context (which updates localStorage)
    updateArticle(updatedArticle);

    // If GitHub is configured, commit to repository
    if (githubService.isConfigured()) {
      try {
        // Generate the article file content with safe escaping
        const identifier = generateValidIdentifier(article.id);
        const fileContent = `import { Article } from '../../types';

export const ${identifier}: Article = {
  id: '${escapeStringLiteral(article.id)}',
  title: '${escapeStringLiteral(editedTitle)}',
  date: '${escapeStringLiteral(article.date)}',
  summary: '${escapeStringLiteral(editedSummary)}',
  content: \`${escapeTemplateLiteral(editedContent)}\`,
};
`;
        
        await githubService.commitFile({
          path: `data/articles/${article.id}.ts`,
          content: fileContent,
          message: `Update article "${editedTitle}" via web interface`,
        });
        
        alert('Article updated and committed to GitHub! The site will be redeployed shortly.');
      } catch (error) {
        console.error('Failed to commit to GitHub:', error);
        alert('Article updated locally, but failed to commit to GitHub. Please check your settings and try again.');
      }
    } else {
      alert('Article updated locally only. Configure GitHub in Settings to commit changes to the repository.');
    }

    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    if (article) {
      setEditedTitle(article.title);
      setEditedSummary(article.summary);
      setEditedContent(article.content);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!article) return;

    const confirmed = window.confirm(`Are you sure you want to delete the article "${article.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // Delete from context (which deletes from localStorage)
      deleteArticle(article.id);

      // If GitHub is configured, delete from repository
      if (githubService.isConfigured()) {
        try {
          await githubService.deleteFile(
            `data/articles/${article.id}.ts`,
            `Delete article "${article.title}" via web interface`
          );
          alert('Article deleted and removed from GitHub! The site will be redeployed shortly.');
        } catch (error) {
          console.error('Failed to delete from GitHub:', error);
          alert('Article deleted locally, but failed to delete from GitHub. Please check your settings and try again.');
        }
      } else {
        alert('Article deleted locally only. Configure GitHub in Settings to delete from the repository.');
      }

      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Please try again.');
      setIsDeleting(false);
    }
  };

  if (!article) {
    return (
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-4">The article you are looking for does not exist.</p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Table of Contents - Left Sidebar */}
      {!isEditing && (
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <TableOfContents content={article.content} />
        </aside>
      )}
      
      {/* Main Article Content */}
      <article className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm flex-1">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          
          {/* Toggle for split view */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Live Preview</span>
            </label>
          </div>
          
          <div className={`${showPreview ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content (LaTeX Supported)
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="Write your content with LaTeX support. Use $ for inline math, $$ for display math, \textbf{} for bold, \\section{} for sections, etc."
              />
            </div>
            
            {showPreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Live Preview
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 overflow-auto" style={{ minHeight: '500px' }}>
                  <ContentRenderer content={editedContent} />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button onClick={handleCancel} disabled={isSaving} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <header className="mb-8 border-b dark:border-gray-700 pb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Published on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex justify-between items-start">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{article.title}</h1>
              {isAuthenticated && (
                <div className="flex space-x-2 ml-4 flex-shrink-0">
                  <button 
                    onClick={handleEdit} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition">
                    Edit
                  </button>
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </header>
          
          <ContentRenderer content={article.content} />
        </>
      )}
      </article>
    </div>
  );
};

export default ArticlePage;