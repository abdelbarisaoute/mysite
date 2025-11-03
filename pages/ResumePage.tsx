
import React, { useState, useEffect } from 'react';
import { resumeContent } from '../data/resume';

declare const marked: any;

const ResumePage: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  
  useEffect(() => {
    const parseMarkdown = () => {
      if (typeof marked !== 'undefined') {
        setHtmlContent(marked.parse(resumeContent));
        return true;
      }
      return false;
    };
    if (!parseMarkdown()) {
      const timer = setTimeout(parseMarkdown, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <div className="mb-6 pb-2 border-b-2 border-blue-500">
        <h1 className="text-3xl font-bold">Resume</h1>
      </div>

      {htmlContent ? (
        <div
          className="prose dark:prose-invert max-w-none text-lg leading-relaxed prose-h1:text-4xl prose-h1:text-center prose-h1+p:text-center prose-headings:mt-8 prose-headings:mb-4 prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p>Loading resume...</p>
      )}
    </div>
  );
};

export default ResumePage;
