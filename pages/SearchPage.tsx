
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
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-blue-500">
        Search Results for "{query}"
      </h1>
      {searchResults.length > 0 ? (
        <div className="space-y-6">
          {searchResults.map((article: Article) => (
            <div key={article.id}>
              <h2 className="text-2xl font-semibold">
                <Link to={`/article/${article.id}`} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{article.summary}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No results found for your search. Please try another query.</p>
      )}
    </div>
  );
};

export default SearchPage;