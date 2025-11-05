
import React, { useState, useEffect } from 'react';
import ContentRenderer from '../components/ContentRenderer';
import { Annex } from '../types';
import { annexData } from '../data/annex';

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
    <div className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-6">{annex.title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          <ContentRenderer content={annex.content} />
        </div>
      </article>
    </div>
  );
};

export default AnnexPage;
