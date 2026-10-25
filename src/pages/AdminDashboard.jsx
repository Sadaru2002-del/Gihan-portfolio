import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { isSupabaseConfigured } from '../supabase';
import { toast } from '../context/ToastContext';
import {
  BarChart2,
  MessageSquare,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Shield,
  Check,
  Trash2,
  Edit3,
  ArrowLeft,
  Cpu,
  Activity,
  User,
  Menu,
  X,
  Eye,
  Database,
  Copy,
  ExternalLink,
  FolderPlus,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('gihan_theme') || 'dark');

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(nextTheme);
    localStorage.setItem('gihan_theme', nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('gihan_theme') || 'dark';
    setCurrentTheme(saved);
    if (saved === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    theme: 'dark',
    seoKeywords: '',
    seoDescription: '',
    avatarUrl: '',
    resumeUrl: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [messageFilter, setMessageFilter] = useState('all');

  // Form states - Projects
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'Web App',
    technologies: '',
    githubLink: '',
    liveLink: '',
    imageUrl: '',
    status: 'Completed',
    linesOfCode: 0,
    testCoverage: 0,
    lighthouseScore: 100,
    architectureDiagram: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [copiedProjectLink, setCopiedProjectLink] = useState(false);
  const [copiedCloudLink, setCopiedCloudLink] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const projectSubmissionUrl = `${window.location.origin}${window.location.pathname}#/submit-project`;
  const aiCloudInstructionsUrl = 'https://quaattpwaoqojzlvpbaz.supabase.co/storage/v1/object/public/portfolio/api/ai-instructions.md';

  const handleCopyProjectLink = () => {
    navigator.clipboard.writeText(projectSubmissionUrl);
    setCopiedProjectLink(true);
    setTimeout(() => setCopiedProjectLink(false), 2500);
  };

  const handleCopyCloudLink = () => {
    navigator.clipboard.writeText(aiCloudInstructionsUrl);
    setCopiedCloudLink(true);
    setTimeout(() => setCopiedCloudLink(false), 2500);
  };

  const handleCopyPrompt = () => {
    const promptText = `Please add this project to my portfolio using this cloud instruction link: ${aiCloudInstructionsUrl}\n\nProject Link / Details: [PASTE YOUR GITHUB OR PROJECT LINK HERE]`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Form states - Blogs
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Software Development',
    summary: '',
    content: '',
    coverImage: '',
    tags: '',
    status: 'Published'
  });
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Form states - Skills
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Web Technologies',
    level: 80,
    icon: 'Code',
    color: '#9333EA',
    relationshipTree: '',
    learningProgress: 90
  });
  const [editingSkillId, setEditingSkillId] = useState(null);

  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const data = await api.getAnalyticsStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchBlogs = async () => {
    try {
      const data = await api.getBlogs();
      setBlogs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data) {
        setSiteSettings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchMessages(),
        fetchProjects(),
        fetchBlogs(),
        fetchSkills(),
        fetchSettings()
      ]);
    } catch (e) {
      console.error("Error loading dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gihan_auth_token');
    localStorage.removeItem('gihan_user');
    navigate('/login');
  };

  useEffect(() => {
    api.logPageView('/admin');

    const token = localStorage.getItem('gihan_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Message Actions
  const handleMarkMessageRead = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'read' ? 'unread' : 'read';
      await api.updateMessageStatus(id, { status: newStatus });
      toast.success(`Message marked as ${newStatus}!`);
      fetchMessages();
    } catch (e) {
      toast.error('Error updating status');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete message?')) return;
    try {
      await api.deleteMessage(id);
      toast.success('Message deleted successfully!');
      fetchMessages();
      fetchStats();
    } catch (e) {
      toast.error('Error deleting message');
    }
  };

  // Project Actions
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
      codeMetrics: { linesOfCode: Number(projectForm.linesOfCode), testCoverage: Number(projectForm.testCoverage) },
      performanceMetrics: { lighthouseScore: Number(projectForm.lighthouseScore), loadTimeMs: 400 }
    };

    try {
      if (editingProjectId) {
        await api.updateProject(editingProjectId, formattedData);
        toast.success('Project updated successfully!');
      } else {
        await api.createProject(formattedData);
        toast.success('Project published successfully!');
      }
      setProjectForm({
        title: '',
        description: '',
        longDescription: '',
        category: 'Web App',
        technologies: '',
        githubLink: '',
        liveLink: '',
        imageUrl: '',
        status: 'Completed',
        linesOfCode: 0,
        testCoverage: 0,
        lighthouseScore: 100,
        architectureDiagram: ''
      });
      setEditingProjectId(null);
      fetchProjects();
      fetchStats();
    } catch (err) {
      toast.error('Error saving project: ' + err.message);
    }
  };

  const handleEditProject = (proj) => {
    setEditingProjectId(proj._id);
    setProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      longDescription: proj.longDescription || '',
      category: proj.category || 'Web App',
      technologies: proj.technologies ? proj.technologies.join(', ') : '',
      githubLink: proj.githubLink || '',
      liveLink: proj.liveLink || '',
      imageUrl: proj.imageUrl || '',
      status: proj.status || 'Completed',
      linesOfCode: proj.codeMetrics?.linesOfCode || 0,
      testCoverage: proj.codeMetrics?.testCoverage || 0,
      lighthouseScore: proj.performanceMetrics?.lighthouseScore || 100,
      architectureDiagram: proj.architectureDiagram || ''
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete project?')) return;
    try {
      await api.deleteProject(id);
      toast.success('Project removed from showcase!');
      fetchProjects();
      fetchStats();
    } catch (e) {
      toast.error('Error deleting project');
    }
  };

  // Blog Actions
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...blogForm,
      tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingBlogId) {
        await api.updateBlog(editingBlogId, formattedData);
        toast.success('Blog article updated successfully!');
      } else {
        await api.createBlog(formattedData);
        toast.success('Blog article published successfully!');
      }
      setBlogForm({ title: '', category: 'Software Development', summary: '', content: '', coverImage: '', tags: '', status: 'Published' });
      setEditingBlogId(null);
      fetchBlogs();
      fetchStats();
    } catch (err) {
      toast.error('Error saving blog: ' + err.message);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title || '',
      category: blog.category || 'Software Development',
      summary: blog.summary || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      tags: blog.tags ? blog.tags.join(', ') : '',
      status: blog.status || 'Published'
    });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete blog post?')) return;
    try {
      await api.deleteBlog(id);
      toast.success('Blog article deleted successfully!');
      fetchBlogs();
      fetchStats();
    } catch (e) {
      toast.error('Error deleting blog post');
    }
  };

  // Skill Actions
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...skillForm,
      level: Number(skillForm.level),
      learningProgress: Number(skillForm.learningProgress),
      relationshipTree: skillForm.relationshipTree.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingSkillId) {
        await api.updateSkill(editingSkillId, formattedData);
        toast.success('Skill updated successfully!');
      } else {
        await api.createSkill(formattedData);
        toast.success('Skill added to matrix successfully!');
      }
      setSkillForm({
        name: '',
        category: 'Web Technologies',
        level: 80,
        icon: 'Code',
        color: '#9333EA',
        relationshipTree: '',
        learningProgress: 90
      });
      setEditingSkillId(null);
      fetchSkills();
      fetchStats();
    } catch (err) {
      toast.error('Error saving skill: ' + err.message);
    }
  };

  const handleEditSkill = (sk) => {
    setEditingSkillId(sk._id);
    setSkillForm({
      name: sk.name || '',
      category: sk.category || 'Web Technologies',
      level: sk.level || 80,
      icon: sk.icon || 'Code',
      color: sk.color || '#9333EA',
      relationshipTree: sk.relationshipTree ? sk.relationshipTree.join(', ') : '',
      learningProgress: sk.learningProgress || 90
    });
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete skill?')) return;
    try {
      await api.deleteSkill(id);
      toast.success('Skill deleted successfully!');
      fetchSkills();
      fetchStats();
    } catch (err) {
      toast.error('Error deleting skill');
    }
  };

  // Settings Actions
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(siteSettings);
      toast.success('Site settings and profile updated successfully!');
      fetchSettings();
    } catch (err) {
      toast.error('Error updating settings: ' + err.message);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (messageFilter === 'read') return msg.status === 'read';
    if (messageFilter === 'unread') return msg.status === 'unread';
    return true;
  });

  return (
    <div style={styles.dashboardWrapper}>
      {/* Mobile Top Header */}
      <div style={styles.mobileHeader}>
        <div style={styles.brandTitle}>
          <Shield size={20} style={{ color: 'var(--color-primary)' }} />
          <span>GihanSuminda OS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleTheme}
            style={styles.themeToggleBtn}
            title={currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {currentTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.menuToggleBtn}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div style={styles.mainGrid} className="admin-main-grid">
        {/* Navigation Sidebar */}
        <aside style={{
          ...styles.sidebar,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
        }} className="sidebar-drawer">
          <div style={styles.sidebarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={24} style={{ color: 'var(--color-primary)' }} />
              <h2 style={styles.sidebarTitle}>Admin Console</h2>
            </div>
            <button
              onClick={toggleTheme}
              style={styles.themeToggleBtn}
              title={currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {currentTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <div style={styles.adminProfileInfo}>
            <div style={styles.avatarGlow}>
              <User size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={styles.adminName}>{siteSettings.siteName || 'Portfolio Admin'}</div>
              <div style={styles.adminRole}>
                {isSupabaseConfigured() ? (
                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                    <Database size={11} /> Supabase Cloud
                  </span>
                ) : (
                  <span style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                    <Database size={11} /> Local Storage
                  </span>
                )}
              </div>
            </div>
          </div>

          <nav style={styles.sidebarNav}>
            {[
              { id: 'analytics', label: 'Analytics Panel', icon: <BarChart2 size={18} /> },
              { id: 'messages', label: 'Message Inbox', icon: <MessageSquare size={18} />, count: messages.filter(m => m.status === 'unread').length },
              { id: 'projects', label: 'Projects Manager', icon: <Briefcase size={18} /> },
              { id: 'blogs', label: 'Blog Publisher', icon: <FileText size={18} /> },
              { id: 'skills', label: 'Skills Manager', icon: <Cpu size={18} /> },
              { id: 'settings', label: 'Site Settings', icon: <Settings size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                style={{
                  ...styles.navItem,
                  ...(activeTab === tab.id ? styles.activeNavItem : {})
                }}
              >
                <span style={styles.navIconWrapper}>
                  {tab.icon}
                  {tab.count > 0 && <span style={styles.navBadge}>{tab.count}</span>}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div style={styles.sidebarFooter}>
            <button
              onClick={toggleTheme}
              style={{ ...styles.sidebarBtn, color: 'var(--color-text-primary)' }}
              className="secondary-btn"
            >
              {currentTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            <button
              onClick={() => navigate('/')}
              style={styles.sidebarBtn}
              className="secondary-btn"
            >
              <ArrowLeft size={16} /> Portfolio Home
            </button>

            <button
              onClick={handleLogout}
              style={{ ...styles.sidebarBtn, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              className="secondary-btn"
            >
              <LogOut size={16} /> End Session
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && <div style={styles.backdrop} onClick={() => setSidebarOpen(false)} />}

        {/* Content Area */}
        <main style={styles.contentArea}>
          {loading ? (
            <div style={styles.loadingWrapper}>
              <div style={styles.spinner}></div>
              <p style={{ marginTop: '16px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>Synchronizing Secure Core...</p>
            </div>
          ) : (
            <div style={styles.tabContentTransition}>
              
              {/* TAB 1: ANALYTICS PANEL */}
              {activeTab === 'analytics' && stats && (
                <div style={styles.tabSection}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>System Analytics</h3>
                    <p style={styles.sectionSubtitle}>Anonymous path telemetry and activity metrics</p>
                  </div>

                  <div style={styles.statsGrid}>
                    {[
                      { label: 'Total Pageviews', val: stats.summary.pageviews, icon: <Eye size={20} />, gradient: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15) 0%, rgba(157, 78, 221, 0.05) 100%)' },
                      { label: 'Unique Visitors', val: stats.summary.uniqueVisitors, icon: <Activity size={20} />, gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.05) 100%)' },
                      { label: 'Showcase Projects', val: stats.summary.projectCount, icon: <Briefcase size={20} />, gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.05) 100%)' },
                      { label: 'Published Articles', val: stats.summary.blogCount, icon: <FileText size={20} />, gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.05) 100%)' },
                      { label: 'Pending Inquiries', val: stats.summary.messageCount, icon: <MessageSquare size={20} />, gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ ...styles.statCard, background: item.gradient }}>
                        <div style={styles.statCardHeader}>
                          <span style={styles.statCardLabel}>{item.label}</span>
                          <span style={styles.statCardIcon}>{item.icon}</span>
                        </div>
                        <div style={styles.statCardValue}>{item.val}</div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.analyticsDetailGrid}>
                    <div style={styles.panelCard} className="glass-card">
                      <h4 style={styles.panelCardTitle}>Traffic by Path</h4>
                      <div style={styles.barChartContainer}>
                        {Object.entries(stats.paths).map(([path, count], idx) => {
                          const maxCount = Math.max(...Object.values(stats.paths), 1);
                          const percentage = (count / maxCount) * 100;
                          return (
                            <div key={idx} style={styles.chartBarRow}>
                              <div style={styles.chartBarLabel}>{path}</div>
                              <div style={styles.chartBarOuter}>
                                <div style={{ ...styles.chartBarInner, width: `${percentage}%` }} />
                              </div>
                              <div style={styles.chartBarValue}>{count}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={styles.panelCard} className="glass-card">
                      <h4 style={styles.panelCardTitle}>Visitor Operating Systems</h4>
                      <div style={styles.osGrid}>
                        {Object.entries(stats.os).map(([os, count], idx) => {
                          const total = Object.values(stats.os).reduce((a, b) => a + b, 0);
                          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                          return (
                            <div key={idx} style={styles.osRow}>
                              <div style={styles.osName}>{os}</div>
                              <div style={styles.osProgressWrapper}>
                                <div style={{ ...styles.osProgressBar, width: `${pct}%` }} />
                              </div>
                              <div style={styles.osCount}>{pct}% ({count})</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MESSAGES INBOX */}
              {activeTab === 'messages' && (
                <div style={styles.tabSection}>
                  <div style={styles.sectionHeaderWithActions}>
                    <div>
                      <h3 style={styles.sectionTitle}>Inquiry Queue</h3>
                      <p style={styles.sectionSubtitle}>Messages from recruiters, developers, and partners</p>
                    </div>

                    <div style={styles.filterGroup}>
                      {['all', 'unread', 'read'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setMessageFilter(filter)}
                          style={{
                            ...styles.filterBtn,
                            ...(messageFilter === filter ? styles.activeFilterBtn : {})
                          }}
                        >
                          {filter.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.messagesContainer}>
                    {filteredMessages.length === 0 ? (
                      <div style={styles.emptyStateCard} className="glass-card">
                        <MessageSquare size={32} style={{ color: 'var(--color-text-tertiary)', marginBottom: '12px' }} />
                        <div>No messages found matching the filter.</div>
                      </div>
                    ) : (
                      filteredMessages.map((msg) => (
                        <div
                          key={msg._id}
                          style={{
                            ...styles.messageCard,
                            borderColor: msg.status === 'unread' ? 'rgba(138, 43, 226, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                            background: msg.status === 'unread' ? 'rgba(138, 43, 226, 0.02)' : 'rgba(255, 255, 255, 0.01)'
                          }}
                          className="glass-card"
                        >
                          <div style={styles.messageCardHeader}>
                            <div style={styles.messageMeta}>
                              <span style={{
                                ...styles.categoryBadge,
                                backgroundColor: msg.category === 'Recruitment' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(138, 43, 226, 0.1)',
                                color: msg.category === 'Recruitment' ? '#10B981' : 'var(--color-primary)'
                              }}>
                                {msg.category}
                              </span>
                              <span style={styles.messageIp}>IP: {msg.ipAddress || 'unknown'}</span>
                            </div>

                            <div style={styles.messageActions}>
                              <button
                                onClick={() => handleMarkMessageRead(msg._id, msg.status)}
                                style={styles.actionIconButton}
                                title={msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                              >
                                <Check size={16} style={{ color: msg.status === 'read' ? '#10B981' : 'var(--color-text-secondary)' }} />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                style={styles.actionIconButton}
                                title="Delete Permanently"
                              >
                                <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                              </button>
                            </div>
                          </div>

                          <h4 style={styles.messageSubject}>{msg.subject}</h4>
                          
                          <div style={styles.messageSenderInfo}>
                            From: <strong style={{ color: 'var(--color-text-primary)' }}>{msg.name}</strong> ({msg.email}) 
                            <span style={styles.messageDivider}>•</span> 
                            {new Date(msg.createdAt).toLocaleString()}
                          </div>

                          <p style={styles.messageBody}>{msg.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECTS MANAGER */}
              {activeTab === 'projects' && (
                <div style={styles.tabSection}>
                  <div style={styles.sectionHeader}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', width: '100%' }}>
                      <div>
                        <h3 style={styles.sectionTitle}>Showcase Projects Manager</h3>
                        <p style={styles.sectionSubtitle}>Add, edit, or remove entries in your professional showcase</p>
                      </div>
                      <a
                        href="#/submit-project"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="premium-btn"
                        style={{
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <FolderPlus size={16} />
                        <span>Open Project Form Page</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Dedicated AI Cloud Link & Project Entry Banner */}
                  <div style={styles.submissionLinkCard}>
                    {/* Cloud AI Direct Ingestion Link (For Any AI Chat / No Localhost) */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={styles.submissionLinkIcon}>
                        <Sparkles size={22} color="#c084fc" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            🤖 AI Cloud Direct Project Injection Link
                          </h4>
                          <span style={styles.submissionBadge}>
                            Permanent Cloud URL (No Localhost)
                          </span>
                        </div>
                        <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                          මෙම <strong>Permanent Cloud Link</strong> එක ඕනෑම AI Chat එකකට (Antigravity, ChatGPT, Claude) ලබා දී, <em>"මේ link එකෙන් මගේ portfolio එකට මේ project එක add කරන්න"</em> යැයි පැවසූ විට, ඔබේ කිසිදු මැදිහත්වීමකින් තොරව AI මගින් සෘජුවම Project එක Database එකට Insert කරනු ඇත:
                        </p>
                      </div>
                    </div>

                    {/* Cloud AI Link Row */}
                    <div style={styles.submissionLinkRow}>
                      <div style={styles.submissionLinkBox}>
                        <span style={styles.submissionLinkText}>{aiCloudInstructionsUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCloudLink}
                        style={styles.copyLinkBtn}
                        title="Copy AI Cloud Link"
                      >
                        {copiedCloudLink ? (
                          <>
                            <Check size={16} color="#10b981" />
                            <span style={{ color: '#10b981', fontWeight: 600 }}>Cloud Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy AI Cloud Link</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        style={styles.copyPromptBtn}
                        title="Copy ready-to-paste AI Prompt"
                      >
                        {copiedPrompt ? (
                          <>
                            <Check size={16} color="#10b981" />
                            <span style={{ color: '#10b981', fontWeight: 600 }}>Prompt Copied!</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} color="#c084fc" />
                            <span>Copy AI Prompt</span>
                          </>
                        )}
                      </button>
                      <a
                        href={aiCloudInstructionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.openFormBtn}
                        title="View Cloud AI Instruction Spec"
                      >
                        <ExternalLink size={16} />
                        <span>View Cloud Spec</span>
                      </a>
                    </div>

                    {/* Secondary helper: Standalone web entry form link */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        🌐 අතින් විස්තර පුරවා submit කිරීමට අවශ්‍ය නම් Web Form එක භාවිතා කරන්න:
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={handleCopyProjectLink}
                          style={{ ...styles.copyLinkBtn, padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          {copiedProjectLink ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          <span>{copiedProjectLink ? 'Form Link Copied!' : 'Copy Form Link'}</span>
                        </button>
                        <a
                          href="#/submit-project"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ ...styles.openFormBtn, padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <ExternalLink size={14} />
                          <span>Open Web Form</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div style={styles.twoColumnLayout}>
                    <div style={styles.formContainer} className="glass-card">
                      <h4 style={styles.formSectionTitle}>
                        {editingProjectId ? 'Modify Existing Entry' : 'Create Showcase Project'}
                      </h4>

                      <form onSubmit={handleProjectSubmit} style={styles.dashboardForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Project Title</label>
                          <input
                            type="text"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="Lumina Dining Platform"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Category</label>
                            <select
                              value={projectForm.category}
                              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                              style={styles.formSelect}
                            >
                              <option>Full Stack</option>
                              <option>Web App</option>
                              <option>Frontend</option>
                              <option>Backend</option>
                              <option>Mobile App</option>
                              <option>AI / ML</option>
                              <option>Cloud / DevOps</option>
                              <option>System Utility</option>
                              <option>Open Source</option>
                            </select>
                          </div>

                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Status</label>
                            <select
                              value={projectForm.status}
                              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                              style={styles.formSelect}
                            >
                              <option>Completed</option>
                              <option>In Progress</option>
                              <option>Archived</option>
                            </select>
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Technologies (comma-separated)</label>
                          <input
                            type="text"
                            value={projectForm.technologies}
                            onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                            placeholder="React, Express.js, MongoDB"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>GitHub Link</label>
                            <input
                              type="text"
                              value={projectForm.githubLink}
                              onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                              placeholder="https://github.com/..."
                              style={styles.formInput}
                            />
                          </div>

                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Live Link</label>
                            <input
                              type="text"
                              value={projectForm.liveLink}
                              onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                              placeholder="https://..."
                              style={styles.formInput}
                            />
                          </div>
                        </div>

                        <div style={styles.formRow3}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Lines of Code</label>
                            <input
                              type="number"
                              value={projectForm.linesOfCode}
                              onChange={(e) => setProjectForm({ ...projectForm, linesOfCode: Number(e.target.value) })}
                              style={styles.formInput}
                            />
                          </div>

                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Test Coverage (%)</label>
                            <input
                              type="number"
                              value={projectForm.testCoverage}
                              onChange={(e) => setProjectForm({ ...projectForm, testCoverage: Number(e.target.value) })}
                              style={styles.formInput}
                            />
                          </div>

                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Lighthouse Score</label>
                            <input
                              type="number"
                              value={projectForm.lighthouseScore}
                              onChange={(e) => setProjectForm({ ...projectForm, lighthouseScore: Number(e.target.value) })}
                              style={styles.formInput}
                            />
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Short Description</label>
                          <input
                            type="text"
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                            placeholder="Brief outline"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Detailed Case Study</label>
                          <textarea
                            value={projectForm.longDescription}
                            onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                            placeholder="Technical details..."
                            style={{ ...styles.formTextarea, minHeight: '100px' }}
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Architecture SVG String</label>
                          <textarea
                            value={projectForm.architectureDiagram}
                            onChange={(e) => setProjectForm({ ...projectForm, architectureDiagram: e.target.value })}
                            placeholder="<svg>...</svg>"
                            style={{ ...styles.formTextarea, minHeight: '60px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <FileUpload
                            label="Project Screenshot / Media (Supabase Storage)"
                            folder="projects"
                            currentUrl={projectForm.imageUrl}
                            onUploadSuccess={(url) => setProjectForm(prev => ({ ...prev, imageUrl: url }))}
                            deleteFromStorage={true}
                          />
                        </div>

                        <div style={styles.formActionRow}>
                          <button type="submit" className="premium-btn" style={{ flex: 1, justifyContent: 'center' }}>
                            {editingProjectId ? 'Update Project' : 'Publish Project'}
                          </button>
                          {editingProjectId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProjectId(null);
                                setProjectForm({
                                  title: '',
                                  description: '',
                                  longDescription: '',
                                  category: 'Web App',
                                  technologies: '',
                                  githubLink: '',
                                  liveLink: '',
                                  imageUrl: '',
                                  status: 'Completed',
                                  linesOfCode: 0,
                                  testCoverage: 0,
                                  lighthouseScore: 100,
                                  architectureDiagram: ''
                                });
                              }}
                              style={styles.cancelFormBtn}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    <div style={styles.listContainer}>
                      <h4 style={styles.listSectionTitle}>Active Showcase ({projects.length})</h4>
                      <div style={styles.itemList}>
                        {projects.map((proj) => (
                          <div key={proj._id} style={styles.itemCard} className="glass-card">
                            <div style={styles.itemDetails}>
                              <div style={styles.itemTitle}>{proj.title}</div>
                              <div style={styles.itemMeta}>
                                <span style={styles.itemBadge}>{proj.category}</span>
                                <span>LOC: {proj.codeMetrics?.linesOfCode || 0}</span>
                              </div>
                            </div>
                            <div style={styles.itemActions}>
                              <button onClick={() => handleEditProject(proj)} style={styles.editBtn} title="Edit">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDeleteProject(proj._id)} style={styles.deleteBtn} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BLOG PUBLISHER */}
              {activeTab === 'blogs' && (
                <div style={styles.tabSection}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Blog Publisher</h3>
                    <p style={styles.sectionSubtitle}>Compose, edit, and publish technical insights and logs</p>
                  </div>

                  <div style={styles.twoColumnLayout}>
                    <div style={styles.formContainer} className="glass-card">
                      <h4 style={styles.formSectionTitle}>
                        {editingBlogId ? 'Modify Blog Post' : 'Compose Article'}
                      </h4>

                      <form onSubmit={handleBlogSubmit} style={styles.dashboardForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Title</label>
                          <input
                            type="text"
                            value={blogForm.title}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            placeholder="Article title"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Category</label>
                            <input
                              type="text"
                              value={blogForm.category}
                              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                              placeholder="Software engineering"
                              style={styles.formInput}
                              required
                            />
                          </div>

                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Status</label>
                            <select
                              value={blogForm.status}
                              onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                              style={styles.formSelect}
                            >
                              <option>Published</option>
                              <option>Draft</option>
                            </select>
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Tags (comma-separated)</label>
                          <input
                            type="text"
                            value={blogForm.tags}
                            onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                            placeholder="Security, API"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Summary</label>
                          <input
                            type="text"
                            value={blogForm.summary}
                            onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                            placeholder="Short summary"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <FileUpload
                            label="Blog Cover Banner (Supabase Storage)"
                            folder="blogs"
                            currentUrl={blogForm.coverImage}
                            onUploadSuccess={(url) => setBlogForm(prev => ({ ...prev, coverImage: url }))}
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Content (Markdown)</label>
                          <textarea
                            value={blogForm.content}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            placeholder="Write here..."
                            style={{ ...styles.formTextarea, minHeight: '150px' }}
                            required
                          />
                        </div>

                        <div style={styles.formActionRow}>
                          <button type="submit" className="premium-btn" style={{ flex: 1, justifyContent: 'center' }}>
                            {editingBlogId ? 'Update Article' : 'Publish Article'}
                          </button>
                          {editingBlogId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBlogId(null);
                                setBlogForm({ title: '', category: 'Software Development', summary: '', content: '', tags: '', status: 'Published' });
                              }}
                              style={styles.cancelFormBtn}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    <div style={styles.listContainer}>
                      <h4 style={styles.listSectionTitle}>Published Articles ({blogs.length})</h4>
                      <div style={styles.itemList}>
                        {blogs.map((b) => (
                          <div key={b._id} style={styles.itemCard} className="glass-card">
                            <div style={styles.itemDetails}>
                              <div style={styles.itemTitle}>{b.title}</div>
                              <div style={styles.itemMeta}>
                                <span style={styles.itemBadge}>{b.category}</span>
                                <span>{b.status}</span>
                              </div>
                            </div>
                            <div style={styles.itemActions}>
                              <button onClick={() => handleEditBlog(b)} style={styles.editBtn} title="Edit">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDeleteBlog(b._id)} style={styles.deleteBtn} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SKILLS MANAGER */}
              {activeTab === 'skills' && (
                <div style={styles.tabSection}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Skills Manager</h3>
                    <p style={styles.sectionSubtitle}>Define skill metrics, technical relationships, and capability bars</p>
                  </div>

                  <div style={styles.twoColumnLayout}>
                    <div style={styles.formContainer} className="glass-card">
                      <h4 style={styles.formSectionTitle}>
                        {editingSkillId ? 'Modify Skill' : 'Register New Skill'}
                      </h4>

                      <form onSubmit={handleSkillSubmit} style={styles.dashboardForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Skill Name</label>
                          <input
                            type="text"
                            value={skillForm.name}
                            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                            placeholder="Express.js"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Category</label>
                            <select
                              value={skillForm.category}
                              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                              style={styles.formSelect}
                            >
                              <option>Web Technologies</option>
                              <option>Tools</option>
                              <option>Academic Subject</option>
                              <option>Other</option>
                            </select>
                          </div>

                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Icon Code</label>
                            <select
                              value={skillForm.icon}
                              onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                              style={styles.formSelect}
                            >
                              <option value="Code">Code</option>
                              <option value="Database">Database</option>
                              <option value="Cpu">Cpu</option>
                              <option value="Layers">Layers</option>
                              <option value="Globe">Globe</option>
                              <option value="Award">Award</option>
                            </select>
                          </div>
                        </div>

                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Level (0-100)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={skillForm.level}
                              onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                              style={styles.formInput}
                              required
                            />
                          </div>

                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Progress (0-100)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={skillForm.learningProgress}
                              onChange={(e) => setSkillForm({ ...skillForm, learningProgress: Number(e.target.value) })}
                              style={styles.formInput}
                              required
                            />
                          </div>
                        </div>

                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.formLabel}>Color Accent (Hex)</label>
                            <input
                              type="color"
                              value={skillForm.color}
                              onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                              style={{ ...styles.formInput, height: '40px', padding: '2px' }}
                            />
                          </div>

                          <div style={{ ...styles.formGroup, flex: 2 }}>
                            <label style={styles.formLabel}>Hex Value</label>
                            <input
                              type="text"
                              value={skillForm.color}
                              onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                              placeholder="#9333EA"
                              style={styles.formInput}
                              required
                            />
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Related Technologies</label>
                          <input
                            type="text"
                            value={skillForm.relationshipTree}
                            onChange={(e) => setSkillForm({ ...skillForm, relationshipTree: e.target.value })}
                            placeholder="Node.js, REST"
                            style={styles.formInput}
                          />
                        </div>

                        <div style={styles.formActionRow}>
                          <button type="submit" className="premium-btn" style={{ flex: 1, justifyContent: 'center' }}>
                            {editingSkillId ? 'Update Skill' : 'Register Skill'}
                          </button>
                          {editingSkillId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSkillId(null);
                                setSkillForm({
                                  name: '',
                                  category: 'Web Technologies',
                                  level: 80,
                                  icon: 'Code',
                                  color: '#9333EA',
                                  relationshipTree: '',
                                  learningProgress: 90
                                });
                              }}
                              style={styles.cancelFormBtn}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    <div style={styles.listContainer}>
                      <h4 style={styles.listSectionTitle}>Registered Skillsets ({skills.length})</h4>
                      <div style={styles.itemList}>
                        {skills.map((sk) => (
                          <div key={sk._id} style={styles.itemCard} className="glass-card">
                            <div style={styles.itemDetails}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ ...styles.colorIndicator, backgroundColor: sk.color }} />
                                <span style={styles.itemTitle}>{sk.name}</span>
                              </div>
                              <div style={styles.itemMeta}>
                                <span style={styles.itemBadge}>{sk.category}</span>
                                <span>Level: {sk.level}%</span>
                              </div>
                            </div>
                            <div style={styles.itemActions}>
                              <button onClick={() => handleEditSkill(sk)} style={styles.editBtn} title="Edit">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDeleteSkill(sk._id)} style={styles.deleteBtn} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SETTINGS */}
              {activeTab === 'settings' && (
                <div style={styles.tabSection}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Global Ecosystem Config</h3>
                    <p style={styles.sectionSubtitle}>Manage branding headers, platform SEO, and credentials</p>
                  </div>

                  <div style={{ maxWidth: '680px' }} className="glass-card">
                    <div style={styles.formContainer}>
                      <h4 style={styles.formSectionTitle}>System Meta Parameters</h4>

                      <form onSubmit={handleSettingsSubmit} style={styles.dashboardForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Site Name / Brand Header</label>
                          <input
                            type="text"
                            value={siteSettings.siteName}
                            onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                            placeholder="Gihan Suminda - Brand Platform"
                            style={styles.formInput}
                            required
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Ecosystem SEO Meta Keywords</label>
                          <input
                            type="text"
                            value={siteSettings.seoKeywords}
                            onChange={(e) => setSiteSettings({ ...siteSettings, seoKeywords: e.target.value })}
                            placeholder="Keywords..."
                            style={styles.formInput}
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Ecosystem SEO Meta Description</label>
                          <textarea
                            value={siteSettings.seoDescription}
                            onChange={(e) => setSiteSettings({ ...siteSettings, seoDescription: e.target.value })}
                            placeholder="Description..."
                            style={{ ...styles.formTextarea, minHeight: '100px' }}
                          />
                        </div>

                        {/* Supabase Storage Media Uploads */}
                        <div style={{ ...styles.formGroup, borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '12px' }}>
                          <FileUpload
                            label="Profile Avatar Photo (Supabase Storage)"
                            folder="avatars"
                            currentUrl={siteSettings.avatarUrl}
                            onUploadSuccess={(url) => setSiteSettings(prev => ({ ...prev, avatarUrl: url }))}
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <FileUpload
                            label="Active Resume File (PDF / DOCX)"
                            folder="resumes"
                            accept=".pdf,.doc,.docx"
                            currentUrl={siteSettings.resumeUrl}
                            onUploadSuccess={(url) => setSiteSettings(prev => ({ ...prev, resumeUrl: url }))}
                            helperText="Upload your official resume for recruiter instant downloads (PDF/DOCX max 5MB)"
                          />
                        </div>

                        {/* Supabase Cloud Connection Overview */}
                        <div
                          style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: isSupabaseConfigured() ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                            border: `1px solid ${isSupabaseConfigured() ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                            margin: '12px 0 20px 0',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Database size={18} style={{ color: isSupabaseConfigured() ? 'var(--success)' : 'var(--warning)' }} />
                            <strong style={{ fontSize: '0.9rem', color: isSupabaseConfigured() ? 'var(--success)' : 'var(--warning)' }}>
                              {isSupabaseConfigured() ? 'Supabase Database & Cloud Storage Active' : 'Supabase Cloud Configuration'}
                            </strong>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.6' }}>
                            {isSupabaseConfigured()
                              ? 'Your portfolio is connected to your Supabase PostgreSQL database and Storage bucket. Data and uploaded files are synced live to the cloud.'
                              : 'To connect to your cloud database & storage, open the .env file in the project root and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Run the provided supabase-schema.sql script in your Supabase SQL editor.'}
                          </p>
                        </div>

                        <button type="submit" className="premium-btn" style={{ justifyContent: 'center', marginTop: '10px' }}>
                          Commit Changes
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>

      {/* Inject custom CSS directly */}
      <style>{`
        .glass-card {
          background: var(--glass-bg) !important;
          border: 1px solid var(--border-color) !important;
          backdrop-filter: blur(16px) !important;
          box-shadow: var(--shadow-md) !important;
          border-radius: 12px;
        }
        
        /* Sidebar layout styles */
        @media (max-width: 991px) {
          .sidebar-drawer {
            position: fixed !important;
            top: 70px !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 999 !important;
            width: 280px !important;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
        }
        
        @media (min-width: 992px) {
          .admin-main-grid {
            grid-template-columns: 280px 1fr !important;
          }
          .sidebar-drawer {
            transform: none !important;
            position: sticky !important;
            top: 20px !important;
            height: calc(100vh - 40px) !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  dashboardWrapper: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--color-text-primary)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "var(--font-body), sans-serif",
    padding: '20px',
    boxSizing: 'border-box'
  },
  mobileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'var(--glass-bg)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderRadius: '12px',
    marginBottom: '20px'
  },
  brandTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)'
  },
  menuToggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  themeToggleBtn: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--color-text-primary)',
    padding: '7px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    flex: 1,
    maxWidth: '1440px',
    width: '100%',
    margin: '0 auto',
    alignItems: 'start'
  },
  sidebar: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backdropFilter: 'blur(20px)',
    boxShadow: 'var(--shadow-md)'
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px'
  },
  sidebarTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    margin: 0,
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)'
  },
  adminProfileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--bg-tertiary)',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)'
  },
  avatarGlow: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-primary), #c084fc)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(138, 43, 226, 0.3)'
  },
  adminName: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'var(--color-text-primary)'
  },
  adminRole: {
    fontSize: '0.75rem',
    color: 'var(--color-text-tertiary)',
    fontFamily: 'var(--font-mono)'
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px 12px 13px',
    borderRadius: '10px',
    background: 'transparent',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: '3px solid transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.2s ease'
  },
  activeNavItem: {
    background: 'rgba(147, 51, 234, 0.12)',
    color: 'var(--color-primary)',
    borderLeft: '3px solid var(--color-primary)',
    fontWeight: 700
  },
  navIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  navBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: 'var(--danger)',
    color: '#fff',
    fontSize: '0.65rem',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  sidebarFooter: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px'
  },
  sidebarBtn: {
    justifyContent: 'flex-start',
    fontSize: '0.85rem',
    padding: '10px 14px',
    borderRadius: '8px',
    gap: '8px'
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 998
  },
  contentArea: {
    flex: 1,
    minWidth: 0
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(138, 43, 226, 0.1)',
    borderTop: '3px solid var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  tabContentTransition: {
    animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  tabSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sectionHeader: {
    textAlign: 'left',
    marginBottom: '8px'
  },
  sectionHeaderWithActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    textAlign: 'left',
    marginBottom: '8px'
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)',
    margin: 0
  },
  sectionSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--color-text-tertiary)',
    margin: '4px 0 0 0'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px'
  },
  statCard: {
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
    boxShadow: 'var(--shadow-sm)'
  },
  statCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statCardLabel: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 700,
    color: 'var(--color-text-secondary)'
  },
  statCardIcon: {
    color: 'var(--color-primary)',
    opacity: 0.8
  },
  statCardValue: {
    fontSize: '2rem',
    fontWeight: 800,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)'
  },
  analyticsDetailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px'
  },
  panelCard: {
    padding: '24px',
    textAlign: 'left'
  },
  panelCardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
    margin: 0
  },
  barChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  chartBarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  chartBarLabel: {
    width: '90px',
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-mono)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chartBarOuter: {
    flex: 1,
    height: '10px',
    background: 'var(--bg-tertiary)',
    borderRadius: '5px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)'
  },
  chartBarInner: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-primary), #c084fc)',
    borderRadius: '5px'
  },
  chartBarValue: {
    width: '60px',
    textAlign: 'right',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)'
  },
  osGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  osRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  osName: {
    width: '90px',
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)'
  },
  osProgressWrapper: {
    flex: 1,
    height: '8px',
    background: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  osProgressBar: {
    height: '100%',
    background: 'var(--color-secondary)',
    borderRadius: '4px'
  },
  osCount: {
    width: '70px',
    textAlign: 'right',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-secondary)'
  },
  filterGroup: {
    display: 'flex',
    gap: '6px',
    background: 'var(--bg-tertiary)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  filterBtn: {
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    borderRadius: '6px',
    background: 'transparent',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeFilterBtn: {
    background: 'var(--color-primary)',
    color: '#fff'
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  emptyStateCard: {
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-tertiary)',
    textAlign: 'center'
  },
  messageCard: {
    padding: '24px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderLeftWidth: '4px !important'
  },
  messageCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  messageMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  categoryBadge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 700
  },
  messageIp: {
    fontSize: '0.75rem',
    color: 'var(--color-text-tertiary)',
    fontFamily: 'var(--font-mono)'
  },
  messageActions: {
    display: 'flex',
    gap: '8px'
  },
  actionIconButton: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  messageSubject: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: 0,
    color: 'var(--color-text-primary)'
  },
  messageSenderInfo: {
    fontSize: '0.8rem',
    color: 'var(--color-text-tertiary)'
  },
  messageDivider: {
    margin: '0 8px',
    color: 'var(--border-color)'
  },
  messageBody: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    background: 'var(--bg-tertiary)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    margin: 0,
    whiteSpace: 'pre-wrap'
  },
  twoColumnLayout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(280px, 0.9fr)',
    gap: '32px',
    alignItems: 'start'
  },
  formContainer: {
    padding: '28px',
    textAlign: 'left'
  },
  formSectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '24px',
    margin: 0,
    fontFamily: 'var(--font-display)'
  },
  dashboardForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left'
  },
  formLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  formInput: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  },
  formSelect: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  formRow3: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  formTextarea: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  formActionRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  cancelFormBtn: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 16px',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  listContainer: {
    textAlign: 'left'
  },
  listSectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
    margin: 0,
    fontFamily: 'var(--font-display)'
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  itemCard: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0
  },
  itemTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'var(--color-text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    fontSize: '0.75rem',
    color: 'var(--color-text-tertiary)'
  },
  itemBadge: {
    background: 'var(--bg-tertiary)',
    padding: '2px 6px',
    borderRadius: '4px',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--border-color)'
  },
  itemActions: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0
  },
  editBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'background 0.2s'
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'background 0.2s'
  },
  colorIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  submissionLinkCard: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    padding: '20px 24px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: 'var(--shadow-sm)'
  },
  submissionLinkIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(168, 85, 247, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  submissionBadge: {
    fontSize: '0.7rem',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: 600,
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  submissionLinkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  submissionLinkBox: {
    flex: 1,
    minWidth: '260px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '10px 14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  submissionLinkText: {
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: '0.85rem',
    color: 'var(--color-text-primary)',
    userSelect: 'all'
  },
  copyLinkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--color-text-primary)',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  copyPromptBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(168, 85, 247, 0.15)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    color: 'var(--color-primary)',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  openFormBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(168, 85, 247, 0.25)',
    border: '1px solid rgba(168, 85, 247, 0.5)',
    color: 'var(--color-primary)',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default AdminDashboard;
