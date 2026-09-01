
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArticleContext } from '../context/ArticleContext';
import BlogTableOfContents from '../components/BlogTableOfContents';

const ContentsPage: React.FC = () => {
  const { articles } = useContext(ArticleContext);

  const sortedArticles = useMemo(() => 
    [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [articles]
  );

  return (
    <div className="flex gap-8 items-start">
      {/* Table of Contents - Left Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20">
        <BlogTableOfContents articles={sortedArticles} />
      </aside>

      {/* Main Blog Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-8 text-center p-8 border border-gray-200 dark:border-gray-800 rounded">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Blog</h1>
          <p className="text-base text-gray-600 dark:text-gray-400">All articles and posts</p>
        </div>
        <div className="space-y-6">
          {sortedArticles.map(article => (
            <Link 
              key={article.id} 
              to={`/article/${article.id}`}
              className="block bg-white dark:bg-gray-900 p-6 rounded border border-gray-200 dark:border-gray-800"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 hover:underline underline-offset-4 mb-3">
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
    </div>
  );
};

export default ContentsPage;
