import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Gihan Portfolio OS v1.0.0.' },
    { type: 'output', text: 'Type "help" to see a list of available commands.' },
    { type: 'output', text: '' }
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef(null);

  const commands = {
    help: 'List all available commands.',
    about: 'Display Gihan\'s professional background.',
    skills: 'Show technical skills matrix.',
    projects: 'View details of showcased systems.',
    github: 'Open Gihan\'s GitHub profile in a new tab.',
    neofetch: 'Show developer system specs & ASCII logo.',
    contact: 'Get details to reach out or book meetings.',
    clear: 'Clear terminal screen.'
  };

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    let response = [];

    switch (trimmed) {
      case 'help':
        response.push({ type: 'output', text: 'Available commands:' });
        Object.entries(commands).forEach(([cmd, desc]) => {
          response.push({ type: 'output', text: `  ${cmd.padEnd(12)} - ${desc}` });
        });
        break;
      case 'about':
        response.push({ type: 'output', text: 'Gihan Suminda - Undergraduate Software Engineer' });
        response.push({ type: 'output', text: 'Degree:   BSc (Hons) in Software Engineering (3rd Year) @ Saegis Campus' });
        response.push({ type: 'output', text: 'Role:     Full-Stack Developer (Intern) @ Fuchsius Pvt Ltd, Colombo' });
        response.push({ type: 'output', text: 'Profile:  Building efficient, scalable, and user-centric solutions in clean code & MERN.' });
        break;
      case 'skills':
        response.push({ type: 'output', text: 'Core:      Problem Solving (90%), Programming (85%), Full-Stack (80%), Teamwork (95%)' });
        response.push({ type: 'output', text: 'Frontend:  React.js, JavaScript (ES6+), Three.js, HTML5, CSS3, PWA' });
        response.push({ type: 'output', text: 'Backend:   Node.js, Express.js, MERN Stack, RESTful APIs' });
        response.push({ type: 'output', text: 'Databases: MongoDB, Firebase, SQLite, Supabase' });
        response.push({ type: 'output', text: 'Languages: English (80%), Sinhala (100%)' });
        break;
      case 'projects':
        response.push({ type: 'output', text: 'Gihan\'s Software Projects:' });
        response.push({ type: 'output', text: '  1. Life Resilience App       - Life management app with AI Coach, mood tracking, Firebase' });
        response.push({ type: 'output', text: '  2. 3D Portfolio Website      - 3D graphics (Three.js), i18n, PWA, Recharts' });
        response.push({ type: 'output', text: '  3. Lumina Dining             - Full-stack restaurant platform, RESTful API, SQLite' });
        response.push({ type: 'output', text: '  4. Library System Admin      - Mongoose ODM dashboard, database seeding, REST routes' });
        response.push({ type: 'output', text: '  5. E-Commerce Clothing Store - Online store with admin panel, cart & checkout' });
        break;
      case 'github':
        window.open('https://github.com/Sadaru2002-del', '_blank');
        response.push({ type: 'output', text: 'Opening GitHub profile: https://github.com/Sadaru2002-del' });
        break;
      case 'neofetch':
        response.push({ type: 'output', text: ' gihan@brand-os' });
        response.push({ type: 'output', text: ' -------------' });
        response.push({ type: 'output', text: ' OS:       GihanSumindaOS x86_64' });
        response.push({ type: 'output', text: ' Academic: Saegis Campus - BSc (Hons) Software Engineering (3rd Year)' });
        response.push({ type: 'output', text: ' Intern:   Fuchsius Pvt Ltd, Colombo' });
        response.push({ type: 'output', text: ' Dev Stack:MongoDB, Express.js, React.js, Node.js (MERN)' });
        response.push({ type: 'output', text: ' GitHub:   github.com/Sadaru2002-del' });
        response.push({ type: 'output', text: ' Status:   Undergraduate Software Engineer' });
        break;
      case 'contact':
        response.push({ type: 'output', text: 'Reach out through any channels below:' });
        response.push({ type: 'output', text: '  Email:    slsadaru2002@gmail.com' });
        response.push({ type: 'output', text: '  Phone:    +94 761708864' });
        response.push({ type: 'output', text: '  Address:  364/B, Wathukarakanda, Megoda Waleboda, Balangoda' });
        response.push({ type: 'output', text: '  LinkedIn: https://linkedin.com/in/gihan-suminda-a55330321' });
        response.push({ type: 'output', text: '  GitHub:   https://github.com/Sadaru2002-del' });
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        response.push({ type: 'output', text: `Command not found: "${cmdText}". Type "help" for a list of command tags.` });
    }

    setHistory((prev) => [
      ...prev,
      { type: 'input', text: cmdText },
      ...response,
      { type: 'output', text: '' }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div
      className="glass-card"
      style={{
        width: '100%',
        maxWidth: '750px',
        margin: '0 auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Terminal Titlebar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
        <span style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          gihan-suminda-brand-os -- bash
        </span>
      </div>

      {/* Terminal Window Content */}
      <div
        style={{
          height: '320px',
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'rgba(5, 5, 8, 0.9)',
          color: '#10B981',
          textAlign: 'left'
        }}
      >
        {history.map((line, index) => (
          <div key={index}>
            {line.type === 'input' ? (
              <div>
                <span style={{ color: '#a855f7' }}>guest@gihan-portfolio</span>
                <span style={{ color: '#fff' }}>:</span>
                <span style={{ color: '#6366f1' }}>~$</span>
                <span style={{ color: '#f8fafc', marginLeft: '6px' }}>{line.text}</span>
              </div>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{line.text}</pre>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(5, 5, 8, 0.95)',
          padding: '8px 16px',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <span style={{ color: '#a855f7' }}>guest@gihan-portfolio</span>
        <span style={{ color: '#fff' }}>:</span>
        <span style={{ color: '#6366f1' }}>~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            marginLeft: '8px'
          }}
          autoComplete="off"
          placeholder="type command..."
        />
      </form>
    </div>
  );
};

export default Terminal;
