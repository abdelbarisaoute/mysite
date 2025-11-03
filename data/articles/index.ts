import { Article } from '../../types';

// Automatically import all article files from this directory
// This uses Vite's import.meta.glob to dynamically discover all .ts files
// Any new article file added to this directory will be automatically included
const articleModules = import.meta.glob<{ [key: string]: any }>('./*.ts', { eager: true });

// Extract articles from the imported modules
export const articles: Article[] = Object.entries(articleModules)
  .filter(([path]) => !path.includes('index.ts')) // Exclude this index file
  .flatMap(([, module]) => {
    // Each module exports an article object with a camelCase name
    // We need to extract all exported articles from each module
    return Object.values(module).filter(
      (value): value is Article => 
        typeof value === 'object' && 
        value !== null && 
        'id' in value && 
        'title' in value && 
        'date' in value
    );
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
