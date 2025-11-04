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

// --- Helper: extract LaTeX remark environments ---
const extractRemarkBlocks = (text: string) => {
  const remarks: string[] = [];
  const placeholder = '__REMARK_PLACEHOLDER__';
  const processed = text.replace(/\\begin\{remarque\}([\s\S]*?)\\end\{remarque\}/g, (match, content) => {
    remarks.push(content.trim());
    return `${placeholder}${remarks.length - 1}${placeholder}`;
  });
  return { processed, remarks };
};

// --- Helper: render inline and display math using KaTeX ---
const renderMathToHTML = (text: string): string => {
  return text.replace(
    /(\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g,
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
      `<div class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-3 rounded">
         <strong>Remarque:</strong> ${inner}
       </div>`
    );
  });
  return restored;
};

// --- Main component ---
const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderedParts = useMemo(() => {
    // Step 1: Extract remark blocks
    const { processed: textWithoutRemarks, remarks } = extractRemarkBlocks(content);

    // Step 2: Apply text formatting
    let processed = processLatexTextCommands(textWithoutRemarks);

    // Step 3: Render math outside of remark blocks
    let html = renderMathToHTML(processed);

    // Step 4: Restore remarks (rendering math inside them too)
    html = restoreRemarkBlocks(html, remarks);

    // Step 5: Sanitize final output
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { ADD_ATTR: ['class'] }) }} />;
  }, [content]);

  return <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">{renderedParts}</div>;
};

export default ContentRenderer;