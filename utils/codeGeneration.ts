// Utility functions for safely generating TypeScript code

/**
 * Escapes a string for safe use in a JavaScript/TypeScript string literal
 */
export function escapeStringLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/\n/g, '\\n')    // Escape newlines
    .replace(/\r/g, '\\r')    // Escape carriage returns
    .replace(/\t/g, '\\t');   // Escape tabs
}

/**
 * Escapes a string for safe use in a JavaScript/TypeScript template literal
 */
export function escapeTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/`/g, '\\`')     // Escape backticks
}

/**
 * Generates a valid JavaScript identifier from an article ID
 * Ensures the identifier starts with a letter and contains only valid characters
 */
export function generateValidIdentifier(articleId: string): string {
  // Remove or replace invalid characters
  let identifier = articleId.replace(/[^a-zA-Z0-9_$]/g, '_');
  
  // Ensure it starts with a letter or underscore (not a digit)
  if (/^[0-9]/.test(identifier)) {
    identifier = '_' + identifier;
  }
  
  return identifier;
}
