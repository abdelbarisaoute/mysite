
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SearchIcon } from './icons/SearchIcon';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';
import { Article } from '../types';
import { ArticleContext } from '../context/ArticleContext';
import ThemeToggleButton from './ThemeToggleButton';

const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { articles } = useContext(ArticleContext);

  const handleSearch = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSuggestions([]);
    }
  }, [query, navigate]);
  
  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim().length > 1) {
      const lowerCaseQuery = newQuery.toLowerCase();
      const filtered = articles
        .filter(
          (article) =>
            article.title.toLowerCase().includes(lowerCaseQuery) ||
            article.summary.toLowerCase().includes(lowerCaseQuery)
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [articles]);

  const handleSuggestionClick = () => {
    setQuery('');
    setSuggestions([]);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-1.5 text-sm transition-colors ${
      isActive
        ? 'text-gray-900 dark:text-gray-100 underline underline-offset-4'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-2 py-2 text-base transition-colors ${
      isActive
        ? 'text-gray-900 dark:text-gray-100 underline underline-offset-4'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
    }`;

  return (
    <header className="bg-white dark:bg-gray-950 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              PiPhy
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/blog" className={navLinkClasses}>
                Blog
              </NavLink>
              <NavLink to="/projects" className={navLinkClasses}>
                Projects
              </NavLink>
              <NavLink to="/about" className={navLinkClasses}>
                About
              </NavLink>
            </div>
            
            <ThemeToggleButton />

            <div className="flex items-center" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search..."
                  className="w-28 sm:w-40 pl-3 pr-8 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white dark:bg-gray-900 dark:placeholder-gray-500 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Search"
                >
                  <SearchIcon className="h-4 w-4" />
                </button>
                {suggestions.length > 0 && (
                  <ul className="absolute mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded z-10">
                    {suggestions.map((article) => (
                      <li key={article.id}>
                        <Link
                          to={`/article/${article.id}`}
                          onClick={handleSuggestionClick}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={mobileNavLinkClasses}
            >
              Home
            </NavLink>
            <NavLink
              to="/blog"
              onClick={closeMobileMenu}
              className={mobileNavLinkClasses}
            >
              Blog
            </NavLink>
            <NavLink
              to="/projects"
              onClick={closeMobileMenu}
              className={mobileNavLinkClasses}
            >
              Projects
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMobileMenu}
              className={mobileNavLinkClasses}
            >
              About
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
