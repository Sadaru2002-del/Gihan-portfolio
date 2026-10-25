import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderPlus,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Github,
  Globe,
  Code,
  Layers,
  Activity,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { api } from '../utils/api';
import FileUpload from '../components/FileUpload';
import { toast } from '../context/ToastContext';

const PRESET_TECH = [
  'React', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Supabase',
  'Firebase', 'Three.js', 'TypeScript', 'JavaScript', 'Tailwind CSS',
  'Next.js', 'Redux', 'REST API', 'GraphQL', 'Docker', 'AWS', 'Python'
];

const CATEGORIES = [
  'Full Stack',
  'Web App',
  'Frontend',
  'Backend',
  'Mobile App',
  'AI / ML',
  'Cloud / DevOps',
  'System Utility',
  'Open Source'
];

const ProjectSubmit = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('gihan_theme') || 'dark');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('gihan_theme', next);
    if (next === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('gihan_theme') || 'dark';
    setTheme(saved);
    if (saved === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web App',
    status: 'Completed',
    featured: true,
    technologies: '',
    githubLink: '',
    liveLink: '',
    imageUrl: '',
    description: '',
    longDescription: '',
    architectureDiagram: '',
    linesOfCode: 5000,
    testCoverage: 90,
    lighthouseScore: 98,
    loadTimeMs: 380
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTechClick = (tech) => {
    const current = formData.technologies
      ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    if (!current.includes(tech)) {
      const updated = [...current, tech].join(', ');
      setFormData(prev => ({ ...prev, technologies: updated }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Please enter a project title.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Please provide a short description.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const formattedTechnologies = formData.technologies
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        status: formData.status,
        featured: Boolean(formData.featured),
        technologies: formattedTechnologies,
        githubLink: formData.githubLink.trim(),
        liveLink: formData.liveLink.trim(),
        imageUrl: formData.imageUrl.trim(),
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim() || formData.description.trim(),
        architectureDiagram: formData.architectureDiagram.trim(),
        codeMetrics: {
          linesOfCode: Number(formData.linesOfCode) || 0,
          testCoverage: Number(formData.testCoverage) || 0
        },
        performanceMetrics: {
          lighthouseScore: Number(formData.lighthouseScore) || 98,
          loadTimeMs: Number(formData.loadTimeMs) || 380
        }
      };

      const result = await api.createProject(payload);
      setSuccessData(result);
      toast.success('Project submitted and published successfully!');
    } catch (err) {
      console.error('Submission failed:', err);
      const msg = err.message || 'Failed to submit project to Supabase.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFormData({
      title: '',
      category: 'Web App',
      status: 'Completed',
      featured: true,
      technologies: '',
      githubLink: '',
      liveLink: '',
      imageUrl: '',
      description: '',
      longDescription: '',
      architectureDiagram: '',
      linesOfCode: 5000,
      testCoverage: 90,
      lighthouseScore: 98,
      loadTimeMs: 380
    });
  };

  const handleCopyCurrentLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.info('Form URL copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Background Glow Accents */}
      <div style={styles.glowOrb1} />
      <div style={styles.glowOrb2} />

      {/* Header Bar */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Back to Portfolio</span>
          </Link>

          <div style={styles.badge}>
            <Sparkles size={14} style={{ color: '#a855f7' }} />
            <span>Direct Project Entry Form</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={toggleTheme}
              style={{ ...styles.headerBtn, padding: '6px 10px' }}
              title="Toggle Light / Dark Mode"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyCurrentLink}
              style={styles.headerBtn}
              title="Copy this form URL to share or bookmark"
            >
              {copiedLink ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Form Link'}</span>
            </button>
            <Link to="/admin" style={styles.adminBtn}>
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </header>

      <main style={styles.container}>
        {/* Title & Introduction */}
        <div style={styles.introSection}>
          <div style={styles.iconHeader}>
            <FolderPlus size={32} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 style={styles.mainTitle}>Add New Showcase Project</h1>
          <p style={styles.subtitle}>
            Enter complete project specifications, upload media to Supabase cloud storage, and instantly publish directly to Gihan's live portfolio showcase.
          </p>
        </div>

        {/* Success Modal / State */}
        {successData ? (
          <div style={styles.successCard} className="glass-card">
            <div style={styles.successIconWrap}>
              <CheckCircle size={48} style={{ color: '#10b981' }} />
            </div>
            <h2 style={styles.successTitle}>🎉 Project Published Successfully!</h2>
            <p style={styles.successDesc}>
              <strong>"{successData.title}"</strong> has been saved directly to your Supabase PostgreSQL database and will appear immediately in your portfolio.
            </p>

            <div style={styles.successActions}>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={styles.primaryBtn}
              >
                <Globe size={16} />
                <span>View on Portfolio</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={styles.secondaryBtn}
              >
                <FolderPlus size={16} />
                <span>Submit Another Project</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={styles.outlineBtn}
              >
                <ShieldCheck size={16} />
                <span>Manage in Admin Panel</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.formCard} className="glass-card">
            {errorMsg && (
              <div style={styles.errorAlert}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Basic Info */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeading}>
                <Layers size={18} style={{ color: 'var(--color-primary)' }} />
                <span>1. Core Project Information</span>
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Dining — Restaurant Management Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.select}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={styles.select}
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Beta">Beta Release</option>
                    <option value="Planned">Planned</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Short Summary / Tagline *</label>
                <input
                  type="text"
                  placeholder="Brief 1-2 sentence overview shown on the card preview"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Detailed Case Study / Description</label>
                <textarea
                  rows={4}
                  placeholder="Comprehensive technical details, architecture overview, challenges solved, and key features..."
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  style={styles.textarea}
                />
              </div>
            </div>

            {/* Section 2: Tech Stack */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeading}>
                <Code size={18} style={{ color: 'var(--color-primary)' }} />
                <span>2. Technologies & Stack</span>
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Technologies (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express, MongoDB, Firebase, Supabase"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  style={styles.input}
                />
              </div>

              {/* Quick Tech Select Pills */}
              <div style={{ marginTop: '-4px' }}>
                <span style={styles.helperText}>Quick click to add popular technologies:</span>
                <div style={styles.pillContainer}>
                  {PRESET_TECH.map(tech => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleTechClick(tech)}
                      style={styles.techPill}
                    >
                      + {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Media & Visuals */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeading}>
                <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
                <span>3. Project Visuals & Supabase Media Upload</span>
              </h3>

              <div style={styles.formGroup}>
                <FileUpload
                  label="Upload Cover Image / Screenshot (Direct to Supabase Storage)"
                  folder="projects"
                  currentUrl={formData.imageUrl}
                  onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Or Provide External Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Architecture SVG / Diagram Code (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="<svg ...>...</svg> or diagram notes"
                  value={formData.architectureDiagram}
                  onChange={(e) => setFormData({ ...formData, architectureDiagram: e.target.value })}
                  style={{ ...styles.textarea, fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* Section 4: Links & Deployment */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeading}>
                <ExternalLink size={18} style={{ color: 'var(--color-primary)' }} />
                <span>4. Repository & Live Deployment</span>
              </h3>

              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Github size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/Sadaru2002-del/..."
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Globe size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Live Demo / Web Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app or http://..."
                    value={formData.liveLink}
                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Metrics & Settings */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeading}>
                <Activity size={18} style={{ color: 'var(--color-primary)' }} />
                <span>5. Engineering Metrics & Display</span>
              </h3>

              <div style={styles.grid4}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Lines of Code</label>
                  <input
                    type="number"
                    value={formData.linesOfCode}
                    onChange={(e) => setFormData({ ...formData, linesOfCode: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Test Coverage %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.testCoverage}
                    onChange={(e) => setFormData({ ...formData, testCoverage: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Lighthouse Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.lighthouseScore}
                    onChange={(e) => setFormData({ ...formData, lighthouseScore: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Load Time (ms)</label>
                  <input
                    type="number"
                    value={formData.loadTimeMs}
                    onChange={(e) => setFormData({ ...formData, loadTimeMs: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Featured Switch */}
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <span>🌟 Feature this project prominently on the Portfolio Homepage</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div style={styles.actionRow}>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={styles.cancelBtn}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                style={styles.submitBtn}
                className="premium-btn"
              >
                {submitting ? (
                  <span>Saving to Supabase...</span>
                ) : (
                  <>
                    <FolderPlus size={18} />
                    <span>Publish Project to Portfolio</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: '#07070d',
    color: '#f8fafc',
    position: 'relative',
    overflowX: 'hidden',
    paddingBottom: '80px',
    fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)'
  },
  glowOrb1: {
    position: 'absolute',
    top: '-150px',
    left: '10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
    zIndex: 0
  },
  glowOrb2: {
    position: 'absolute',
    top: '30%',
    right: '5%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
    zIndex: 0
  },
  header: {
    borderBottom: '1px solid var(--border-color)',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(16px)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  headerContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'color 0.2s'
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(var(--color-primary-rgb), 0.1)',
    border: '1px solid rgba(var(--color-primary-rgb), 0.3)',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-primary)'
  },
  headerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--color-text-primary)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  adminBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(var(--color-primary-rgb), 0.15)',
    border: '1px solid rgba(var(--color-primary-rgb), 0.35)',
    color: 'var(--color-primary)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textDecoration: 'none'
  },
  container: {
    maxWidth: '850px',
    margin: '40px auto 0 auto',
    padding: '0 20px',
    position: 'relative',
    zIndex: 1
  },
  introSection: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  iconHeader: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(168, 85, 247, 0.12)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto'
  },
  mainTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--color-text-primary) 40%, var(--color-primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    maxWidth: '650px',
    margin: '0 auto'
  },
  formCard: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    boxShadow: 'var(--shadow-lg)'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--border-color)'
  },
  sectionHeading: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary)'
  },
  input: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  },
  select: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  textarea: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 1.5,
    width: '100%',
    boxSizing: 'border-box'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '14px'
  },
  helperText: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginBottom: '8px',
    display: 'block'
  },
  pillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  techPill: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.75rem',
    color: '#cbd5e1',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  checkboxRow: {
    marginTop: '6px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#e2e8f0',
    fontWeight: 500
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#a855f7',
    cursor: 'pointer'
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px'
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#94a3b8',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 28px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#f87171',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem'
  },
  successCard: {
    background: 'rgba(17, 17, 30, 0.85)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '16px',
    padding: '48px 32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  successIconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px'
  },
  successTitle: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)'
  },
  successDesc: {
    color: 'var(--color-text-secondary)',
    fontSize: '1rem',
    lineHeight: 1.6,
    maxWidth: '520px'
  },
  successActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '16px'
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #9333ea, #6366f1)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 22px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--color-text-primary)',
    borderRadius: '10px',
    padding: '12px 22px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  outlineBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    color: '#c084fc',
    borderRadius: '10px',
    padding: '12px 22px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer'
  }
};

export default ProjectSubmit;
