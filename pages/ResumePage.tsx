
import React, { useState, useEffect } from 'react';
import { resumeData } from '../data/resume';
import ContentRenderer from '../components/ContentRenderer';

const ResumePage: React.FC = () => {
  // Load saved resume from localStorage if available
  const [resume, setResume] = useState(resumeData);
  
  useEffect(() => {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      try {
        const parsedResume = JSON.parse(savedResume);
        setResume(parsedResume);
      } catch (e) {
        console.error('Failed to parse saved resume:', e);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 sm:p-10 rounded border border-gray-200 dark:border-gray-800">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">{resume.name}</h1>
        <div 
          className="text-center text-gray-600 dark:text-gray-400 mt-3 text-sm"
          dangerouslySetInnerHTML={{ __html: resume.contact }}
        />
      </div>

      <div className="space-y-6">
        {resume.sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              {section.title}
            </h2>
            <div className="pl-1">
              <ContentRenderer content={section.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePage;
