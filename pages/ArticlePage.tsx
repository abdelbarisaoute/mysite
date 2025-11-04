
import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentRenderer from '../components/ContentRenderer';
import TableOfContents from '../components/TableOfContents';
import { ArticleContext } from '../context/ArticleContext';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useContext(ArticleContext);
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-4">The article you are looking for does not exist.</p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-8 items-start">
      {/* Table of Contents - Left Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <TableOfContents content={article.content} />
      </aside>

      {/* Main Article Content */}
      <article className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm flex-1 min-w-0">
        <header className="mb-8 border-b dark:border-gray-700 pb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Published on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex justify-between items-start">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{article.title}</h1>
          </div>
        </header>
        
        <ContentRenderer content={article.content} />
      </article>
    </div>
  );
};

export default ArticlePage;
