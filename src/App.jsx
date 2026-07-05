import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const AppContent = () => {
  const location = useLocation();
  const isAdminOrLogin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  return (
    <>
      {/* Conditionally render header and chat agent based on route */}
      {!isAdminOrLogin && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {!isAdminOrLogin && <AIAssistant />}
    </>
  );
};

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
