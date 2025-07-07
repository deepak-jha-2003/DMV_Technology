import React, { useState } from 'react';
import { Menu, X, Code, Smartphone, Globe, Shield } from 'lucide-react';
import LoginSignupModal from './LoginSignupModal';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <span className="text-xl font-bold text-gray-900">DMV Technology</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-sky-600 transition-colors font-medium">
              Home
            </a>
            <a href="#services" className="text-gray-700 hover:text-sky-600 transition-colors font-medium">
              Services
            </a>
            <a href="#about" className="text-gray-700 hover:text-sky-600 transition-colors font-medium">
              About
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-sky-600 transition-colors font-medium">
              Testimonials
            </a>
            <a href="#contact" className="text-gray-700 hover:text-sky-600 transition-colors font-medium">
              Contact
            </a>
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
            >
              Login
            </button>
          </nav>
          <LoginSignupModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />


          {/* CTA Button */}
          <div className="hidden md:flex">
            <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Get Started
            </button>
          </div>

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
              <a
                href="#home"
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-gray-700 hover:text-sky-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-sky-50 text-left"
              >
                Login
              </button>
              <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg mx-4">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;