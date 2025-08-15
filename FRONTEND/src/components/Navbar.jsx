import React from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, MenuIcon, XIcon, SparklesIcon } from '@heroicons/react/outline';

const Navbar = ({ darkMode, setDarkMode, menuOpen, setMenuOpen }) => {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 shadow-lg sticky top-0 z-50 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md transition-colors duration-500">
      <Link to="/" className="flex items-center space-x-2">
        <SparklesIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">ShrinkX</h1>
      </Link>

      {/* Mobile Menu Toggle and Dark Mode Toggle */}
      <div className="flex items-center space-x-4 md:hidden">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/login"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
        >
          Login
        </Link>
        {/* FIX: Added 'to="/register"' prop to the Link component for the Register button */}
        <Link
          to="/register" 
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
        >
          Register
        </Link>
        {/* Updated styling for Contact Us button to match "Login" button (gradient, text-white, shadow, hover effects) */}
        <Link
          to="/contact"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
        >
          Contact Us
        </Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu (rendered conditionally based on menuOpen state) */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden flex flex-col items-center space-y-4 px-4 pt-4 pb-6 bg-white dark:bg-gray-800 shadow-lg animate-fadeIn transition-colors duration-500">
          <Link
            to="/login"
            // Updated styling for Login button in mobile menu
            className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => setMenuOpen(false)} 
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => setMenuOpen(false)} 
          >
            Register
          </Link>
          {/* Updated styling for Contact Us button in mobile menu */}
          <Link
            to="/contact"
            className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => setMenuOpen(false)} 
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
