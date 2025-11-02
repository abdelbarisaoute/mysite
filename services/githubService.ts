// GitHub API service for managing repository content
export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
}

export interface FileContent {
  path: string;
  content: string;
  message: string;
}

class GitHubService {
  private config: GitHubConfig | null = null;

  configure(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || 'main'
    };
  }

  isConfigured(): boolean {
    return this.config !== null && this.config.token !== '';
  }

  getConfig(): GitHubConfig | null {
    return this.config;
  }

  private async getFileSha(path: string): Promise<string | null> {
    if (!this.config) throw new Error('GitHub service not configured');

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

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

  async commitFile(fileContent: FileContent): Promise<boolean> {
    if (!this.config) {
      throw new Error('GitHub service not configured');
    }

    try {
      // Get the current file SHA if it exists (needed for updates)
      const sha = await this.getFileSha(fileContent.path);

      // Base64 encode the content
      const encodedContent = btoa(unescape(encodeURIComponent(fileContent.content)));

      const body: any = {
        message: fileContent.message,
        content: encodedContent,
        branch: this.config.branch,
      };

      // If file exists, include SHA for update
      if (sha) {
        body.sha = sha;
      }

      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${fileContent.path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('GitHub API error:', errorData);
        throw new Error(`Failed to commit file: ${errorData.message || response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error committing file to GitHub:', error);
      throw error;
    }
  }

  async commitMultipleFiles(files: FileContent[]): Promise<boolean> {
    if (!this.config) {
      throw new Error('GitHub service not configured');
    }

    try {
      // Commit files sequentially to avoid conflicts
      for (const file of files) {
        await this.commitFile(file);
      }
      return true;
    } catch (error) {
      console.error('Error committing multiple files:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService();
