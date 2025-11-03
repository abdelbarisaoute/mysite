
import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
}

// Note on security: The content processed here comes from authenticated admin users
// and is stored as TypeScript files in the repository. The content goes through
// escapeStringLiteral/escapeTemplateLiteral when saved. We use DOMPurify to sanitize
// the HTML generated from LaTeX commands before rendering.

// Helper function to process LaTeX text commands
const processLatexTextCommands = (text: string): string => {
  let processed = text;
  
  // Handle \textbf{...} - bold text
  processed = processed.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
  
  // Handle \textit{...} - italic text
  processed = processed.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
  
  // Handle \emph{...} - emphasized text
  processed = processed.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');
  
  // Handle \underline{...} - underlined text
  processed = processed.replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>');
  
  // Handle \\section{...} - section headings
  processed = processed.replace(/\\\\section\{([^}]*)\}/g, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
  processed = processed.replace(/\\section\{([^}]*)\}/g, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
  
  // Handle \\subsection{...} - subsection headings
  processed = processed.replace(/\\\\subsection\{([^}]*)\}/g, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>');
  processed = processed.replace(/\\subsection\{([^}]*)\}/g, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>');
  
  // Handle \\subsubsection{...} - subsubsection headings
  processed = processed.replace(/\\\\subsubsection\{([^}]*)\}/g, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');
  processed = processed.replace(/\\subsubsection\{([^}]*)\}/g, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');
  
  return processed;
};

// Helper function to process LaTeX environments
const processLatexEnvironments = (text: string): string => {
  let processed = text;
  
  // Handle \begin{itemize}...\end{itemize} - bullet lists
  processed = processed.replace(/\\\\begin\{itemize\}([\s\S]*?)\\\\end\{itemize\}/g, (match, content) => {
    const items = content.split(/\\\\item\s+/).filter((item: string) => item.trim());
    const listItems = items.map((item: string) => `<li>${item.trim()}</li>`).join('');
    return `<ul class="list-disc ml-6 my-3">${listItems}</ul>`;
  });
  
  processed = processed.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, content) => {
    const items = content.split(/\\item\s+/).filter((item: string) => item.trim());
    const listItems = items.map((item: string) => `<li>${item.trim()}</li>`).join('');
    return `<ul class="list-disc ml-6 my-3">${listItems}</ul>`;
  });
  
  // Handle \begin{enumerate}...\end{enumerate} - numbered lists
  processed = processed.replace(/\\\\begin\{enumerate\}([\s\S]*?)\\\\end\{enumerate\}/g, (match, content) => {
    const items = content.split(/\\\\item\s+/).filter((item: string) => item.trim());
    const listItems = items.map((item: string) => `<li>${item.trim()}</li>`).join('');
    return `<ol class="list-decimal ml-6 my-3">${listItems}</ol>`;
  });
  
  processed = processed.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, content) => {
    const items = content.split(/\\item\s+/).filter((item: string) => item.trim());
    const listItems = items.map((item: string) => `<li>${item.trim()}</li>`).join('');
    return `<ol class="list-decimal ml-6 my-3">${listItems}</ol>`;
  });
  
  // Handle custom environments like \begin{remarque}...\end{remarque}
  processed = processed.replace(/\\\\begin\{remarque\}([\s\S]*?)\\\\end\{remarque\}/g, 
    '<div class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-3 rounded"><strong>Remarque:</strong> $1</div>');
  
  processed = processed.replace(/\\begin\{remarque\}([\s\S]*?)\\end\{remarque\}/g, 
    '<div class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-3 rounded"><strong>Remarque:</strong> $1</div>');
  
  return processed;
};

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderedParts = useMemo(() => {
    // First, process LaTeX environments (must be done before splitting by math delimiters)
    let processedContent = processLatexEnvironments(content);
    
    // Then process text commands
    processedContent = processLatexTextCommands(processedContent);
    
    // Regex to find and capture LaTeX blocks ($$...$$) and inline math ($...$)
   const parts = processedContent.split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g);

    return parts.map((part, index) => {
      try {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.substring(2, part.length - 2);
          const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
          // KaTeX output is already safe, but sanitize for extra security
          const sanitized = DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'style'] });
          return <div key={index} className="my-4" dangerouslySetInnerHTML={{ __html: sanitized }} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.substring(1, part.length - 1);
          const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
          // KaTeX output is already safe, but sanitize for extra security
          const sanitized = DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'style'] });
          return <span key={index} dangerouslySetInnerHTML={{ __html: sanitized }} />;
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const latex = part.substring(2, part.length - 2);
        const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
        const sanitized = DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'style'] });
        return <span key={index} dangerouslySetInnerHTML={{ __html: sanitized }} />;
        }
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const latex = part.substring(2, part.length - 2);
        const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
        const sanitized = DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'style'] });
        return <div key={index} className="my-4" dangerouslySetInnerHTML={{ __html: sanitized }} />;
        }

      } catch (error) {
        console.error("KaTeX rendering error:", error);
        return <span key={index} className="text-red-500">{part}</span>
      }
      
      // Process HTML from LaTeX commands - sanitize before rendering
      if (part.includes('<')) {
        const sanitized = DOMPurify.sanitize(part, {
          ALLOWED_TAGS: ['strong', 'em', 'u', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'div', 'br'],
          ALLOWED_ATTR: ['class'],
        });
        return <span key={index} dangerouslySetInnerHTML={{ __html: sanitized }} />;
      }
      
      // Render newlines correctly from the string content
      return part.split('\n').map((line, lineIndex) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < part.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    });
  }, [content]);

  return <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">{renderedParts}</div>;
};

export default ContentRenderer;
