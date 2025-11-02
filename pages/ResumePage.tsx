
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
    handleCancel,
    isSaving
  } = useEditableContent('resumeContent', initialResumeContent, 'data/resume.ts');
  
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  
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
  
  const [previewHtml, setPreviewHtml] = useState<string>('');
  
  useEffect(() => {
    if (isEditing && showPreview && typeof marked !== 'undefined') {
      setPreviewHtml(marked.parse(editedContent));
    }
  }, [editedContent, isEditing, showPreview]);

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
        <div className="space-y-4">
          {/* Toggle for split view */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Live Preview</span>
            </label>
          </div>
          
          <div className={`${showPreview ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resume Content (Markdown)
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded-md font-mono text-sm bg-white dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                style={{ minHeight: '500px' }}
                aria-label="Resume Content"
              />
            </div>
            
            {showPreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Live Preview
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 overflow-auto" style={{ minHeight: '500px' }}>
                  {/* Note: Content is from authenticated admin and parsed by trusted marked.js library */}
                  <div
                    className="prose dark:prose-invert max-w-none text-lg leading-relaxed prose-h1:text-4xl prose-h1:text-center prose-h1+p:text-center prose-headings:mt-8 prose-headings:mb-4 prose-hr:my-8"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button onClick={handleCancel} disabled={isSaving} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
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