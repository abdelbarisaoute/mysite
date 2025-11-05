import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { generateId } from '../utils/idGenerator';

interface ContentRendererProps {
  content: string;
}

// Regex pattern for matching math expressions (used consistently across functions)
const MATH_EXPRESSION_REGEX = /(\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g;

// --- Helper: process LaTeX text commands like \textbf, \section, etc.
const processLatexTextCommands = (text: string): string => {
  let processed = text;
  processed = processed.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
  processed = processed.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
  processed = processed.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');
  processed = processed.replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>');
  processed = processed.replace(/\\section\{([^}]*)\}/g, (match, title) => {
    const id = generateId(title);
    return `<h2 id="${id}" class="text-2xl font-bold mt-6 mb-3">${title}</h2>`;
  });
  processed = processed.replace(/\\subsection\{([^}]*)\}/g, (match, title) => {
    const id = generateId(title);
    return `<h3 id="${id}" class="text-xl font-bold mt-5 mb-2">${title}</h3>`;
  });
  processed = processed.replace(/\\subsubsection\{([^}]*)\}/g, (match, title) => {
    const id = generateId(title);
    return `<h4 id="${id}" class="text-lg font-bold mt-4 mb-2">${title}</h4>`;
  });
  return processed;
};

// --- Helper: extract LaTeX list environments (itemize, enumerate) ---
const extractListBlocks = (text: string) => {
  const lists: Array<{ content: string; type: 'itemize' | 'enumerate' }> = [];
  const placeholder = '__LIST_PLACEHOLDER__';
  
  const extractListType = (input: string, listType: 'itemize' | 'enumerate') => {
    const regex = new RegExp(`\\\\begin\\{${listType}\\}([\\s\\S]*?)\\\\end\\{${listType}\\}`, 'g');
    return input.replace(regex, (match, content) => {
      lists.push({ content: content.trim(), type: listType });
      return `${placeholder}${lists.length - 1}${placeholder}`;
    });
  };
  
  let processed = extractListType(text, 'itemize');
  processed = extractListType(processed, 'enumerate');
  
  return { processed, lists };
};

// --- Helper: extract LaTeX remark environments ---
const extractRemarkBlocks = (text: string) => {
  const remarks: string[] = [];
  const placeholder = '__REMARK_PLACEHOLDER__';
  // Support both \begin{remark} and \begin{remarque}
  const processed = text.replace(/\\begin\{(remark|remarque)\}([\s\S]*?)\\end\{\1\}/g, (match, type, content) => {
    remarks.push(content.trim());
    return `${placeholder}${remarks.length - 1}${placeholder}`;
  });
  return { processed, remarks };
};

// --- Helper: extract and convert Markdown tables to HTML ---
const extractMarkdownTables = (text: string) => {
  const tables: string[] = [];
  const placeholder = '__TABLE_PLACEHOLDER__';
  
  // Match Markdown tables (header, separator, rows)
  const tableRegex = /(\|[^|\n]+(?:\|[^|\n]+)*\|)\n\s*(\|[\s:|-]+\|)\n((?:\|[^|\n]+(?:\|[^|\n]+)*\|\n?)*)/gm;
  
  const processed = text.replace(tableRegex, (match, header, separator, rows) => {
    // Parse header - sanitize each cell
    const headerCells = header.split('|').filter(cell => cell.trim()).map(cell => 
      DOMPurify.sanitize(cell.trim(), { ALLOWED_TAGS: [] })
    );
    
    // Parse rows
    const rowLines = rows.trim().split('\n').filter(line => line.trim());
    const rowsData = rowLines.map(row => {
      const cells = row.split('|').filter(cell => cell.trim()).map(cell => 
        DOMPurify.sanitize(cell.trim(), { ALLOWED_TAGS: [] })
      );
      // Ensure row has same number of columns as header
      while (cells.length < headerCells.length) {
        cells.push('');
      }
      return cells.slice(0, headerCells.length);
    });
    
    // Build HTML table
    const tableHTML = `
      <table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600 my-4">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            ${headerCells.map(cell => `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">${cell}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rowsData.map(row => `
            <tr>
              ${row.map(cell => `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    tables.push(tableHTML);
    return `${placeholder}${tables.length - 1}${placeholder}`;
  });
  
  return { processed, tables };
};

// --- Helper: extract math expressions to protect them during paragraph processing ---
const extractMathExpressions = (text: string) => {
  const mathExpressions: string[] = [];
  const placeholder = '__MATH_PLACEHOLDER__';
  const processed = text.replace(
    MATH_EXPRESSION_REGEX,
    (match) => {
      mathExpressions.push(match);
      return `${placeholder}${mathExpressions.length - 1}${placeholder}`;
    }
  );
  return { processed, mathExpressions };
};

// --- Helper: render inline and display math using KaTeX ---
const renderMathToHTML = (text: string): string => {
  return text.replace(
    MATH_EXPRESSION_REGEX,
    (match) => {
      try {
        let latex = match;
        let displayMode = false;

        if (latex.startsWith('$$') && latex.endsWith('$$')) {
          latex = latex.slice(2, -2);
          displayMode = true;
        } else if (latex.startsWith('\\[') && latex.endsWith('\\]')) {
          latex = latex.slice(2, -2);
          displayMode = true;
        } else if (latex.startsWith('\\(') && latex.endsWith('\\)')) {
          latex = latex.slice(2, -2);
          displayMode = false;
        } else if (latex.startsWith('$') && latex.endsWith('$')) {
          latex = latex.slice(1, -1);
          displayMode = false;
        }

        return katex.renderToString(latex, { displayMode, throwOnError: false });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        return match;
      }
    }
  );
};

// --- Helper: restore math expressions after paragraph processing ---
const restoreMathExpressions = (text: string, mathExpressions: string[]) => {
  let restored = text;
  mathExpressions.forEach((mathExpr, i) => {
    const placeholder = `__MATH_PLACEHOLDER__${i}__MATH_PLACEHOLDER__`;
    // Render the math expression to HTML
    const rendered = renderMathToHTML(mathExpr);
    restored = restored.split(placeholder).join(rendered);
  });
  return restored;
};

// --- Helper: restore list blocks (with KaTeX rendering inside) ---
const restoreListBlocks = (text: string, lists: Array<{ content: string; type: 'itemize' | 'enumerate' }>) => {
  let restored = text;
  lists.forEach((list, i) => {
    // Split the content by \item and filter out empty entries
    // (The first element before the first \item will be empty)
    const items = list.content.split(/\\item/).filter(item => item.trim());
    
    // Process each item: apply formatting and render math
    const processedItems = items.map(item => {
      const processed = processLatexTextCommands(item.trim());
      const rendered = renderMathToHTML(processed);
      return DOMPurify.sanitize(rendered, { ADD_ATTR: ['class'] });
    });
    
    // Build the HTML list
    const listTag = list.type === 'itemize' ? 'ul' : 'ol';
    const listClass = list.type === 'itemize' ? 'list-disc list-inside my-3' : 'list-decimal list-inside my-3';
    const listHTML = `<${listTag} class="${listClass}">${processedItems.map(item => `<li class="mb-1">${item}</li>`).join('')}</${listTag}>`;
    
    const placeholder = `__LIST_PLACEHOLDER__${i}__LIST_PLACEHOLDER__`;
    restored = restored.split(placeholder).join(listHTML);
  });
  return restored;
};

// --- Helper: restore remark blocks (with KaTeX rendering inside) ---
const restoreRemarkBlocks = (text: string, remarks: string[]) => {
  let restored = text;
  remarks.forEach((content, i) => {
    // Process formatting and math inside the remark
    const processed = processLatexTextCommands(content);
    const rendered = renderMathToHTML(processed);
    const inner = DOMPurify.sanitize(rendered, { ADD_ATTR: ['class'] });

    const placeholder = `__REMARK_PLACEHOLDER__${i}__REMARK_PLACEHOLDER__`;
    restored = restored.split(placeholder).join(
      `<div class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-3 rounded"><strong>Remark:</strong> ${inner}</div>`
    );
  });
  return restored;
};

// --- Helper: restore table blocks (with KaTeX rendering inside) ---
const restoreTableBlocks = (text: string, tables: string[]) => {
  let restored = text;
  tables.forEach((tableHTML, i) => {
    // Render math expressions in table cells
    const rendered = renderMathToHTML(tableHTML);
    const sanitized = DOMPurify.sanitize(rendered, { ADD_ATTR: ['class'], ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'] });
    
    const placeholder = `__TABLE_PLACEHOLDER__${i}__TABLE_PLACEHOLDER__`;
    restored = restored.split(placeholder).join(sanitized);
  });
  return restored;
};

// --- Helper: convert paragraph breaks (double newlines) to HTML paragraphs ---
const processParagraphs = (text: string): string => {
  // Split by double newlines (or more) to identify paragraphs
  const paragraphs = text.split(/\n\s*\n+/);
  
  // Wrap each paragraph in <p> tags, but skip if it's already a block-level element
  return paragraphs
    .map(para => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      
      // Don't wrap if it's already a block element (heading, div, etc.) or placeholder
      if (trimmed.startsWith('<h') || 
          trimmed.startsWith('<div') ||
          trimmed.startsWith('__MATH_PLACEHOLDER__') ||
          trimmed.startsWith('__LIST_PLACEHOLDER__') ||
          trimmed.startsWith('__REMARK_PLACEHOLDER__') ||
          trimmed.startsWith('__TABLE_PLACEHOLDER__')) {
        return trimmed;
      }
      
      // Don't add <br> for single newlines - this was causing issues with math
      // Just wrap in <p> tags and let the browser handle text flow
      return `<p>${trimmed}</p>`;
    })
    .filter(p => p)
    .join('\n');
};

// --- Main component ---
const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderedParts = useMemo(() => {
    // Step 1: Extract list blocks (itemize, enumerate)
    const { processed: textWithoutLists, lists } = extractListBlocks(content);

    // Step 2: Extract remark blocks
    const { processed: textWithoutRemarks, remarks } = extractRemarkBlocks(textWithoutLists);

    // Step 3: Extract Markdown tables
    const { processed: textWithoutTables, tables } = extractMarkdownTables(textWithoutRemarks);

    // Step 4: Extract math expressions to protect them during paragraph processing
    const { processed: textWithoutMath, mathExpressions } = extractMathExpressions(textWithoutTables);

    // Step 5: Apply text formatting
    let processed = processLatexTextCommands(textWithoutMath);

    // Step 6: Process paragraph breaks (now safe, math is protected)
    processed = processParagraphs(processed);

    // Step 7: Restore math expressions (rendering them to HTML)
    let html = restoreMathExpressions(processed, mathExpressions);

    // Step 8: Restore remarks (rendering math inside them too)
    html = restoreRemarkBlocks(html, remarks);

    // Step 9: Restore table blocks (rendering math inside them too)
    html = restoreTableBlocks(html, tables);

    // Step 10: Restore list blocks (rendering math inside them too)
    html = restoreListBlocks(html, lists);

    // Step 11: Sanitize final output
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { ADD_ATTR: ['class'], ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'] }) }} />;
  }, [content]);

  return <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed overflow-x-auto">{renderedParts}</div>;
};

export default ContentRenderer;
