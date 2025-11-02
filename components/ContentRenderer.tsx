
import React, { useMemo } from 'react';

// This tells TypeScript that a 'katex' object exists on the global window object.
declare const katex: any;

interface ContentRendererProps {
  content: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderedParts = useMemo(() => {
    if (typeof katex === 'undefined') {
      return [<p key="no-katex">KaTeX library not loaded.</p>];
    }
    
    // Regex to find and capture LaTeX blocks ($$...$$) and inline math ($...$)
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);

    return parts.map((part, index) => {
      try {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.substring(2, part.length - 2);
          const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
          return <div key={index} className="my-4" dangerouslySetInnerHTML={{ __html: html }} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.substring(1, part.length - 1);
          const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        }
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        return <span key={index} className="text-red-500">{part}</span>
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