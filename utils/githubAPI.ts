import { Article } from '../types';
import { generateArticleFileContent } from './articleFileGenerator';

interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch: string;
}

/**
 * Gets GitHub configuration from environment variables or metadata
 */
async function getGitHubConfig(): Promise<GitHubConfig | null> {
  try {
    // Try to get configuration from metadata.json
    const response = await fetch('/mysite/metadata.json');
    if (!response.ok) {
      console.warn('Could not load metadata.json');
      return null;
    }
    
    const metadata = await response.json();
    
    // Check if we have the necessary configuration
    if (!metadata.github || !metadata.github.owner || !metadata.github.repo) {
      console.warn('GitHub configuration not found in metadata.json');
      return null;
    }
    
    // Get token from environment variable only (not from metadata for security)
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      console.warn('GitHub token not configured');
      return null;
    }
    
    return {
      owner: metadata.github.owner,
      repo: metadata.github.repo,
      token: token,
      branch: metadata.github.branch || 'main'
    };
  } catch (error) {
    console.error('Error loading GitHub configuration:', error);
    return null;
  }
}

/**
 * Gets the SHA of an existing file in the repository
 */
async function getFileSHA(
  config: GitHubConfig,
  filePath: string
): Promise<string | null> {
  try {
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.sha;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting file SHA:', error);
    return null;
  }
}

interface GitHubCommitRequest {
  message: string;
  content: string;
  branch: string;
  sha?: string;
}

/**
 * Commits an article file to the GitHub repository
 */
export async function saveArticleToRepository(
  article: Article,
  isUpdate: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getGitHubConfig();
    
    if (!config) {
      return {
        success: false,
        error: 'GitHub not configured. Please use manual download.'
      };
    }
    
    const filePath = `data/articles/${article.id}.ts`;
    const fileContent = generateArticleFileContent(article);
    
    // Base64 encode the content using TextEncoder for proper UTF-8 encoding
    const encoder = new TextEncoder();
    const data = encoder.encode(fileContent);
    const contentBase64 = btoa(String.fromCharCode(...data));
    
    // Get existing file SHA if updating
    let sha: string | null = null;
    if (isUpdate) {
      sha = await getFileSHA(config, filePath);
    }
    
    // Prepare the commit
    const commitMessage = isUpdate 
      ? `Update article: ${article.title}`
      : `Add new article: ${article.title}`;
    
    const requestBody: GitHubCommitRequest = {
      message: commitMessage,
      content: contentBase64,
      branch: config.branch,
    };
    
    if (sha) {
      requestBody.sha = sha;
    }
    
    // Create or update the file
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API error:', errorData);
      return {
        success: false,
        error: errorData.message || `Failed to save to repository (${response.status})`
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving article to repository:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Deletes an article file from the GitHub repository
 */
export async function deleteArticleFromRepository(
  articleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getGitHubConfig();
    
    if (!config) {
      return {
        success: false,
        error: 'GitHub not configured'
      };
    }
    
    const filePath = `data/articles/${articleId}.ts`;
    
    // Get the file SHA (required for deletion)
    const sha = await getFileSHA(config, filePath);
    
    if (!sha) {
      return {
        success: false,
        error: 'File not found in repository'
      };
    }
    
    // Delete the file
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Delete article: ${articleId}`,
        sha: sha,
        branch: config.branch,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Failed to delete from repository (${response.status})`
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting article from repository:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Checks if GitHub API is configured and available
 */
export async function isGitHubConfigured(): Promise<boolean> {
  const config = await getGitHubConfig();
  return config !== null;
}
