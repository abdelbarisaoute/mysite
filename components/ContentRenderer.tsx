
import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderedParts = useMemo(() => {
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
      
      // Process markdown formatting for non-math parts
      return part.split('\n').map((line, lineIndex) => {
        // Handle headers
        if (line.startsWith('### ')) {
          return <h3 key={`${index}-${lineIndex}`} className="text-2xl font-bold mt-6 mb-3">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={`${index}-${lineIndex}`} className="text-3xl font-bold mt-8 mb-4">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={`${index}-${lineIndex}`} className="text-4xl font-bold mt-10 mb-5">{line.substring(2)}</h1>;
        }
        
        // Handle bold text **text**
        const processedLine = line.split(/(\*\*.*?\*\*)/g).map((segment, segIndex) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            return <strong key={segIndex}>{segment.substring(2, segment.length - 2)}</strong>;
          }
          return segment;
        });
        
        return (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {processedLine}
            {lineIndex < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      });
    });
  }, [content]);

  return <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">{renderedParts}</div>;
};

export default ContentRenderer;