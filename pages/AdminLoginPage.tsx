
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 border-l-4 border-blue-500">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
