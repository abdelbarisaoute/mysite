
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { ArticleContext } from '../context/ArticleContext';

const HomePage: React.FC = () => {
  const { articles } = useContext(ArticleContext);

  const latestArticles = useMemo(() => 
    [...articles]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3),
    [articles]
  );

  return (
    <div className="space-y-8">
      <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-12 rounded-xl shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Welcome!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Explore physics concepts through clear notes and explanations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Latest Articles</h2>
        <div className="space-y-4">
          {latestArticles.map((article: Article) => (
            <article key={article.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 hover:border-blue-600">
              <header>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 className="text-xl font-bold">
                  <Link to={`/article/${article.id}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </Link>
                </h3>
              </header>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{article.summary}</p>
              <Link to={`/article/${article.id}`} className="inline-flex items-center mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
