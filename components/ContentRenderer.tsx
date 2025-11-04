
import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  // Helper function to process inline formatting (bold, italic, code, links)
  const processInlineFormatting = (text: string) => {
    const segments: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    while (remaining.length > 0) {
      // Check for inline code `code`
      const codeMatch = remaining.match(/^`([^`]+?)`/);
      if (codeMatch) {
        segments.push(
          <code key={key++} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.substring(codeMatch[0].length);
        continue;
      }
      
      // Check for links [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+?)\]\(([^)]+?)\)/);
      if (linkMatch) {
        segments.push(
          <a key={key++} href={linkMatch[2]} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.substring(linkMatch[0].length);
        continue;
      }
      
      // Check for bold **text**
      const boldMatch = remaining.match(/^\*\*([^*]+?)\*\*/);
      if (boldMatch) {
        segments.push(<strong key={key++}>{boldMatch[1]}</strong>);
        remaining = remaining.substring(boldMatch[0].length);
        continue;
      }
      
      // Check for italic *text* or _text_
      const italicMatch = remaining.match(/^(\*|_)([^*_]+?)\1/);
      if (italicMatch && !remaining.startsWith('**')) {
        segments.push(<em key={key++}>{italicMatch[2]}</em>);
        remaining = remaining.substring(italicMatch[0].length);
        continue;
      }
      
      // Add regular character
      segments.push(remaining[0]);
      remaining = remaining.substring(1);
    }
    
    return segments;
  };

  const renderedParts = useMemo(() => {
    // Regex to find and capture LaTeX blocks ($$...$$) and inline math ($...$)
    // Using [\s\S] to match any character including newlines for both display and inline math
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

    return parts.map((part, index) => {
      try {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.substring(2, part.length - 2).trim();
          const html = katex.renderToString(latex, { 
            displayMode: true, 
            throwOnError: false,
            trust: true,
            strict: false
          });
          return <div key={index} className="my-4 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
        }
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const latex = part.substring(1, part.length - 1).trim();
          const html = katex.renderToString(latex, { 
            displayMode: false, 
            throwOnError: false,
            trust: true,
            strict: false
          });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        }
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        return <span key={index} className="text-red-500" title={`LaTeX Error: ${error instanceof Error ? error.message : 'Unknown error'}`}>{part}</span>
      }
      
      // Process markdown formatting for non-math parts
      return part.split('\n').map((line, lineIndex) => {
        // Skip empty lines
        if (line.trim() === '') {
          return <br key={`${index}-${lineIndex}`} />;
        }
        
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
        
        // Handle horizontal rules
        if (line.trim() === '---' || line.trim() === '***') {
          return <hr key={`${index}-${lineIndex}`} className="my-8 border-t-2 border-gray-300 dark:border-gray-600" />;
        }
        
        // Handle unordered lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const listContent = line.trim().substring(2);
          return (
            <div key={`${index}-${lineIndex}`} className="ml-6">
              <span className="inline-block mr-2">•</span>
              {processInlineFormatting(listContent)}
            </div>
          );
        }
        
        // Handle ordered lists
        const orderedListMatch = line.trim().match(/^(\d+)\.\s+(.+)/);
        if (orderedListMatch) {
          return (
            <div key={`${index}-${lineIndex}`} className="ml-6">
              <span className="inline-block mr-2">{orderedListMatch[1]}.</span>
              {processInlineFormatting(orderedListMatch[2])}
            </div>
          );
        }
        
        // Handle blockquotes
        if (line.trim().startsWith('> ')) {
          return (
            <blockquote key={`${index}-${lineIndex}`} className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
              {processInlineFormatting(line.trim().substring(2))}
            </blockquote>
          );
        }
        
        // Handle inline code blocks with backticks
        if (line.trim().startsWith('```') && line.trim().endsWith('```')) {
          const code = line.trim().substring(3, line.length - 6);
          return (
            <code key={`${index}-${lineIndex}`} className="block bg-gray-100 dark:bg-gray-800 p-2 rounded my-2 font-mono text-sm overflow-x-auto">
              {code}
            </code>
          );
        }
        
        // Handle regular text with inline formatting
        return (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {processInlineFormatting(line)}
            {lineIndex < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      });
    });
  }, [content]);

  return <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">{renderedParts}</div>;
};

export default ContentRenderer;