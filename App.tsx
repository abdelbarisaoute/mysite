
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ContentsPage from './pages/ContentsPage';
import ResumePage from './pages/ResumePage';
import ArticlePage from './pages/ArticlePage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import NewArticlePage from './pages/NewArticlePage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import { ArticleProvider } from './context/ArticleContext';
import { ThemeProvider } from './context/ThemeContext';
import { GitHubProvider } from './context/GitHubContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GitHubProvider>
          <ArticleProvider>
          <HashRouter>
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
              <Header />
              <Routes>
                <Route path="/" element={<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><HomePage /></main>} />
                <Route path="/contents" element={<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><ContentsPage /></main>} />
                <Route path="/resume" element={<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><ResumePage /></main>} />
                <Route path="/article/:id" element={<main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ArticlePage /></main>} />
                <Route path="/search" element={<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><SearchPage /></main>} />
                <Route path="/admin" element={<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><AdminPage /></main>} />
                <Route path="/new-article" element={<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><NewArticlePage /></main>} />
                <Route path="/settings" element={<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><SettingsPage /></main>} />
              </Routes>
              <footer className="text-center p-4 mt-8 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                  <p>&copy; 2024 Your Name Here. All rights reserved.</p>
              </footer>
            </div>
          </HashRouter>
        </ArticleProvider>
      </GitHubProvider>
    </AuthProvider>
  </ThemeProvider>
  );
};

export default App;