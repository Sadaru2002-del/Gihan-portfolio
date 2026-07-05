import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Gihan Suminda\'s Personal Brand OS v1.0.0.' },
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
        response.push({ type: 'output', text: 'Gihan Suminda - Software Engineering Undergraduate' });
        response.push({ type: 'output', text: 'Current Position: Full Stack Development Intern' });
        response.push({ type: 'output', text: 'Career Goal: Senior Software Engineer' });
        response.push({ type: 'output', text: 'Academic Focus: Software Architecture, AI, HCI, Design Patterns.' });
        break;
      case 'skills':
        response.push({ type: 'output', text: 'Frontend: HTML5, CSS3, JavaScript (ES6+), React.js, Tailwind CSS, Bootstrap' });
        response.push({ type: 'output', text: 'Backend:  Node.js, Express.js' });
        response.push({ type: 'output', text: 'Database: MongoDB, MySQL' });
        response.push({ type: 'output', text: 'Tools:    Git, GitHub, VS Code, Postman, Figma' });
        break;
      case 'projects':
        response.push({ type: 'output', text: 'Featured Work:' });
        response.push({ type: 'output', text: '  1. Lumina Dining Platform - Restaurant digital reservation & billing ecosystem' });
        response.push({ type: 'output', text: '  2. Cognitive Task Grid    - AI task estimation & Agile squad workflow tool' });
        response.push({ type: 'output', text: 'Type "github" to open codebase repositories.' });
        break;
      case 'neofetch':
        response.push({ type: 'output', text: ' gihan@brand-os' });
        response.push({ type: 'output', text: ' -------------' });
        response.push({ type: 'output', text: ' OS:       GihanSumindaOS x86_64' });
        response.push({ type: 'output', text: ' Academic: BSc (Hons) in Software Engineering Undergrad' });
        response.push({ type: 'output', text: ' Shell:    antigravity-sh v3.5' });
        response.push({ type: 'output', text: ' Editor:   VS Code' });
        response.push({ type: 'output', text: ' Dev Stack:React, Node.js, Express, MongoDB' });
        response.push({ type: 'output', text: ' Status:   Available for full-time junior positions / contract work' });
        break;
      case 'contact':
        response.push({ type: 'output', text: 'Reach out through any channels below:' });
        response.push({ type: 'output', text: '  Email:    gihansuminda@gmail.com' });
        response.push({ type: 'output', text: '  GitHub:   github.com/GihanSuminda' });
        response.push({ type: 'output', text: '  LinkedIn: linkedin.com/in/gihan-suminda' });
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
