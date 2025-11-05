import React, { useMemo, useEffect, useState } from 'react';
import { generateId } from '../utils/idGenerator';

interface TOCItem {
  id: string;
  title: string;
  level: number; // 2 for section, 3 for subsection, 4 for subsubsection
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [activeId, setActiveId] = useState<string>('');

  // Extract sections, subsections, and subsubsections from content
  const tocItems = useMemo(() => {
    const items: TOCItem[] = [];
    
    // Match \section{...}, \subsection{...}, and \subsubsection{...}
    const sectionRegex = /\\section\{([^}]*)\}/g;
    const subsectionRegex = /\\subsection\{([^}]*)\}/g;
    const subsubsectionRegex = /\\subsubsection\{([^}]*)\}/g;
    
    // Create a combined array with all matches and their positions
    const allMatches: { title: string; level: number; index: number }[] = [];
    
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      allMatches.push({ title: match[1], level: 2, index: match.index });
    }
    
    while ((match = subsectionRegex.exec(content)) !== null) {
      allMatches.push({ title: match[1], level: 3, index: match.index });
    }
    
    while ((match = subsubsectionRegex.exec(content)) !== null) {
      allMatches.push({ title: match[1], level: 4, index: match.index });
    }
    
    // Sort by position in content
    allMatches.sort((a, b) => a.index - b.index);
    
    // Generate IDs and create TOC items
    allMatches.forEach((item) => {
      const id = generateId(item.title);
      items.push({ id, title: item.title, level: item.level });
    });
    
    return items;
  }, [content]);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    // Observe all headings
    const headings = document.querySelectorAll('h2, h3, h4');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      // Cleanup: disconnect observer when component unmounts
      observer.disconnect();
    };
  }, [tocItems]); // Re-run when tocItems change

  if (tocItems.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-6 hidden lg:block max-h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
          Table of Contents
        </h3>
        <ul className="space-y-1 text-sm">
          {tocItems.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}
            >
              <button
                onClick={() => handleClick(item.id)}
                className={`text-left w-full py-1.5 px-2 rounded transition-colors ${
                  activeId === item.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;
