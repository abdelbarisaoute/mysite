
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Article } from '../types';
import { articles as staticArticles } from '../data/articles';

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (updatedArticle: Article) => void;
  deleteArticle: (id: string) => void;
}

const defaultArticleContext: ArticleContextType = {
  articles: [],
  addArticle: () => {},
  updateArticle: () => {},
  deleteArticle: () => {},
};

export const ArticleContext = createContext<ArticleContextType>(defaultArticleContext);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const storedArticles = localStorage.getItem('articles');
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
      } else {
        setArticles(staticArticles);
        localStorage.setItem('articles', JSON.stringify(staticArticles));
      }
    } catch (error) {
      console.error("Failed to load articles from localStorage", error);
      setArticles(staticArticles);
    }
  }, []);

  const updateLocalStorage = (updatedArticles: Article[]) => {
    localStorage.setItem('articles', JSON.stringify(updatedArticles));
  };

  const addArticle = (article: Article) => {
    const newArticles = [...articles, article];
    setArticles(newArticles);
    updateLocalStorage(newArticles);
  };

  const updateArticle = (updatedArticle: Article) => {
    const newArticles = articles.map(article =>
      article.id === updatedArticle.id ? updatedArticle : article
    );
    setArticles(newArticles);
    updateLocalStorage(newArticles);
  };

  const deleteArticle = (id: string) => {
    const newArticles = articles.filter(article => article.id !== id);
    setArticles(newArticles);
    updateLocalStorage(newArticles);
  };

  const value = {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};
