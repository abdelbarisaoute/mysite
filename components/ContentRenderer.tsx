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

// --- Helper: extract LaTeX remark environments ---
const extractRemarkBlocks = (text: string) => {
  const remarks: string[] = [];
  const placeholder = '__REMARK_PLACEHOLDER__';
  const processed = text.replace(/\\begin\{remark\}([\s\S]*?)\\end\{remark\}/g, (match, content) => {
    remarks.push(content.trim());
    return `${placeholder}${remarks.length - 1}${placeholder}`;
  });
  return { processed, remarks };
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
      `<div class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-3 rounded"><strong>Remarque:</strong> ${inner}</div>`
    );
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
          trimmed.startsWith('__MATH_PLACEHOLDER__')) {
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
    // Step 1: Extract remark blocks
    const { processed: textWithoutRemarks, remarks } = extractRemarkBlocks(content);

    // Step 2: Extract math expressions to protect them during paragraph processing
    const { processed: textWithoutMath, mathExpressions } = extractMathExpressions(textWithoutRemarks);

    // Step 3: Apply text formatting
    let processed = processLatexTextCommands(textWithoutMath);

    // Step 4: Process paragraph breaks (now safe, math is protected)
    processed = processParagraphs(processed);

    // Step 5: Restore math expressions (rendering them to HTML)
    let html = restoreMathExpressions(processed, mathExpressions);

    // Step 6: Restore remarks (rendering math inside them too)
    html = restoreRemarkBlocks(html, remarks);

    // Step 7: Sanitize final output
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { ADD_ATTR: ['class'] }) }} />;
  }, [content]);

  return <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed overflow-x-auto">{renderedParts}</div>;
};

export default ContentRenderer;
