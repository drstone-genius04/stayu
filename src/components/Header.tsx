import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: { email: string } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">StayU</h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Hotels
            </Link>
            <a
              href="#about"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </a>
            {isAuthenticated && (
              <Link
                to="/map"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/map' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Map View
              </Link>
            )}
            <a
              href="#contact"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="btn-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <button className="btn-primary">
                  List Your Hotel
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary-600 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
