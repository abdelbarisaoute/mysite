/**
 * GitHub API utility functions for managing repository content
 */

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

/**
 * Encodes content to base64 for GitHub API
 */
export const encodeToBase64 = (content: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  return btoa(String.fromCharCode(...data));
};

/**
 * Gets the SHA of an existing file in the repository
 */
export const getFileSha = async (
  config: GitHubConfig,
  filePath: string
): Promise<string | undefined> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.sha;
    }
  } catch (e) {
    // File doesn't exist
  }
  return undefined;
};

/**
 * Creates or updates a file in the repository
 */
export const saveFileToGitHub = async (
  config: GitHubConfig,
  filePath: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const base64Content = encodeToBase64(content);
    
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: base64Content,
          sha,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || 'Failed to save to GitHub' 
      };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Deletes a file from the repository
 */
export const deleteFileFromGitHub = async (
  config: GitHubConfig,
  filePath: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, get the file's SHA
    const sha = await getFileSha(config, filePath);
    if (!sha) {
      return { success: false, error: 'File not found in repository' };
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sha,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || 'Failed to delete from GitHub' 
      };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Escapes special characters for TypeScript string literals
 */
export const escapeForString = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
};

/**
 * Escapes special characters for TypeScript template literals
 */
export const escapeForTemplate = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
};
