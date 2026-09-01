
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
      <section className="text-center p-10 border border-gray-200 dark:border-gray-800 rounded">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Explore articles, tutorials, and projects about physics, programming, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            to="/blog"
            className="px-5 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          >
            Browse Articles
          </Link>
          <Link
            to="/projects"
            className="px-5 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          >
            View Projects
          </Link>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Latest Posts</h2>
          <Link
            to="/blog"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-6">
          {latestArticles.map((article: Article) => (
            <article key={article.id} className="bg-white dark:bg-gray-900 p-6 rounded border border-gray-200 dark:border-gray-800">
              <header>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h3 className="text-2xl font-semibold mb-3">
                <Link to={`/article/${article.id}`} className="text-gray-900 dark:text-gray-100 hover:underline underline-offset-4">
                    {article.title}
                  </Link>
                </h3>
              </header>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{article.summary}</p>
              <Link to={`/article/${article.id}`} className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:underline underline-offset-4">
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
