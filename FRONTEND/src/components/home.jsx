import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Ensure these icons are used in HomePage, otherwise they might belong in Navbar
import { ChartBarIcon, PencilAltIcon, SparklesIcon } from '@heroicons/react/outline';
// Assuming Navbar is in the same directory as HomePage or a 'components' folder relative to it
import Navbar from './Navbar'; 

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
 

  // Effect to load dark mode preference from local storage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Set dark mode based on system preference if no saved preference
      setDarkMode(true);
    }
  }, []);

  // Effect to apply dark mode class to documentElement and save preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode)); // Save preference
  }, [darkMode]);

  return (
    // Main container for the entire page
    <div className="min-h-screen font-sans antialiased relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 animate-gradientShift bg-[length:200%_200%]"></div>
      </div>

      {/* Main Content Wrapper - this div will now be the primary scrolling container */}
      <div className="relative z-10">
        {/* Navbar component, passing necessary props for state management */}
        {/* Navbar component is assumed to handle its own dark mode toggle and menu open/close buttons */}
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
        />

        {/* Mobile Menu (rendered conditionally based on menuOpen state) */}
        {/* This mobile menu is for the navigation links, distinct from the Navbar's internal menu toggle */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center space-y-4 px-4 pt-4 pb-6 bg-white dark:bg-gray-800 shadow-lg animate-fadeIn transition-colors duration-500">
            <Link
              to="/login"
              className="w-full text-center py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              onClick={() => setMenuOpen(false)} // Close menu on click
            >
              Login
            </Link>
            <Link
              to="/register"
              className="w-full text-center py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-all dark:border-blue-400 dark:text-blue-400"
              onClick={() => setMenuOpen(false)} // Close menu on click
            >
              Register
            </Link>
          </div>
        )}

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-6 md:px-16 py-32 min-h-[calc(100vh-80px)]">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Transform Long Links into <br className="hidden sm:inline" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Short, Powerful Ones.</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            Shortify empowers you to effortlessly shorten, manage, and track your URLs, unlocking valuable insights with every click.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-xl hover:scale-105 transition-all duration-300 animate-fadeIn" style={{ animationDelay: '0.6s' }}
          >
            Get Started for Free
          </Link>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
          <h3 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white">Why Choose Shortify?</h3>
          <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {/* Feature 1: Instant & Secure Shortening */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-2 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              <SparklesIcon className="h-16 w-16 text-blue-500 dark:text-blue-400 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Instant & Secure Shortening</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Quickly generate compact, secure links with advanced encryption and reliable redirects, ensuring your users reach their destination safely.</p>
            </div>
            {/* Feature 2: Comprehensive Analytics */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-2 animate-fadeIn" style={{ animationDelay: '1s' }}>
              <ChartBarIcon className="h-16 w-16 text-purple-500 dark:text-purple-400 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Comprehensive Analytics</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Gain deep insights into your link performance with detailed analytics on clicks, geographic location, device types, and more, all in real-time.</p>
            </div>
            {/* Feature 3: Customizable & Branded Links */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-2 animate-fadeIn" style={{ animationDelay: '1.2s' }}>
              <PencilAltIcon className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Customizable & Branded Links</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Personalize your short URLs with custom aliases, making them memorable, brand-consistent, and more effective for your marketing efforts.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm bg-white dark:bg-gray-900 border-t dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-500">
          © {new Date().getFullYear()} ShrinkX . All rights reserved. — The simplest way to shorten, manage, and share powerful links.
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
