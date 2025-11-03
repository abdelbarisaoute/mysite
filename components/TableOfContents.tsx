import React, { useMemo } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number; // 2 for section, 3 for subsection, 4 for subsubsection
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const tocItems = useMemo(() => {
    const items: TOCItem[] = [];
    
    // Extract sections
    const sectionRegex = /\\section\{([^}]*)\}/g;
    let match;
    
    while ((match = sectionRegex.exec(content)) !== null) {
      const text = match[1];
      const id = `section-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      items.push({ id, text, level: 2 });
    }
    
    // Extract subsections
    const subsectionRegex = /\\subsection\{([^}]*)\}/g;
    while ((match = subsectionRegex.exec(content)) !== null) {
      const text = match[1];
      const id = `subsection-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      items.push({ id, text, level: 3 });
    }
    
    // Extract subsubsections
    const subsubsectionRegex = /\\subsubsection\{([^}]*)\}/g;
    while ((match = subsubsectionRegex.exec(content)) !== null) {
      const text = match[1];
      const id = `subsubsection-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      items.push({ id, text, level: 4 });
    }
    
    // Sort by position in content
    return items.sort((a, b) => {
      // Find the position of each item based on its level
      const getPosition = (item: TOCItem) => {
        if (item.level === 2) {
          return content.indexOf(`\\section{${item.text}}`);
        } else if (item.level === 3) {
          return content.indexOf(`\\subsection{${item.text}}`);
        } else if (item.level === 4) {
          return content.indexOf(`\\subsubsection{${item.text}}`);
        }
        return -1;
      };
      
      return getPosition(a) - getPosition(b);
    });
  }, [content]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="table-of-contents sticky top-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">Contents</h2>
      <nav>
        <ul className="space-y-1">
          {tocItems.map((item) => (
            <li
              key={item.id}
              className={`${
                item.level === 2 ? 'ml-0' : item.level === 3 ? 'ml-4' : 'ml-8'
              }`}
            >
              <button
                onClick={() => handleClick(item.id)}
                className={`text-left text-sm hover:text-blue-600 dark:hover:text-blue-400 transition ${
                  item.level === 2
                    ? 'font-semibold text-gray-800 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
