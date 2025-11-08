
import React, { useMemo, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Article } from '../types';
import { ArticleContext } from '../context/ArticleContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage: React.FC = () => {
  const query = useQuery().get('q');
  const { articles } = useContext(ArticleContext);
  
  const searchResults = useMemo(() => {
    if (!query) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowerCaseQuery) ||
      article.summary.toLowerCase().includes(lowerCaseQuery) ||
      article.content.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, articles]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Search Results
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
        </p>
      </div>
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((article: Article) => (
            <Link 
              key={article.id}
              to={`/article/${article.id}`}
              className="block bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 hover:border-blue-600"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
                {article.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{article.summary}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-gray-800 dark:text-gray-200">No results found. Try searching with different keywords.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;