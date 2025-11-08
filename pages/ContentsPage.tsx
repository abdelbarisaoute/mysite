
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">All Articles</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse all published articles</p>
      </div>
      <div className="space-y-4">
        {sortedArticles.map(article => (
          <Link 
            key={article.id} 
            to={`/article/${article.id}`}
            className="block bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 hover:border-blue-600"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{article.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContentsPage;
