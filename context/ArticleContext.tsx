import React, { createContext, ReactNode } from 'react';
import { Article } from '../types';
import { articles } from '../data/articles';

interface ArticleContextType {
  articles: Article[];
}

const defaultArticleContext: ArticleContextType = {
  articles: [],
};

export const ArticleContext = createContext<ArticleContextType>(defaultArticleContext);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ArticleContext.Provider value={{ articles }}>
      {children}
    </ArticleContext.Provider>
  );
};
