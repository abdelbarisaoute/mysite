import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface BlogTableOfContentsProps {
  articles: Article[];
}

const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ articles }) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <nav className="max-h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
          Published Blogs
        </h3>
        <ul className="space-y-2 text-sm">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                to={`/article/${article.id}`}
                className="block py-2 px-2 rounded transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {article.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default React.memo(BlogTableOfContents);
