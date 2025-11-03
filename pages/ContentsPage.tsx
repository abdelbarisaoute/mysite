
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArticleContext } from '../context/ArticleContext';

const ContentsPage: React.FC = () => {
  const { articles } = useContext(ArticleContext);

  const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-blue-500">
        <h1 className="text-3xl font-bold">Table of Contents</h1>
      </div>
      <div className="space-y-6">
        {sortedArticles.map(article => (
          <div key={article.id}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl font-semibold">
              <Link to={`/article/${article.id}`} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {article.title}
              </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentsPage;
