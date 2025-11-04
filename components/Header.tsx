
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSuggestions([]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

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
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-900 dark:bg-blue-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? 'bg-gray-900 dark:bg-blue-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              MySite
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/contents" className={navLinkClasses}>
                Contents
              </NavLink>
              <NavLink to="/resume" className={navLinkClasses}>
                Resume
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
                  className="w-28 sm:w-40 pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Search"
                >
                  <SearchIcon className="h-4 w-4" />
                </button>
                {suggestions.length > 0 && (
                  <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                    {suggestions.map((article) => (
                      <li key={article.id}>
                        <Link
                          to={`/article/${article.id}`}
                          onClick={handleSuggestionClick}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={mobileNavLinkClasses}
            >
              Home
            </NavLink>
            <NavLink
              to="/contents"
              onClick={closeMobileMenu}
              className={mobileNavLinkClasses}
            >
              Contents
            </NavLink>
            <NavLink
              to="/resume"
              onClick={closeMobileMenu}
              className={mobileNavLinkClasses}
            >
              Resume
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
