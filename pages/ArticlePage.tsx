
import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ContentRenderer from '../components/ContentRenderer';
import { ArticleContext } from '../context/ArticleContext';
import { AuthContext } from '../context/AuthContext';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, deleteArticle } = useContext(ArticleContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const article = articles.find(a => a.id === id);

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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(article.id);
      navigate('/contents');
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <header className="mb-8 border-b dark:border-gray-700 pb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Published on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex justify-between items-start">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{article.title}</h1>
        </div>
      </header>

      {isAuthenticated && (
        <div className="flex justify-end space-x-2 mb-6">
            <Link to={`/edit-article/${article.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition text-sm font-medium">Edit</Link>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-medium">Delete</button>
        </div>
      )}
      
      <ContentRenderer content={article.content} />
    </article>
  );
};

export default ArticlePage;
