import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
}

// --- Helper: process LaTeX text commands like \textbf, \section, etc.
const processLatexTextCommands = (text: string): string => {
  let processed = text;

  processed = processed.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
  processed = processed.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
  processed = processed.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');
  processed = processed.replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>');

  processed = processed.replace(/\\section\{([^}]*)\}/g, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
  processed = processed.replace(/\\subsection\{([^}]*)\}/g, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>');
  processed = processed.replace(/\\subsubsection\{([^}]*)\}/g, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');

  return processed;
};

// --- Helper: process LaTeX environments and protect remark boxes
const extractRemarkBlocks = (text: string) => {
  const remarks: string[] = [];
  const placeholder = '__REMARK_PLACEHOLDER__';

  const processed = text.replace(/\\begin\{remarque\}([\s\S]*?)\\end\{remarque\}/g, (match, content) => {
    remarks.push(content.trim());
    return `${placeholder}${remarks.length - 1}${placeholder}`;
  });

  return { processed, remarks };
};

const restoreRemarkBlocks = (text: string, remarks: string[]) => {
  let restored = text;

  remarks.forEach((content, i) => {
    const inner = DOMPurify.sanitize(content, { ADD_ATTR: ['class'] });
    restored = restored.replace(
      new RegExp(`__REMARK_PLACEHOLDER__${i}__REMARK_PLACEHOLDER__`, 'g'),
      `<div class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-3 rounded">
         <strong>Remarque:</strong> ${inner}
       </div>`
    );
  });

  return restored;
};

// --- Main component
const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderedParts = useMemo(() => {
    // Step 1: Extract remark blocks before KaTeX splitting
    const { processed: textWithoutRemarks, remarks } = extractRemarkBlocks(content);

    // Step 2: Process text formatting commands
    let processedContent = processLatexTextCommands(textWithoutRemarks);

    // Step 3: Split text into math and non-math parts
    const parts = processedContent.split(
      /(\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g
    );

    // Step 4: Render KaTeX
    const renderedParts = parts.map((part, index) => {
      try {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.slice(2, -2);
          const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
          return (
            <div
              key={index}
              className="my-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
            />
          );
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1);
          const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
            />
          );
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          const latex = part.slice(2, -2);
          const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
            />
          );
        }
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          const latex = part.slice(2, -2);
          const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
          return (
            <div
              key={index}
              className="my-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
            />
          );
        }
      } catch (err) {
        console.error('KaTeX rendering error:', err);
      }

      // Otherwise render plain text (with basic HTML)
      const sanitized = DOMPurify.sanitize(part, {
        ALLOWED_TAGS: ['strong', 'em', 'u', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'div', 'br', 'p', 'span'],
        ALLOWED_ATTR: ['class'],
      });

      return <span key={index} dangerouslySetInnerHTML={{ __html: sanitized }} />;
    });

    // Step 5: Join everything and restore remark boxes
    const htmlJoined = renderedParts.map((r) => (typeof r === 'string' ? r : (r as any).props?.dangerouslySetInnerHTML?.__html || '')).join('');
    const restoredHTML = restoreRemarkBlocks(htmlJoined, remarks);

    // Step 6: Final sanitized React output
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(restoredHTML) }} />;
  }, [content]);

  return (
    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
      {renderedParts}
    </div>
  );
};

export default ContentRenderer;
