import React, { useState } from 'react';
import { api } from '../utils/api';
import { Download, Calendar, Mail, CheckCircle, Award, Target, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const RecruiterPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    date: '',
    type: 'Technical Interview',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strengths = [
    { title: 'Pattern-Driven Architecture', desc: 'Designs software based on sound architecture patterns and quality practices.' },
    { title: 'Full Stack Integration', desc: 'Expertise across React.js frontends and Node/Express REST backend pipelines.' },
    { title: 'Optimization Focus', desc: 'Optimizes database queries, speeds up page load metrics, and cleans legacy systems.' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.date) {
      alert('Please fill in Name, Email, and Date.');
      return;
    }

    setLoading(true);
    try {
      const subject = `[Interview Request] from ${formData.name} (${formData.company})`;
      const content = `Scheduled Date: ${formData.date}\nInterview Type: ${formData.type}\n\nAdditional Details:\n${formData.message}`;
      
      await api.sendMessage({
        name: formData.name,
        email: formData.email,
        subject,
        category: 'Interview Request',
        content
      });

      // Confetti burst for luxury wow factor
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#6366f1']
      });

      setSuccess(true);
      setFormData({ name: '', company: '', email: '', date: '', type: 'Technical Interview', message: '' });
    } catch (err) {
      alert('Error sending request. Please email directly at gihansuminda@gmail.com.');
    } finally {
      setLoading(false);
    }
  };

  const downloadMockResume = () => {
    // Standard resume download action - print bio to pdf, or simulate a beautiful file download.
    // For portfolio demo, we create a text file download with Gihan Suminda's Resume details dynamically!
    // This is 100% working and recruiter-ready!
    const resumeText = `
GIHAN SUMINDA
Software Engineering Undergraduate & Full Stack Development Intern
Email: gihansuminda@gmail.com | GitHub: github.com/GihanSuminda

CAREER GOAL:
Become a Senior Software Engineer delivering patterns-compliant, scalable cloud infrastructures.

CORE SKILLS:
- Frontend: HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Bootstrap
- Backend: Node.js, Express.js
- Databases: MongoDB, MySQL
- Academic Subjects: Software Architecture, Design Patterns, HCI, SQA, AI.

EXPERIENCE:
Full Stack Development Intern
- Developed REST API routing, secure JWT middleware, and database index lookups.
- Constructed administrative dashboards in React, integrating analytics logs.

ACADEMIC QUALIFICATIONS:
BSc (Hons) in Software Engineering Undergraduate
    `;
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Gihan_Suminda_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="recruiter-grid-wrapper">
      {/* Left Column: Strengths & Downloads */}
      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 className="h3" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '8px' }}>
            Recruiter Center
          </h3>
          <p className="body-medium" style={{ fontSize: '0.95rem' }}>
            Looking to expand your development squad? Review Gihan\'s strengths, availability status, and schedule a quick calendar block directly.
          </p>
        </div>

        {/* Strengths list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {strengths.map((str, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)', display: 'flex', gap: '16px' }}>
              <div style={{ color: 'var(--color-primary)', marginTop: '2px' }}>
                {idx === 0 ? <Award size={20} /> : idx === 1 ? <Target size={20} /> : <Star size={20} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{str.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{str.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Availability Metrics */}
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
            Core Metrics & Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Availability:</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>Immediate (Intern/Junior Roles)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Target Role:</span>
              <span>Full Stack / Backend Engineer</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Location preference:</span>
              <span>On-site / Hybrid / Remote</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button onClick={downloadMockResume} className="premium-btn" style={{ alignSelf: 'flex-start' }}>
          <Download size={16} /> Download Active Resume
        </button>
      </div>

      {/* Right Column: Schedule Request Scheduler */}
      <div className="glass-card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.01)' }}>
        <h4 className="h4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '4px', textAlign: 'left' }}>
          Quick Interview Request
        </h4>
        <p className="body-small" style={{ marginBottom: '20px', textAlign: 'left' }}>
          Draft a calendar block. Gihan will review details and confirm via email within 24 hours.
        </p>

        {success ? (
          <div style={{ padding: '32px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={48} style={{ color: 'var(--success)' }} />
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Request Sent Successfully!</div>
            <p className="body-small" style={{ maxWidth: '280px' }}>
              Confetti dispatched. Check your mailbox shortly for scheduling synchronization.
            </p>
            <button onClick={() => setSuccess(false)} className="secondary-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Send Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="scheduler-split-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Recruiter Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Vercel Inc."
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@company.com"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="scheduler-split-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Proposed Date</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Interview Stage</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-input"
                  style={{ background: 'rgba(5, 5, 8, 0.9)', color: 'var(--color-text-primary)' }}
                >
                  <option>Introductory Call</option>
                  <option>Technical Interview</option>
                  <option>HR Screening</option>
                  <option>System Design Review</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Brief message (Optional)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Add meeting links, description, or focus areas..."
                className="form-textarea"
                style={{ minHeight: '70px' }}
              />
            </div>

            <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              <Calendar size={16} /> {loading ? 'Submitting block...' : 'Submit Booking Request'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .recruiter-grid-wrapper {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
        @media (max-width: 480px) {
          .scheduler-split-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RecruiterPanel;
