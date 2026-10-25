import React, { useState } from 'react';
import { BookOpen, GraduationCap, Code, Server, Heart, Compass } from 'lucide-react';

const JourneyTimeline = () => {
  const [activeStep, setActiveStep] = useState(4); // Default to Internship (current step)

  const steps = [
    {
      title: 'Advanced Level (A/L)',
      period: '2021 - 2022',
      icon: BookOpen,
      subtitle: 'Sri Dharmananda Vidyayathana Piriwana, Balangoda',
      description: 'Completed G.C.E. Advanced Level with strong analytical discipline, problem solving, and computational curiosity.',
      skills: ['Problem Solving', 'Analytical Logic', 'Academic Excellence']
    },
    {
      title: 'Undergraduate Degree',
      period: 'Nov 2023 - Present',
      icon: GraduationCap,
      subtitle: 'BSc (Hons) in Software Engineering (4th Year) · Saegis Campus',
      description: 'Fourth Year Undergraduate at Saegis Campus, Nugegoda. Mastered clean code, software development, full-stack web architectures, and usability testing.',
      skills: ['Software Engineering', 'Full-Stack Development', 'Usability Testing', 'Clean Architecture']
    },
    {
      title: 'MERN Mentorship',
      period: 'Apr - May 2026',
      icon: Code,
      subtitle: '1-Month MERN Stack Mentorship · Fuchsius Pvt Ltd, Colombo',
      description: 'Completed rigorous industry mentorship in MERN Stack (MongoDB, Express.js, React.js, Node.js), API integration, and database architecture.',
      skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'API Integration']
    },
    {
      title: 'Industry Internship',
      period: 'Apr 2026 - Present',
      icon: Heart,
      subtitle: 'Full-Stack Developer (Intern) · Fuchsius Pvt Ltd, Colombo',
      description: 'Developing web applications using the MERN Stack. Hands-on experience in frontend/backend engineering, database management, and third-party API integration.',
      skills: ['MERN Stack', 'Frontend Engineering', 'Backend API', 'Database Management', 'Teamwork']
    },
    {
      title: 'Project Portfolio',
      period: '2024 - Present',
      icon: Server,
      subtitle: 'User-Centric Web Applications',
      description: 'Engineered Life Resilience App (AI Coach & Firebase), 3D Portfolio (Three.js & PWA), Lumina Dining (Express & SQLite), Library System Admin Panel, and E-Commerce Clothing Store.',
      skills: ['React', 'Firebase', 'Three.js', 'MongoDB', 'Express', 'SQLite']
    },
    {
      title: 'Future Vision',
      period: 'Career Goal',
      icon: Compass,
      subtitle: 'Undergraduate Software Engineer',
      description: 'Focused on building efficient, scalable, and user-centric solutions. Skilled in clean code, full-stack web development, and delivering seamless digital experiences.',
      skills: ['Scalable Systems', 'User-Centric Design', 'Clean Code', 'Adaptability']
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Interactive Step Timeline Bar */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '12px 0',
          gap: '12px',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          scrollbarWidth: 'none'
        }}
      >
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              style={{
                flex: 1,
                minWidth: '130px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                outline: 'none',
                opacity: isActive ? 1 : 0.5,
                transition: 'all var(--transition-fast)'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isActive ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'var(--bg-secondary)',
                  border: isActive ? 'none' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#fff' : 'var(--color-text-secondary)',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s'
                }}
              >
                <StepIcon size={18} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{step.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>{step.period}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Milestone Display Card */}
      <div
        className="glass-card"
        style={{
          padding: '32px',
          background: 'var(--glass-bg)',
          textAlign: 'left',
          animation: 'fadeIn 0.4s ease-out'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
          <div>
            <span className="caption" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              {steps[activeStep].period}
            </span>
            <h3 className="h3" style={{ margin: '4px 0', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {steps[activeStep].title}
            </h3>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              {steps[activeStep].subtitle}
            </div>
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(var(--color-primary-rgb), 0.1)',
              color: 'var(--color-primary)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            Milestone {activeStep + 1}
          </div>
        </div>

        <p className="body-medium" style={{ marginBottom: '24px', lineHeight: '1.7' }}>
          {steps[activeStep].description}
        </p>

        {/* Skill tag list for active step */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '10px' }}>
            Competencies & Technologies Gained:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {steps[activeStep].skills.map((skill, index) => (
              <span
                key={index}
                className="badge badge-primary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
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

export default JourneyTimeline;
