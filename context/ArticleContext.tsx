
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Article } from '../types';
import { articles as staticArticles } from '../data/articles';

interface ArticleContextType {
  articles: Article[];
}

const defaultArticleContext: ArticleContextType = {
  articles: [],
};

export const ArticleContext = createContext<ArticleContextType>(defaultArticleContext);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(staticArticles);

  const value = {
    articles,
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};
