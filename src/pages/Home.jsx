import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ParticlesBackground from '../components/ParticlesBackground';
import Terminal from '../components/Terminal';
import JourneyTimeline from '../components/JourneyTimeline';
import SkillMatrix from '../components/SkillMatrix';
import ProjectCard from '../components/ProjectCard';
import RecruiterPanel from '../components/RecruiterPanel';
import { ArrowRight, Mail, Phone, MapPin, Send, Github, Linkedin, Star, CheckCircle, Flame, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from '../context/ToastContext';

const Home = () => {
  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Contact form state
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', category: 'General Inquiry', content: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactResponse, setContactResponse] = useState(null);

  // GitHub / Statistics metrics (Simulated live APIs)
  const [stats] = useState({
    commits: 486,
    repositories: 24,
    stars: 42,
    hoursCoded: 1250
  });

  useEffect(() => {
    // Log analytics hit
    api.logPageView('/');

    const fetchData = async () => {
      try {
        const tests = await api.getTestimonials();
        setTestimonials(tests);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.content) {
      toast.warning('Please fill in name, email, and message content.');
      return;
    }

    setContactLoading(true);
    try {
      await api.sendMessage(contactData);
      
      // Burst confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#a855f7', '#6366f1']
      });

      toast.success('Your message has been sent successfully! I will reply shortly.');

      // Show active message status tracking block
      setContactResponse({
        id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Unread / Queue Priority High',
        eta: 'Less than 12 hours',
        date: new Date().toLocaleDateString()
      });

      setContactData({ name: '', email: '', subject: '', category: 'General Inquiry', content: '' });
    } catch (err) {
      toast.error('Error sending message: ' + err.message);
    } finally {
      setContactLoading(false);
    }
  };

  const techStack = [
    { name: 'React', color: '#61DAFB' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Express', color: '#777777' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'MySQL', color: '#4479A1' },
    { name: 'Tailwind CSS', color: '#06B6D4' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'Git & GitHub', color: '#F05032' },
    { name: 'Postman', color: '#FF6C37' },
    { name: 'Figma', color: '#F24E1E' }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      {/* Background Particles mesh */}
      <ParticlesBackground />
      
      {/* Background radial gradient mesh */}
      <div className="gradient-mesh" />

      {/* Hero Section */}
      <header
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 0 80px 0',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'center' }} className="hero-grid">
            
            {/* Left side info */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                <img
                  src="/gihan_avatar.jpg"
                  alt="Gihan Suminda"
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--color-primary)',
                    boxShadow: '0 0 24px rgba(168, 85, 247, 0.45)',
                    flexShrink: 0
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className="badge badge-primary badge-pulse" style={{ fontSize: '0.75rem', padding: '5px 14px', width: 'fit-content' }}>
                    ⚡ Full-Stack Developer (Intern) @ Fuchsius Pvt Ltd
                  </span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    BSc (Hons) in Software Engineering (3rd Year) · Saegis Campus
                  </div>
                </div>
              </div>

              <div>
                <h1 className="display-medium" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  Gihan Suminda <br />
                  <span className="gradient-text">Undergraduate Software Engineer</span>
                </h1>
                
                <p className="body-large" style={{ fontSize: '1.15rem', marginTop: '16px', maxWidth: '580px', lineHeight: '1.7' }}>
                  Passionate software engineer focused on building efficient, scalable, and user-centric solutions. Skilled in clean code, full-stack web development (MERN Stack), and delivering seamless digital experiences.
                </p>
              </div>

              {/* GitHub statistics widgets */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  margin: '12px 0'
                }}
                className="hero-stats-grid"
              >
                {[
                  { label: 'Commits', val: stats.commits, icon: <Flame size={14} style={{ color: '#ec4899' }} /> },
                  { label: 'Repos', val: stats.repositories, icon: <Github size={14} style={{ color: '#a855f7' }} /> },
                  { label: 'Stars', val: stats.stars, icon: <Star size={14} style={{ color: '#f59e0b' }} /> },
                  { label: 'Hours Coded', val: stats.hoursCoded, icon: <CheckCircle size={14} style={{ color: '#10b981' }} /> }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {stat.icon} {stat.label}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{stat.val}+</div>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <button
                  onClick={() => {
                    const el = document.querySelector('#projects');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="premium-btn"
                >
                  Explore Showcase <ArrowRight size={16} />
                </button>
                <a
                  href="/Gihan_Suminda_CV.pdf"
                  download="Gihan_Suminda_CV.pdf"
                  className="secondary-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <Download size={16} /> Download CV
                </a>
                <a
                  href="https://github.com/Sadaru2002-del"
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <Github size={16} /> GitHub Profile
                </a>
                <button
                  onClick={() => {
                    const el = document.querySelector('#recruiter');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="secondary-btn"
                >
                  Recruiter Hub
                </button>
              </div>
            </div>

            {/* Right side: terminal block */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Terminal />
            </div>

          </div>
        </div>
      </header>

      {/* Tech Stack Scrolling Logo Wall (Premium Micro-animation) */}
      <section
        style={{
          padding: '24px 0',
          background: 'rgba(5, 5, 8, 0.6)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden',
          zIndex: 2,
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', width: '200%', gap: '48px', animation: 'scroll-wall 25s linear infinite' }}>
          {Array.from({ length: 2 }).map((_, loopIdx) => (
            <div key={loopIdx} style={{ display: 'flex', justifyContent: 'space-around', width: '100%', gap: '48px' }}>
              {techStack.map((tech, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: tech.color }}></span>
                  {tech.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="caption" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Storytelling Experience</span>
            <h2 className="display-small" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Journey Roadmap</h2>
            <p className="body-medium" style={{ maxWidth: '600px', margin: '8px auto 0 auto' }}>
              An interactive visual map charting academic grounding, self-guided developer milestones, and active internships.
            </p>
          </div>

          <JourneyTimeline />
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" style={{ padding: '100px 0', background: 'rgba(5,5,8,0.3)', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="caption" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>Expertise Grid</span>
            <h2 className="display-small" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Skill Matrix</h2>
            <p className="body-medium" style={{ maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Core technologies, tools, and academic subjects mapped by level, dependency subtrees, and vector coordinates.
            </p>
          </div>

          <SkillMatrix />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="caption" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Showcase</span>
            <h2 className="display-small" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Featured Systems</h2>
            <p className="body-medium" style={{ maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Explore deep dives of verified applications, complete with lines of code, test coverage profiles, and visual system diagrams.
            </p>
          </div>

          <ProjectCard />
        </div>
      </section>

      {/* Recruiter Hub Section */}
      <section id="recruiter" style={{ padding: '100px 0', background: 'rgba(5,5,8,0.3)', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="caption" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Recruiters Hub</span>
            <h2 className="display-small" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Talent Acquisition</h2>
            <p className="body-medium" style={{ maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Instant resume retrieval, overview grids of core developer strengths, and interactive interview organizers.
            </p>
          </div>

          <RecruiterPanel />
        </div>
      </section>

      {/* Testimonials section */}
      {testimonials.length > 0 && (
        <section style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
          <div className="container" style={{ maxWidth: '750px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="caption" style={{ color: 'var(--color-secondary)' }}>Endorsements</span>
              <h2 className="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Team Verification</h2>
            </div>

            {/* Testimonials Carousel */}
            <div className="glass-card" style={{ padding: '40px', background: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.15rem', fontStyle: 'italic', lineHeight: '1.7', color: 'var(--color-text-primary)', marginBottom: '24px' }}>
                "{testimonials[activeTestimonial].content}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                {testimonials[activeTestimonial].avatar && (
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'crop' }}
                  />
                )}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {testimonials[activeTestimonial].position}, {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </div>

              {/* Indicator dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: activeTestimonial === idx ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Center Section */}
      <section id="contact" style={{ padding: '100px 0 160px 0', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="caption" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Communication Hub</span>
            <h2 className="display-small" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Contact Center</h2>
            <p className="body-medium" style={{ maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Need to coordinate collaborations or ask a general query? Submit a message and track its delivery status.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }} className="contact-grid-wrapper">
            
            {/* Left Side: Detail list */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 className="h3" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '12px' }}>
                  Let\'s Start a Conversation
                </h3>
                <p className="body-medium">
                  We look forward to coordinating on codebases, learning pathways, or academic collaborations.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', color: 'var(--color-primary)', justifyContent: 'center' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>EMAIL ADDRESS</div>
                    <a href="mailto:slsadaru2002@gmail.com" style={{ textDecoration: 'none', color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      slsadaru2002@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', color: '#10b981', justifyContent: 'center' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>PHONE NUMBER</div>
                    <a href="tel:+94761708864" style={{ textDecoration: 'none', color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      +94 761708864
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', color: 'var(--color-secondary)', justifyContent: 'center' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>ADDRESS / RESIDENCE</div>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      364/B, Wathukarakanda, Megoda Waleboda, Balangoda, Sri Lanka
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="https://github.com/Sadaru2002-del" target="_blank" rel="noreferrer" className="secondary-btn" style={{ padding: '10px 14px', borderRadius: '8px' }}>
                  <Github size={18} /> GitHub
                </a>
                <a href="https://linkedin.com/in/gihan-suminda-a55330321" target="_blank" rel="noreferrer" className="secondary-btn" style={{ padding: '10px 14px', borderRadius: '8px' }}>
                  <Linkedin size={18} /> LinkedIn
                </a>
              </div>
            </div>

            {/* Right Side: Form & status checker */}
            <div className="glass-card" style={{ padding: '32px', background: 'rgba(255, 255, 255, 0.01)' }}>
              
              {contactResponse ? (
                /* Delivery tracker widget */
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 0' }}>
                  <div style={{ color: 'var(--success)', display: 'flex', justifyContent: 'center' }}>
                    <CheckCircle size={56} />
                  </div>
                  <div>
                    <h4 className="h4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Message Sent Successfully!</h4>
                    <p className="body-small" style={{ marginTop: '4px' }}>Your message has been locked into the dashboard dispatch queue.</p>
                  </div>

                  {/* Delivery statistics details */}
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>TRACKING ID:</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{contactResponse.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>QUEUE STATUS:</span>
                      <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{contactResponse.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>ESTIMATED REPLY:</span>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>{contactResponse.eta}</span>
                    </div>
                  </div>

                  <button onClick={() => setContactResponse(null)} className="secondary-btn" style={{ padding: '8px 16px', fontSize: '0.85rem', alignSelf: 'center' }}>
                    Submit Another Query
                  </button>
                </div>
              ) : (
                /* Standard contact Form */
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="scheduler-split-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        placeholder="Elon Musk"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="elon@spacex.com"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                      placeholder="Collaboration opportunity / Feedback"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Inquiry Category</label>
                    <select
                      value={contactData.category}
                      onChange={(e) => setContactData({ ...contactData, category: e.target.value })}
                      className="form-input"
                      style={{ background: 'rgba(5, 5, 8, 0.9)', color: 'var(--color-text-primary)' }}
                    >
                      <option>General Inquiry</option>
                      <option>Collaboration Request</option>
                      <option>Meeting Request</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Query Content</label>
                    <textarea
                      value={contactData.content}
                      onChange={(e) => setContactData({ ...contactData, content: e.target.value })}
                      placeholder="Write your details here..."
                      className="form-textarea"
                      required
                    />
                  </div>

                  <button type="submit" className="premium-btn" style={{ justifyContent: 'center' }} disabled={contactLoading}>
                    <Send size={16} /> {contactLoading ? 'Sending message...' : 'Send Query Message'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Animation keyframes style */}
      <style>{`
        @keyframes scroll-wall {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1.2fr 0.8fr !important; }
          .contact-grid-wrapper { grid-template-columns: 0.9fr 1.1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .scheduler-split-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
