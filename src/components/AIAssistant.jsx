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
      reply = 'Gihan is currently a Full Stack Development Intern. In this role, he develops and maintains end-to-end features, builds REST APIs with Express.js, designs database schemas in MongoDB/MySQL, and constructs reactive frontends. He is highly focused on optimization and secure systems.';
    } else if (lowercaseText.includes('backend') || lowercaseText.includes('node') || lowercaseText.includes('express') || lowercaseText.includes('api')) {
      reply = 'For backend services, Gihan leverages Node.js with Express.js. He is experienced in writing modular REST endpoints, integrating JWT auth tokens, applying express-rate-limit protection, and structuring schemas using Mongoose/MySQL.';
    } else if (lowercaseText.includes('project') || lowercaseText.includes('featured') || lowercaseText.includes('lumina') || lowercaseText.includes('showcase')) {
      reply = 'Gihan has completed several impressive projects, notably:\n1. **Lumina Dining Platform**: Restaurant reservation, ordering, and admin analytics control room.\n2. **Cognitive Task Grid**: AI-powered task estimation and sprint manager.\nYou can explore interactive cards, architecture diagrams, and source code links in the **Project Showcase** section above.';
    } else if (lowercaseText.includes('academic') || lowercaseText.includes('course') || lowercaseText.includes('university') || lowercaseText.includes('study') || lowercaseText.includes('subject')) {
      reply = 'Gihan is a Software Engineering Undergraduate. His coursework covers: Human Computer Interaction (HCI), Software Architecture, Design Patterns, Software Quality Assurance (SQA), Software Project Management, Logic Programming, and Artificial Intelligence.';
    } else if (lowercaseText.includes('frontend') || lowercaseText.includes('react') || lowercaseText.includes('css') || lowercaseText.includes('tailwind')) {
      reply = 'On the frontend, Gihan is proficient in HTML5, CSS3, JavaScript (ES6+), React.js, Tailwind CSS, and Bootstrap. He focuses on responsive layouts, fast page loads (Lighthouse scores), and premium transitions.';
    } else if (lowercaseText.includes('contact') || lowercaseText.includes('email') || lowercaseText.includes('schedule') || lowercaseText.includes('interview')) {
      reply = 'You can contact Gihan directly by filling out the form in the **Contact Center** at the bottom of the page, or by using the quick interview request tool inside the **Recruiter Portal** (which instantly drafts an invitation email). You can also email him at gihansuminda@gmail.com.';
    } else if (lowercaseText.includes('skills') || lowercaseText.includes('languages') || lowercaseText.includes('database')) {
      reply = 'Gihan\'s toolbelt includes: React, HTML/CSS, Tailwind, Node.js, Express, MongoDB, MySQL, Git/GitHub, Postman, and Figma. Check out the **Skill Matrix** section above for progress heatmaps and radar charts.';
    } else {
      reply = 'Gihan has trained me to share details about his skills, internship experience, projects, and university coursework. Let me know if you would like me to summarize any of these areas!';
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
