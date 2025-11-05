import React from 'react';
import ContentRenderer from './ContentRenderer';

interface ArticlePreviewProps {
  title: string;
  date: string;
  summary: string;
  content: string;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ title, date, summary, content }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-h-full overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Preview
        </p>
        <div className="border-b border-gray-300 dark:border-gray-600 pb-4 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Published on {date || new Date().toISOString().split('T')[0]}
          </p>
          <h1 className="text-4xl font-bold mb-4">{title || 'Untitled Article'}</h1>
          {summary && (
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              {summary}
            </p>
          )}
        </div>
      </div>
      
      {content ? (
        <ContentRenderer content={content} />
      ) : (
        <p className="text-gray-400 dark:text-gray-500 italic">
          Start typing to see the preview...
        </p>
      )}
    </div>
  );
};

export default ArticlePreview;
