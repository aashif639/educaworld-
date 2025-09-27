
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon } from './Icons';

const Header: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const { user, logout, loading } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-600">
          Educa<span className="text-primary-800">world</span>
        </h1>
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:block">Welcome, {user.name}</span>
              <img src={user.avatar} alt="Admin Avatar" className="w-10 h-10 rounded-full" />
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Admin Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
