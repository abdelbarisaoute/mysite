
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
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
      <div className="mb-6 pb-2 border-b-2 border-blue-500">
        <h1 className="text-3xl font-bold text-center">{resume.name}</h1>
        <div 
          className="text-center text-gray-600 dark:text-gray-400 mt-2"
          dangerouslySetInnerHTML={{ __html: resume.contact }}
        />
      </div>

      <div className="space-y-8">
        {resume.sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-2xl font-bold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
              {section.title}
            </h2>
            <ContentRenderer content={section.content} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePage;
