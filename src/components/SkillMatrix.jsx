import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Layers, Cpu, Server, Database, Code } from 'lucide-react';

const SkillMatrix = () => {
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.getSkills();
        setSkills(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'Academic Subject'];

  // Group icons dynamically
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Frontend': return <Code size={16} />;
      case 'Backend': return <Server size={16} />;
      case 'Database': return <Database size={16} />;
      case 'Academic Subject': return <Layers size={16} />;
      default: return <Cpu size={16} />;
    }
  };

  const filteredSkills = filter === 'All' 
    ? skills 
    : skills.filter(s => s.category === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Dynamic Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'premium-btn' : 'secondary-btn'}
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              borderRadius: '8px',
              boxShadow: filter === cat ? 'var(--shadow-sm)' : 'none',
              transform: 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="skills-grid-wrapper">
        {/* Left Side: Skills progress bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} style={{ height: '56px', width: '100%' }} className="skeleton" />
            ))
          ) : (
            filteredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '16px 20px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: skill.color || 'var(--color-primary)' }}>
                      {getCategoryIcon(skill.category)}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{skill.name}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>{skill.level}%</span>
                </div>

                {/* Meter container */}
                <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${skill.level}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, var(--color-primary), ${skill.color || 'var(--color-secondary)'})`,
                      borderRadius: '3px',
                      transition: 'width 1s ease-out'
                    }}
                  />
                </div>

                {/* Subtag nodes */}
                {skill.relationshipTree && skill.relationshipTree.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {skill.relationshipTree.map((rel, rIdx) => (
                      <span key={rIdx} style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        ↳ {rel}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Side: Radar Chart Visualization */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="glass-card"
            style={{
              padding: '24px',
              background: 'var(--glass-bg)',
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <h4 className="h4" style={{ marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Expertise Radar</h4>
            
            {/* SVG Radar */}
            <svg viewBox="0 0 400 320" style={{ width: '100%', height: 'auto', maxWidth: '360px' }}>
              {/* Concentric grid lines */}
              <polygon className="radar-grid" points="200,60 310,120 280,240 120,240 90,120" fill="none" stroke="var(--border-color)" strokeWidth="1" />
              <polygon className="radar-grid" points="200,100 275,145 250,215 150,215 125,145" fill="none" stroke="var(--border-color)" strokeWidth="1" />
              <polygon className="radar-grid" points="200,130 240,160 225,200 175,200 160,160" fill="none" stroke="var(--border-color)" strokeWidth="1" />
              
              {/* Axes */}
              <line className="radar-axis" x1="200" y1="160" x2="200" y2="30" stroke="var(--border-color)" />
              <line className="radar-axis" x1="200" y1="160" x2="345" y2="115" stroke="var(--border-color)" />
              <line className="radar-axis" x1="200" y1="160" x2="310" y2="265" stroke="var(--border-color)" />
              <line className="radar-axis" x1="200" y1="160" x2="90" y2="265" stroke="var(--border-color)" />
              <line className="radar-axis" x1="200" y1="160" x2="55" y2="115" stroke="var(--border-color)" />

              {/* Data Area Plotting */}
              {/* Map levels to scaled offsets: center (200,160). Outer point calculations: */}
              {/* Frontend(90) -> scaled along axis (200,30). X=200, Y=160 - (130 * 0.90) = 43 */}
              {/* Backend(85) -> scaled along axis (345,115). dx=145, dy=-45. X=200 + 145*0.85 = 323, Y=160 - 45*0.85 = 121 */}
              {/* Databases(80) -> scaled along (310,265). dx=110, dy=105. X=200 + 110*0.8 = 288, Y=160 + 105*0.8 = 244 */}
              {/* Tools(85) -> scaled along (90,265). dx=-110, dy=105. X=200 - 110*0.85 = 106, Y=160 + 105*0.85 = 249 */}
              {/* Academic(82) -> scaled along (55,115). dx=-145, dy=-45. X=200 - 145*0.82 = 81, Y=160 - 45*0.82 = 123 */}
              <polygon
                points="200,43 323,121 288,244 106,249 81,123"
                fill="rgba(168, 85, 247, 0.15)"
                stroke="var(--color-primary)"
                strokeWidth="2"
              />

              {/* Data Points */}
              <circle cx="200" cy="43" r="4" fill="var(--color-secondary)" />
              <circle cx="323" cy="121" r="4" fill="var(--color-secondary)" />
              <circle cx="288" cy="244" r="4" fill="var(--color-secondary)" />
              <circle cx="106" cy="249" r="4" fill="var(--color-secondary)" />
              <circle cx="81" cy="123" r="4" fill="var(--color-secondary)" />

              {/* Axis Labels */}
              <text x="200" y="20" fill="var(--color-text-primary)" fontSize="9" textAnchor="middle" fontWeight="bold">FRONTEND (90%)</text>
              <text x="350" y="115" fill="var(--color-text-primary)" fontSize="9" textAnchor="start" fontWeight="bold">BACKEND (85%)</text>
              <text x="320" y="280" fill="var(--color-text-primary)" fontSize="9" textAnchor="start" fontWeight="bold">DATABASES (80%)</text>
              <text x="80" y="280" fill="var(--color-text-primary)" fontSize="9" textAnchor="end" fontWeight="bold">TOOLS (85%)</text>
              <text x="50" y="115" fill="var(--color-text-primary)" fontSize="9" textAnchor="end" fontWeight="bold">ACADEMIC (82%)</text>
            </svg>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '8px', display: 'flex', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></span>
                Core Competence
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--color-secondary)', borderRadius: '50%' }}></span>
                Verification Node
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .skills-grid-wrapper {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillMatrix;
