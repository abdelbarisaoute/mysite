
import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentRenderer from '../components/ContentRenderer';
import { AuthContext } from '../context/AuthContext';
import { useEditableContent } from '../hooks/useEditableContent';
import { ArticleContext } from '../context/ArticleContext';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useContext(ArticleContext);
  const article = articles.find(a => a.id === id);
  const { isAuthenticated } = useContext(AuthContext);

  const {
    isEditing,
    setIsEditing,
    content,
    editedContent,
    setEditedContent,
    handleSave,
    handleCancel,
  } = useEditableContent(
    `article-content-${article?.id}`,
    article?.content || ''
  );

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
    <article className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <header className="mb-8 border-b dark:border-gray-700 pb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Published on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex justify-between items-start">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{article.title}</h1>
            {isAuthenticated && !isEditing && (
                <button 
                onClick={() => setIsEditing(true)} 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition ml-4 flex-shrink-0">
                Edit
                </button>
            )}
        </div>
      </header>
      
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-screen p-2 border rounded-md font-mono bg-white dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            aria-label="Article Content"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition">Cancel</button>
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition">Save</button>
          </div>
        </div>
      ) : (
        <ContentRenderer content={content} />
      )}
    </article>
  );
};

export default ArticlePage;