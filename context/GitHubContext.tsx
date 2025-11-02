import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { githubService, GitHubConfig } from '../services/githubService';

interface GitHubContextType {
  isGitHubConfigured: boolean;
  configureGitHub: (config: GitHubConfig) => void;
  clearGitHubConfig: () => void;
  getGitHubConfig: () => GitHubConfig | null;
}

const defaultGitHubContext: GitHubContextType = {
  isGitHubConfigured: false,
  configureGitHub: () => {},
  clearGitHubConfig: () => {},
  getGitHubConfig: () => null,
};

export const GitHubContext = createContext<GitHubContextType>(defaultGitHubContext);

const STORAGE_KEY = 'github-config';

export const GitHubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGitHubConfigured, setIsGitHubConfigured] = useState<boolean>(false);

  useEffect(() => {
    // Load GitHub configuration from localStorage
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        githubService.configure(config);
        setIsGitHubConfigured(true);
      } catch (error) {
        console.error('Error loading GitHub config:', error);
      }
    }
  }, []);

  const configureGitHub = (config: GitHubConfig) => {
    githubService.configure(config);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setIsGitHubConfigured(true);
  };

  const clearGitHubConfig = () => {
    localStorage.removeItem(STORAGE_KEY);
    githubService.configure({ owner: '', repo: '', token: '' });
    setIsGitHubConfigured(false);
  };

  const getGitHubConfig = (): GitHubConfig | null => {
    return githubService.getConfig();
  };

  return (
    <GitHubContext.Provider value={{ isGitHubConfigured, configureGitHub, clearGitHubConfig, getGitHubConfig }}>
      {children}
    </GitHubContext.Provider>
  );
};
