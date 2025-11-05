import React, { useMemo, useEffect, useState } from 'react';
import { generateId } from '../utils/idGenerator';
import { AnnexPart } from '../types';

interface TOCItem {
  id: string;
  title: string;
  level: number; // 1 for part, 2 for section, 3 for subsection, 4 for subsubsection
  partTitle: string; // The title of the part this section belongs to
}

interface AnnexTableOfContentsProps {
  parts: AnnexPart[];
}

const AnnexTableOfContents: React.FC<AnnexTableOfContentsProps> = ({ parts }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract sections, subsections, and subsubsections from all parts
  const allTocItems = useMemo(() => {
    const items: TOCItem[] = [];
    
    parts.forEach((part) => {
      // Add the part title itself as a main item
      items.push({
        id: generateId(part.title),
        title: part.title,
        level: 1, // Part level
        partTitle: part.title
      });

      // Match \section{...}, \subsection{...}, and \subsubsection{...}
      const sectionRegex = /\\section\{([^}]*)\}/g;
      const subsectionRegex = /\\subsection\{([^}]*)\}/g;
      const subsubsectionRegex = /\\subsubsection\{([^}]*)\}/g;
      
      // Create a combined array with all matches and their positions
      const allMatches: { title: string; level: number; index: number }[] = [];
      
      let match;
      while ((match = sectionRegex.exec(part.content)) !== null) {
        allMatches.push({ title: match[1], level: 2, index: match.index });
      }
      
      while ((match = subsectionRegex.exec(part.content)) !== null) {
        allMatches.push({ title: match[1], level: 3, index: match.index });
      }
      
      while ((match = subsubsectionRegex.exec(part.content)) !== null) {
        allMatches.push({ title: match[1], level: 4, index: match.index });
      }
      
      // Sort by position in content
      allMatches.sort((a, b) => a.index - b.index);
      
      // Generate IDs and create TOC items
      allMatches.forEach((item) => {
        const id = generateId(item.title);
        items.push({ id, title: item.title, level: item.level, partTitle: part.title });
      });
    });
    
    return items;
  }, [parts]);

  // Filter TOC items based on search query
  const filteredTocItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTocItems;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    return allTocItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.partTitle.toLowerCase().includes(lowerQuery)
    );
  }, [allTocItems, searchQuery]);

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
  }, [filteredTocItems]); // Re-run when filteredTocItems change

  if (allTocItems.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Header height (64px from h-16) + padding (16px) = 80px
      const HEADER_OFFSET = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="max-h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
          Table of Contents
        </h3>
        
        {/* Search bar for annex content */}
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search in annex..."
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {filteredTocItems.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {filteredTocItems.map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
              >
                <button
                  onClick={() => handleClick(item.id)}
                  className={`text-left w-full py-1.5 px-2 rounded transition-colors ${
                    activeId === item.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  } ${item.level === 1 ? 'font-semibold' : ''}`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            No results found
          </p>
        )}
      </div>
    </nav>
  );
};

export default AnnexTableOfContents;
