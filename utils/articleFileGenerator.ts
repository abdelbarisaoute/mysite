import { Article } from '../types';

/**
 * Generates TypeScript file content for an article
 */
export function generateArticleFileContent(article: Article): string {
  // Escape special characters in the content for template literals
  const escapeContent = (str: string) => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');
  };

  const content = `import { Article } from '../../types';

export const ${toCamelCase(article.id)}: Article = {
  id: '${article.id}',
  title: '${article.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',
  date: '${article.date}',
  summary: \`${escapeContent(article.summary)}\`,
  content: \`${escapeContent(article.content)}\`
};
`;

  return content;
}

/**
 * Converts a kebab-case string to camelCase, ensuring it's a valid JavaScript identifier
 */
function toCamelCase(str: string): string {
  // Convert to lowercase first, then remove all non-alphanumeric characters except hyphens
  let cleaned = str.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  // Remove consecutive hyphens
  cleaned = cleaned.replace(/-+/g, '-');
  
  // Convert to camelCase
  let result = cleaned.replace(/-(.)/g, (_, char) => char.toUpperCase());
  
  // Ensure it starts with a letter or underscore (prepend underscore if it starts with a number)
  if (/^[0-9]/.test(result)) {
    result = '_' + result;
  }
  
  // If result is empty or contains only numbers, use a default prefix with timestamp for uniqueness
  if (!result || /^_*[0-9]+$/.test(result)) {
    result = 'article' + (result || Date.now());
  }
  
  return result;
}

/**
 * Downloads a file with the given content and filename
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
