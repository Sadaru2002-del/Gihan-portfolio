import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Search, Calendar, Clock, ThumbsUp, ArrowLeft, Send, MessageSquare } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    // Log analytics hit
    api.logPageView('/blog');
    
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id, e) => {
    e.stopPropagation();
    try {
      const data = await api.likeBlog(id);
      
      // Update in local state
      setBlogs(prev => prev.map(blog => blog._id === id ? { ...blog, likes: data.likes } : blog));
      if (selectedBlog && selectedBlog._id === id) {
        setSelectedBlog(prev => ({ ...prev, likes: data.likes }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.content) {
      alert('Please fill in all fields.');
      return;
    }

    setCommentLoading(true);
    try {
      const newComment = await api.addComment(selectedBlog._id, commentForm);
      
      // Update local state
      const updatedComments = [...(selectedBlog.comments || []), newComment];
      setSelectedBlog(prev => ({ ...prev, comments: updatedComments }));
      setBlogs(prev => prev.map(b => b._id === selectedBlog._id ? { ...b, comments: updatedComments } : b));
      
      setCommentForm({ name: '', email: '', content: '' });
    } catch (err) {
      alert('Error saving comment: ' + err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  // Simple Markdown Parsing Renderer for Gihan Suminda's Blog Articles
  const renderMarkdown = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="h4" style={{ fontFamily: 'var(--font-display)', margin: '20px 0 10px 0', color: 'var(--color-primary)' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} style={{ fontSize: '1.1rem', margin: '16px 0 8px 0', fontFamily: 'var(--font-display)', color: 'var(--color-secondary)', fontWeight: 600 }}>{line.replace('#### ', '')}</h5>;
      }
      
      // Code blocks
      if (line.startsWith('```')) {
        return null; // Ignore fencing tokens for simple code render
      }

      // Inline code highlights
      if (line.includes('`')) {
        const parts = line.split('`');
        return (
          <p key={idx} className="body-medium" style={{ margin: '8px 0 16px 0', lineHeight: '1.7' }}>
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <code key={pIdx} className="code-text">{part}</code> : part)}
          </p>
        );
      }

      // Standard list items
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
        return (
          <div key={idx} style={{ marginLeft: '16px', margin: '6px 0', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{line.split('. ')[0]}.</span>
            <p className="body-medium" style={{ margin: 0 }}>{line.substring(line.indexOf('. ') + 2)}</p>
          </div>
        );
      }

      // Paragraph spacing
      return line.trim() ? (
        <p key={idx} className="body-medium" style={{ margin: '8px 0 16px 0', lineHeight: '1.7' }}>{line}</p>
      ) : <div key={idx} style={{ height: '12px' }} />;
    });
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                          blog.summary.toLowerCase().includes(search.toLowerCase()) ||
                          blog.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch && blog.status === 'Published';
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px', position: 'relative', zIndex: 2 }}>
      {/* Mesh and layout matching standard home styles */}
      <div className="gradient-mesh" />

      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Render Blog Article Detail Screen */}
        {selectedBlog ? (
          <div style={{ textAlign: 'left', animation: 'fadeIn 0.3s ease-out' }}>
            
            {/* Back button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="secondary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                borderRadius: '8px',
                marginBottom: '32px'
              }}
            >
              <ArrowLeft size={16} /> Back to publishing list
            </button>

            {/* Header info */}
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>{selectedBlog.category}</span>
              <h1 className="h1" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: '1.2', marginBottom: '16px' }}>
                {selectedBlog.title}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {new Date(selectedBlog.publishedAt || selectedBlog.createdAt).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> {selectedBlog.readingTime || '5 min read'}
                </span>
                <button
                  onClick={(e) => handleLike(selectedBlog._id, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    padding: 0
                  }}
                >
                  <ThumbsUp size={14} /> {selectedBlog.likes || 0} Likes
                </button>
              </div>
            </div>

            {/* Markdown Content Section */}
            <article style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '32px', marginBottom: '32px' }}>
              {renderMarkdown(selectedBlog.content)}
            </article>

            {/* Tag List */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
              {selectedBlog.tags.map((tag, idx) => (
                <span key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="h3" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={20} /> Comments ({selectedBlog.comments?.length || 0})
              </h3>

              {/* Comment log list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {!selectedBlog.comments || selectedBlog.comments.length === 0 ? (
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>No comments posted yet. Be the first to share your thoughts!</div>
                ) : (
                  selectedBlog.comments.map((comm, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{comm.name}</span>
                        <span style={{ color: 'var(--color-text-tertiary)' }}>{new Date(comm.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="body-medium" style={{ fontSize: '0.9rem' }}>{comm.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Comment form */}
              <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)' }}>
                <h4 className="h4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '16px' }}>Leave a Comment</h4>
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="text"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                        placeholder="Full Name"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                        placeholder="Email Address"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <textarea
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                      placeholder="Share your thoughts or technical queries..."
                      className="form-textarea"
                      style={{ minHeight: '80px' }}
                      required
                    />
                  </div>
                  <button type="submit" className="premium-btn" style={{ alignSelf: 'flex-start' }} disabled={commentLoading}>
                    <Send size={14} /> {commentLoading ? 'Submitting comment...' : 'Post Comment'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* Render Main Blog Article List */
          <div style={{ textAlign: 'left', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="caption" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Technical Logbooks</span>
              <h1 className="display-small" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Publishing Hub</h1>
              <p className="body-medium" style={{ maxWidth: '600px', margin: '8px auto 0 auto' }}>
                Deep dives on backend REST security architectures, query indexing lookups, UI accessibility design guidelines, and HCI patterns.
              </p>
            </div>

            {/* Search inputs */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', margin: '0 auto 36px auto' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title, keywords, or tags..."
                className="form-input"
                style={{ width: '100%', paddingLeft: '44px', background: 'rgba(255, 255, 255, 0.02)' }}
              />
            </div>

            {/* List entries grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {loading ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} style={{ height: '180px', width: '100%' }} className="skeleton" />
                ))
              ) : filteredBlogs.length === 0 ? (
                <div style={{ padding: '48px', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                  No articles found matching the query.
                </div>
              ) : (
                filteredBlogs.map((blog, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    onClick={() => setSelectedBlog(blog)}
                    style={{
                      padding: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-primary">{blog.category}</span>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {blog.readingTime || '5 min read'}</span>
                      </div>
                    </div>

                    <h3 className="h3" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: '4px 0 0 0' }}>
                      {blog.title}
                    </h3>
                    <p className="body-medium" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {blog.summary}
                    </p>

                    {/* Footer tools */}
                    <div
                      style={{
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '14px',
                        marginTop: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {blog.tags.map((tag, tIdx) => (
                          <span key={tIdx} style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => handleLike(blog._id, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          padding: '4px'
                        }}
                      >
                        <ThumbsUp size={14} style={{ color: 'var(--color-primary)' }} /> {blog.likes || 0}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Blog;
