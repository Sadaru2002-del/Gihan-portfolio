import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! I am Gihan\'s AI Assistant. I can help answer questions about his skills, experience, academic coursework, and project work. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const quickQuestions = [
    'Tell me about Gihan\'s internship.',
    'What are Gihan\'s backend skills?',
    'What projects has he completed?',
    'What academic courses has he completed?'
  ];

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);

    const lowercaseText = textToSend.toLowerCase();
    let reply = '';

    // Advanced token matching engine
    if (lowercaseText.includes('intern') || lowercaseText.includes('work') || lowercaseText.includes('experience') || lowercaseText.includes('position')) {
      reply = 'Gihan is currently a Full-Stack Developer (Intern) at Fuchsius Pvt Ltd, Colombo (Apr 2026 - Present). He develops web applications using the MERN Stack (MongoDB, Express.js, React.js, Node.js), with hands-on expertise in frontend/backend development, database management, and API integration. He also completed an intensive 1-Month MERN Stack Mentorship at Fuchsius Pvt Ltd.';
    } else if (lowercaseText.includes('backend') || lowercaseText.includes('node') || lowercaseText.includes('express') || lowercaseText.includes('api')) {
      reply = 'For backend systems, Gihan specializes in Node.js and Express.js with the MERN Stack. He builds RESTful APIs, designs Mongoose ODM schemas, performs database seeding, and implements secure database access with MongoDB, SQLite, and Supabase.';
    } else if (lowercaseText.includes('project') || lowercaseText.includes('featured') || lowercaseText.includes('showcase')) {
      reply = 'Gihan\'s key projects include:\n1. **Life Resilience App**: Life management app with AI Coach, mood tracking, money management, and Firebase authentication.\n2. **3D Portfolio Website**: Interactive 3D graphics (Three.js), i18n, Firebase backend, Recharts, and PWA capabilities.\n3. **Lumina Dining — Restaurant App**: Full-stack restaurant platform with RESTful API, SQLite, and glassmorphism UI.\n4. **Library System Admin Panel**: Mongoose ODM dashboard, database seeding, and REST API routes.\n5. **E-Commerce Clothing Store**: Full store with cart, checkout, wishlist, and admin control panel.';
    } else if (lowercaseText.includes('academic') || lowercaseText.includes('course') || lowercaseText.includes('university') || lowercaseText.includes('study') || lowercaseText.includes('education') || lowercaseText.includes('campus')) {
      reply = 'Gihan is currently studying for his BSc (Hons) in Software Engineering at Saegis Campus, Nugegoda (3rd Year, Nov 2023 - Present). Prior to this, he completed his G.C.E. Advanced Level at Sri Dharmananda Vidyayathana Piriwana, Balangoda (2021 - 2022).';
    } else if (lowercaseText.includes('frontend') || lowercaseText.includes('react') || lowercaseText.includes('three') || lowercaseText.includes('css')) {
      reply = 'On the frontend, Gihan is proficient in React.js, JavaScript (ES6+), HTML5, CSS3, Three.js (3D graphics), Progressive Web Apps (PWA), and responsive UI design with clean code and high usability.';
    } else if (lowercaseText.includes('contact') || lowercaseText.includes('email') || lowercaseText.includes('phone') || lowercaseText.includes('schedule') || lowercaseText.includes('interview')) {
      reply = 'You can reach Gihan directly at:\n- **Email**: slsadaru2002@gmail.com\n- **Phone**: +94 761708864\n- **Address**: 364/B, Wathukarakanda, Megoda Waleboda, Balangoda\n- **LinkedIn**: linkedin.com/in/gihan-suminda-a55330321\nYou can also use the Contact Form or Recruiter Portal on this page.';
    } else if (lowercaseText.includes('skills') || lowercaseText.includes('languages') || lowercaseText.includes('database')) {
      reply = 'Gihan\'s core skills from his resume include: Problem Solving (90%), Programming (85%), Full-Stack Development (80%), Teamwork (95%), Communication (95%), and Usability Testing (75%). Technologies: React.js, Node.js, Express.js, MongoDB, Firebase, Three.js, SQLite, HTML/CSS, and Git/GitHub.';
    } else {
      reply = 'I am Gihan\'s AI Assistant. I can tell you all about his MERN Stack development at Fuchsius Pvt Ltd, his BSc in Software Engineering at Saegis Campus, his 5 featured software projects, or his contact information. How can I help?';
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSend(input);
    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="premium-btn"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          className="glass-card"
          style={{
            width: '360px',
            height: '480px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(var(--color-primary-rgb), 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Gihan\'s AI Assistant</div>
                <div style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                  Agent Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '14px',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'var(--bg-tertiary)',
                    color: msg.sender === 'user' ? '#fff' : 'var(--color-text-primary)',
                    borderBottomRightRadius: msg.sender === 'user' ? '2px' : '14px',
                    borderBottomLeftRadius: msg.sender === 'user' ? '14px' : '2px',
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions suggestion panel */}
          {messages.length === 1 && (
            <div style={{ padding: '0 16px 8px 16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something about Gihan..."
              style={{
                flex: 1,
                background: 'rgba(var(--bg-tertiary), 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--color-text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                border: 'none',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
