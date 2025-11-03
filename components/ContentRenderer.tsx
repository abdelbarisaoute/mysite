import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
}

// --- Helper: process text-based LaTeX commands like \textbf, \section, etc.
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

// --- Helper: process LaTeX environments like \begin{itemize}, \begin{remarque}, etc.
const processLatexEnvironments = (text: string): string => {
  let processed = text;

  // Itemize lists
  processed = processed.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, content) => {
    const items = content.split(/\\item\s+/).filter((item) => item.trim());
    return `<ul class="list-disc ml-6 my-3">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  });

  // Enumerate lists
  processed = processed.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, content) => {
    const items = content.split(/\\item\s+/).filter((item) => item.trim());
    return `<ol class="list-decimal ml-6 my-3">${items.map((item) => `<li>${item}</li>`).join('')}</ol>`;
  });

  // --- FIXED: Remarque environment now keeps math delimiters intact
  processed = processed.replace(
    /\\begin\{remarque\}([\s\S]*?)\\end\{remarque\}/g,
    (match, content) => {
      return `<div class="remarque border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-3 rounded">
        <strong>Remarque:</strong> ${content.trim()}
      </div>`;
    }
  );

  return processed;
};

// --- Component ---
const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderedParts = useMemo(() => {
    // Step 1: Handle environments first (preserve math delimiters inside)
    let processedContent = processLatexEnvironments(content);

    // Step 2: Handle inline LaTeX text commands
    processedContent = processLatexTextCommands(processedContent);

    // Step 3: Split into KaTeX and text parts
    const parts = processedContent.split(
      /(\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g
    );

    return parts.map((part, index) => {
      try {
        // Display equations
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

        // Inline equations
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

        // \(...\)
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

        // \[...\]
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

      // Step 4: Sanitize and render HTML (for remarque, headings, etc.)
      const sanitized = DOMPurify.sanitize(part, {
        ALLOWED_TAGS: [
          'strong', 'em', 'u', 'h2', 'h3', 'h4', 'ul', 'ol', 'li',
          'div', 'br', 'p', 'span'
        ],
        ALLOWED_ATTR: ['class'],
      });

      // Handle newlines in plain text
      return sanitized.split('\n').map((line, i) => (
        <React.Fragment key={`${index}-${i}`}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          {i < sanitized.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    });
  }, [content]);

  return (
    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
      {renderedParts}
    </div>
  );
};

export default ContentRenderer;
