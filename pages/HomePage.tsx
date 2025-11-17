
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6">
          Explore articles, tutorials, and projects about physics, programming, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            to="/blog"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Articles
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            View Projects
          </Link>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Latest Posts</h2>
          <Link
            to="/blog"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-6">
          {latestArticles.map((article: Article) => (
            <article key={article.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 hover:border-blue-600">
              <header>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h3 className="text-2xl font-bold mb-3">
                  <Link to={`/article/${article.id}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </Link>
                </h3>
              </header>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{article.summary}</p>
              <Link to={`/article/${article.id}`} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                Read more →
              </Link>
            </article>
          ))}
        </div>
        {latestArticles.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No articles yet. Check back soon!
          </p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
