import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight, Lock, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const savedTheme = localStorage.getItem('gihan_theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.body.classList.add('light-mode');
    }
    const token = localStorage.getItem('gihan_auth_token');
    setIsLoggedIn(!!token);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-check login state on route change
  useEffect(() => {
    const token = localStorage.getItem('gihan_auth_token');
    setIsLoggedIn(!!token);
  }, [location]);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    if (newMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('gihan_theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('gihan_theme', 'dark');
    }
  };

  const handleNavClick = (selector) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: selector } });
      return;
    }
    const element = document.querySelector(selector);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.querySelector(location.state.scrollTo);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  // Triple-click brand logo = go to admin login (easter egg)
  const handleBrandClick = (e) => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount >= 3) {
      setAdminClickCount(0);
      navigate('/login');
    }
    setTimeout(() => setAdminClickCount(0), 2000);
  };

  return (
    <nav
      className="glass-nav"
      style={{
        padding: isScrolled ? '12px 0' : '18px 0',
        borderBottom: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        background: isScrolled ? 'rgba(5, 5, 8, 0.90)' : 'rgba(5, 5, 8, 0.3)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div
          onClick={handleBrandClick}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
          title="Portfolio"
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.2rem', color: '#fff',
            boxShadow: '0 4px 14px rgba(168,85,247,0.35)',
            transition: 'transform 0.2s', flexShrink: 0
          }}>
            G
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-text-secondary))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Gihan Suminda
          </span>
          <span className="badge badge-success badge-pulse" style={{ padding: '3px 8px', fontSize: '0.65rem' }}>
            Available
          </span>
        </div>

        {/* Desktop Links */}
        <div style={{ display: 'none', gap: '28px', alignItems: 'center' }} className="nav-desktop-container">
          {[
            { label: 'About', selector: '#about' },
            { label: 'Skills', selector: '#skills' },
            { label: 'Projects', selector: '#projects' },
            { label: 'Recruiter Hub', selector: '#recruiter' },
            { label: 'Contact', selector: '#contact' },
          ].map(({ label, selector }) => (
            <button key={label} onClick={() => handleNavClick(selector)} style={navButtonStyle}>
              {label}
            </button>
          ))}
          <Link to="/blog" style={{ ...navButtonStyle, textDecoration: 'none' }}>Blog</Link>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
              borderRadius: '8px', width: '38px', height: '38px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-text-secondary)', transition: 'all 0.2s'
            }}
          >
            {isLightMode ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Admin / Dashboard Button */}
          {isLoggedIn ? (
            <Link
              to="/admin"
              title="Admin Dashboard"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem',
                fontFamily: 'var(--font-display)', fontWeight: 600,
                background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)',
                color: 'var(--color-primary)', textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              className="nav-desktop-btn"
            >
              <Shield size={14} /> Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              title="Admin Login"
              className="nav-desktop-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem',
                fontFamily: 'var(--font-display)', fontWeight: 600,
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
                color: 'var(--color-text-tertiary)', textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              <Lock size={13} /> Admin
            </Link>
          )}

          {/* Get In Touch CTA */}
          <button
            onClick={() => handleNavClick('#contact')}
            className="premium-btn nav-cta-btn"
            style={{ padding: '8px 18px', fontSize: '0.85rem', borderRadius: '8px', display: 'none', gap: '6px' }}
          >
            Get In Touch <ArrowUpRight size={14} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--color-text-primary)', cursor: 'pointer', display: 'block'
            }}
            className="nav-mobile-trigger"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 99
        }}>
          {[
            { label: '🧭 About', selector: '#about' },
            { label: '⚡ Skills', selector: '#skills' },
            { label: '💼 Projects', selector: '#projects' },
            { label: '🎯 Recruiter Hub', selector: '#recruiter' },
            { label: '📬 Contact', selector: '#contact' },
          ].map(({ label, selector }) => (
            <button key={label} onClick={() => handleNavClick(selector)} style={mobileNavButtonStyle}>
              {label}
            </button>
          ))}
          <Link
            to="/blog"
            onClick={() => setIsMenuOpen(false)}
            style={{ ...mobileNavButtonStyle, textDecoration: 'none' }}
          >
            📝 Blog
          </Link>

          {/* Mobile admin link */}
          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '12px', paddingTop: '12px' }}>
            {isLoggedIn ? (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...mobileNavButtonStyle, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Shield size={16} /> Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...mobileNavButtonStyle, color: 'var(--color-text-tertiary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
              >
                <Lock size={14} /> Admin Login
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop-container { display: flex !important; }
          .nav-desktop-btn { display: inline-flex !important; }
          .nav-cta-btn { display: inline-flex !important; }
          .nav-mobile-trigger { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

const navButtonStyle = {
  background: 'transparent', border: 'none',
  fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.92rem',
  color: 'var(--color-text-secondary)', cursor: 'pointer',
  transition: 'color 0.2s', padding: '6px 0'
};

const mobileNavButtonStyle = {
  background: 'transparent', border: 'none',
  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem',
  color: 'var(--color-text-secondary)', cursor: 'pointer',
  textAlign: 'left', width: '100%', padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.04)'
};

export default Navbar;
