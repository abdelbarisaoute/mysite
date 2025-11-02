
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Article } from '../types';
import { articles as staticArticles } from '../data/articles';

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
}

const defaultArticleContext: ArticleContextType = {
  articles: [],
  addArticle: () => {},
  updateArticle: () => {},
};

export const ArticleContext = createContext<ArticleContextType>(defaultArticleContext);

const staticArticleIds = new Set(staticArticles.map(a => a.id));

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const customArticlesJSON = localStorage.getItem('custom-articles');
    const customArticles = customArticlesJSON ? JSON.parse(customArticlesJSON) : [];
    
    // Combine static articles with custom articles from local storage
    const combinedArticles = [...staticArticles];
    customArticles.forEach((article: Article) => {
        // Avoid adding custom articles that might have the same ID as static ones
        if (!staticArticleIds.has(article.id)) {
            combinedArticles.push(article);
        }
    });

    setArticles(combinedArticles);
  }, []);

  const addArticle = (article: Article) => {
    setArticles(prevArticles => {
      const newArticles = [...prevArticles, article];
      
      const customArticlesJSON = localStorage.getItem('custom-articles');
      const currentCustomArticles = customArticlesJSON ? JSON.parse(customArticlesJSON) : [];
      const updatedCustomArticles = [...currentCustomArticles, article];
      localStorage.setItem('custom-articles', JSON.stringify(updatedCustomArticles));

      return newArticles;
    });
  };

  const updateArticle = (updatedArticle: Article) => {
    setArticles(prevArticles => {
      const newArticles = prevArticles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      );

      // If it's a static article that was updated, store it in custom articles
      if (staticArticleIds.has(updatedArticle.id)) {
        const customArticlesJSON = localStorage.getItem('custom-articles');
        const currentCustomArticles = customArticlesJSON ? JSON.parse(customArticlesJSON) : [];
        
        // Check if it already exists in custom articles
        const existingIndex = currentCustomArticles.findIndex((a: Article) => a.id === updatedArticle.id);
        if (existingIndex >= 0) {
          currentCustomArticles[existingIndex] = updatedArticle;
        } else {
          currentCustomArticles.push(updatedArticle);
        }
        localStorage.setItem('custom-articles', JSON.stringify(currentCustomArticles));
      } else {
        // Update in custom articles storage
        const customArticlesJSON = localStorage.getItem('custom-articles');
        const currentCustomArticles = customArticlesJSON ? JSON.parse(customArticlesJSON) : [];
        const updatedCustomArticles = currentCustomArticles.map((a: Article) => 
          a.id === updatedArticle.id ? updatedArticle : a
        );
        localStorage.setItem('custom-articles', JSON.stringify(updatedCustomArticles));
      }

      return newArticles;
    });
  };

  return (
    <ArticleContext.Provider value={{ articles, addArticle, updateArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};