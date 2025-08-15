import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardUI from './components/UrlShortener'; 
import Login from './components/loginForm';
import Register from './components/registerForm';
import Home from './components/home';
import ProtectedRoute from './components/ProtectedRoute'; 
import ContactUsPage from './components/ContactUsPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/urlshort" element={
          <ProtectedRoute>
            <DashboardUI /> 
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUsPage />} /> {/* Route path set to /contact for consistency */}
      </Routes>
    </Router>
  );
};

export default App;
