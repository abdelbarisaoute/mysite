
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { ArticleContext } from '../context/ArticleContext';

const HomePage: React.FC = () => {
  const { articles } = useContext(ArticleContext);

  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome to My Digital Space</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          I am a passionate researcher and writer exploring the frontiers of science. This website is a collection of my thoughts, findings, and professional journey.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-blue-500">Latest Publications</h2>
        <div className="space-y-8">
          {latestArticles.map((article: Article) => (
            <article key={article.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md dark:hover:bg-gray-700/40 transition-shadow">
              <header>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 className="text-2xl font-bold">
                  <Link to={`/article/${article.id}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </Link>
                </h3>
              </header>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{article.summary}</p>
              <Link to={`/article/${article.id}`} className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold">
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;