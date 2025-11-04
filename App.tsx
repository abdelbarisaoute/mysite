
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ContentsPage from './pages/ContentsPage';
import ResumePage from './pages/ResumePage';
import ArticlePage from './pages/ArticlePage';
import SearchPage from './pages/SearchPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { ArticleProvider } from './context/ArticleContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ArticleProvider>
          <HashRouter>
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
              <Header />
              <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/contents" element={<ContentsPage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                </Routes>
              </main>
              <footer className="text-center p-4 mt-8 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                  <p>&copy; 2024 Your Name Here. All rights reserved.</p>
              </footer>
            </div>
          </HashRouter>
        </ArticleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
