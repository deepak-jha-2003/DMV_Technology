import { useState } from 'react';
import { Menu, X, Code } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import LoginSignupModal from './LoginSignupModal';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
    // Use a small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Custom scroll function for hash links with offset
  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; // Offset for fixed header
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold text-gray-900">
              DMV Technology
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleHomeClick}
              className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
            >
              Home
            </button>
            <HashLink
              smooth
              to="/#services"
              scroll={scrollWithOffset}
              className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
            >
              Services
            </HashLink>
            <HashLink
              smooth
              to="/#about"
              scroll={scrollWithOffset}
              className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
            >
              About
            </HashLink>
            <HashLink
              smooth
              to="/#testimonials"
              scroll={scrollWithOffset}
              className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
            >
              Testimonials
            </HashLink>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section - Authentication + CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Authentication Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-600 text-sm">
                    Welcome, <span className="font-semibold text-gray-800">{user?.name || 'User'}</span>
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
              >
                Sign In
              </button>
            )}

            {/* Primary CTA Button - Navigate to Get Started Page */}
            <Link
              to="/get-started"
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started
            </Link>
          </div>
          <LoginSignupModal
            show={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sky-100">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  handleHomeClick();
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50 text-left"
              >
                Home
              </button>
              <HashLink
                smooth
                to="/#services"
                scroll={scrollWithOffset}
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </HashLink>
              <HashLink
                smooth
                to="/#about"
                scroll={scrollWithOffset}
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </HashLink>
              <HashLink
                smooth
                to="/#testimonials"
                scroll={scrollWithOffset}
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </HashLink>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isLoggedIn ? (
                <div className="px-4 py-3 border-t border-gray-200 mt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Welcome,</div>
                      <div className="font-semibold text-gray-800">{user?.name || 'User'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm flex items-center space-x-2 w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50 text-left"
                >
                  Sign In
                </button>
              )}
              <Link
                to="/get-started"
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg mx-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;