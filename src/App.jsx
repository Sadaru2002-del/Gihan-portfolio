import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProjectSubmit from './pages/ProjectSubmit';
import { ToastProvider } from './context/ToastContext';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize theme globally across all routes
    if (localStorage.getItem('gihan_theme') === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  const isDedicatedPage = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/submit-project');

  return (
    <>
      {/* Conditionally render header and chat agent based on route */}
      {!isDedicatedPage && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/submit-project" element={<ProjectSubmit />} />
      </Routes>

      {!isDedicatedPage && <AIAssistant />}
    </>
  );
};

function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
