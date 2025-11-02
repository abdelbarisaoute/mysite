
import React, { useState, useEffect, useContext } from 'react';
import { resumeContent as initialResumeContent } from '../data/resume';
import { AuthContext } from '../context/AuthContext';
import { useEditableContent } from '../hooks/useEditableContent';

declare const marked: any;

const ResumePage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { 
    isEditing, 
    setIsEditing, 
    content, 
    editedContent, 
    setEditedContent, 
    handleSave,
    handleCancel
  } = useEditableContent('resumeContent', initialResumeContent);
  
  const [htmlContent, setHtmlContent] = useState<string>('');
  
  useEffect(() => {
    const parseMarkdown = () => {
      if (typeof marked !== 'undefined') {
        setHtmlContent(marked.parse(content));
        return true;
      }
      return false;
    };
    if (!parseMarkdown()) {
      const timer = setTimeout(parseMarkdown, 100);
      return () => clearTimeout(timer);
    }
  }, [content]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-blue-500">
        <h1 className="text-3xl font-bold">Resume</h1>
        {isAuthenticated && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition">
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-screen p-2 border rounded-md font-mono bg-white dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            aria-label="Resume Content"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition">Cancel</button>
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition">Save</button>
          </div>
        </div>
      ) : htmlContent ? (
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