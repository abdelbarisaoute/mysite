
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArticleContext } from '../context/ArticleContext';

const ContentsPage: React.FC = () => {
  const { articles } = useContext(ArticleContext);

  const sortedArticles = useMemo(() => 
    [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [articles]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">All articles and posts</p>
      </div>
      <div className="space-y-6">
        {sortedArticles.map(article => (
          <Link 
            key={article.id} 
            to={`/article/${article.id}`}
            className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 hover:border-blue-600"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-3">
              {article.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{article.summary}</p>
          </Link>
        ))}
        {sortedArticles.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No articles yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentsPage;
