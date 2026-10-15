import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Search, Github, ExternalLink, Activity, ShieldAlert } from 'lucide-react';

const ProjectCard = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', 'Web App', 'AI / ML', 'System Utility', 'Open Source'];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
                          project.description.toLowerCase().includes(search.toLowerCase()) ||
                          project.technologies.some(tech => tech.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'All' || project.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        className="project-filters-row"
      >
        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or tech stack..."
            className="form-input"
            style={{ width: '100%', paddingLeft: '44px', background: 'rgba(255, 255, 255, 0.02)' }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setCategory(cat)}
              className={category === cat ? 'premium-btn' : 'secondary-btn'}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                transform: 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Showcase */}
      <div className="grid-2">
        {loading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} style={{ height: '280px', width: '100%' }} className="skeleton" />
          ))
        ) : filteredProjects.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '48px', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
            No projects found matching the specified terms.
          </div>
        ) : (
          filteredProjects.map((project, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}
            >
              <div>
                {/* Header card badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge badge-primary">{project.category}</span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-secondary)' }}>
                        <Github size={18} />
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-secondary)' }}>
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="h3" style={{ marginBottom: '8px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {project.title}
                </h3>
                {project.imageUrl && (
                  <div style={{ marginBottom: '14px', borderRadius: '10px', overflow: 'hidden', maxHeight: '180px', border: '1px solid var(--border-color)' }}>
                    <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  </div>
                )}
                <p className="body-medium" style={{ fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.6' }}>
                  {project.description}
                </p>

                {/* Tech tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {project.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics Footer and Detail Button */}
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={12} style={{ color: 'var(--color-primary)' }} />
                    LOC: {project.codeMetrics?.linesOfCode?.toLocaleString() || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={12} style={{ color: 'var(--color-secondary)' }} />
                    Coverage: {project.codeMetrics?.testCoverage || 0}%
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Deep Dive Case Study →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Case Study Deep Dive Modal Overlay */}
      {selectedProject && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 5, 8, 0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              textAlign: 'left'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="badge badge-primary">{selectedProject.category}</span>
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <h2 className="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '8px' }}>
              {selectedProject.title}
            </h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {selectedProject.githubLink && (
                <a href={selectedProject.githubLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Github size={14} /> Repository
                </a>
              )}
              {selectedProject.liveLink && (
                <a href={selectedProject.liveLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>

            {selectedProject.imageUrl && (
              <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', maxHeight: '320px', border: '1px solid var(--border-color)' }}>
                <img src={selectedProject.imageUrl} alt={selectedProject.title} style={{ width: '100%', height: 'auto', maxHeight: '320px', objectFit: 'cover' }} />
              </div>
            )}

            {/* Metrics Panel */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}
              className="modal-metrics"
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>LINES OF CODE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {selectedProject.codeMetrics?.linesOfCode?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>TEST COVERAGE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {selectedProject.codeMetrics?.testCoverage || 0}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>LIGHTHOUSE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
                  {selectedProject.performanceMetrics?.lighthouseScore || 100}/100
                </div>
              </div>
            </div>

            {/* Description */}
            <h4 className="h4" style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Project Narrative</h4>
            <p className="body-medium" style={{ marginBottom: '24px', lineHeight: '1.7' }}>
              {selectedProject.longDescription || selectedProject.description}
            </p>

            {/* Architecture diagram visualization */}
            {selectedProject.architectureDiagram && (
              <div style={{ marginBottom: '24px' }}>
                <h4 className="h4" style={{ fontFamily: 'var(--font-display)', marginBottom: '12px' }}>System Architecture</h4>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '16px',
                    overflow: 'hidden'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedProject.architectureDiagram }}
                />
              </div>
            )}

            {/* Tech Stack list */}
            <div>
              <h4 className="h4" style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Key Technologies & Packages</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProject.technologies.map((tech, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .project-filters-row {
            flex-direction: column !important;
            align-items: center !important;
          }
          .modal-metrics {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;
