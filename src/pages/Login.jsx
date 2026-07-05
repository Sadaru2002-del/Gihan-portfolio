import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Log page view
    api.logPageView('/login');

    const token = localStorage.getItem('gihan_auth_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all details.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      localStorage.setItem('gihan_auth_token', data.token);
      localStorage.setItem('gihan_user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
      <div className="gradient-mesh" />

      <div className="container" style={{ maxWidth: '420px' }}>
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="secondary-btn"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            borderRadius: '6px',
            position: 'absolute',
            top: '40px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={14} /> Back to brand
        </button>

        <div className="glass-card" style={{ padding: '36px', background: 'rgba(5, 5, 8, 0.85)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(var(--color-primary-rgb), 0.1)',
                color: 'var(--color-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h2 className="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Admin Portal</h2>
            <p className="body-small" style={{ marginTop: '4px' }}>Sign in to synchronize database settings, view traffic logs, and manage content.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(239,68,68,0.2)', marginBottom: '16px', textAlign: 'left' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="thanivunum@gmail.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} /> Access Secret Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="premium-btn" style={{ justifyContent: 'center', width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Validating login...' : 'Authorize Login Session'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
