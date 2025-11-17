
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ContentsPage from './pages/ContentsPage';
import ResumePage from './pages/ResumePage';
import ArticlePage from './pages/ArticlePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SearchPage from './pages/SearchPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { ArticleProvider } from './context/ArticleContext';
import { ProjectProvider } from './context/ProjectContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ArticleProvider>
          <ProjectProvider>
            <HashRouter>
              <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
                <Header />
                <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<ContentsPage />} />
                    <Route path="/contents" element={<ContentsPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/project/:id" element={<ProjectDetailPage />} />
                    <Route path="/about" element={<ResumePage />} />
                    <Route path="/resume" element={<ResumePage />} />
                    <Route path="/article/:id" element={<ArticlePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/admin" element={<AdminLoginPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  </Routes>
                </main>
                <footer className="text-center p-4 mt-12 text-gray-500 dark:text-gray-400 text-sm">
                    <p>&copy; 2025 Abdelbari SAOUTELHAK</p>
                </footer>
              </div>
            </HashRouter>
          </ProjectProvider>
        </ArticleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
