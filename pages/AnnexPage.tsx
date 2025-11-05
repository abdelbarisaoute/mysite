
import React, { useState, useEffect } from 'react';
import ContentRenderer from '../components/ContentRenderer';
import AnnexTableOfContents from '../components/AnnexTableOfContents';
import { Annex } from '../types';
import { annexData } from '../data/annex';
import { generateId } from '../utils/idGenerator';

const AnnexPage: React.FC = () => {
  const [annex, setAnnex] = useState<Annex>(annexData);

  // Load annex from localStorage if available (for admin edits)
  useEffect(() => {
    const savedAnnex = localStorage.getItem('annex');
    if (savedAnnex) {
      try {
        const parsedAnnex = JSON.parse(savedAnnex);
        setAnnex(parsedAnnex);
      } catch (e) {
        console.error('Failed to parse saved annex:', e);
      }
    }
  }, []);

  return (
    <div className="flex gap-8 items-start">
      {/* Table of Contents - Left Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20">
        <AnnexTableOfContents parts={annex.parts || []} />
      </aside>

      {/* Main Annex Content */}
      <div className="flex-1 min-w-0">
        <article className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 mb-6">
          <h1 className="text-4xl font-bold mb-6">{annex.title}</h1>
        </article>
        
        {/* Render each part independently */}
        {annex.parts && annex.parts.map((part) => (
          <article key={part.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 mb-6">
            <h2 id={generateId(part.title)} className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">{part.title}</h2>
            <div className="prose dark:prose-invert max-w-none">
              <ContentRenderer content={part.content} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AnnexPage;
