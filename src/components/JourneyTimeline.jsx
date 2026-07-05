import React, { useState } from 'react';
import { BookOpen, GraduationCap, Code, Server, Heart, Compass } from 'lucide-react';

const JourneyTimeline = () => {
  const [activeStep, setActiveStep] = useState(4); // Default to Internship (current step)

  const steps = [
    {
      title: 'School Grounding',
      period: '2018 - 2020',
      icon: BookOpen,
      subtitle: 'Advanced Level Physical Science',
      description: 'Built a strong foundation in Mathematics, Physics, and analytical logic. Developed a passion for computing and computational algorithms.',
      skills: ['Logic', 'Analytical Thinking', 'Problem Solving']
    },
    {
      title: 'University Admission',
      period: '2021 - Present',
      icon: GraduationCap,
      subtitle: 'BSc (Hons) in Software Engineering Undergrad',
      description: 'Mastered core theories including Software Architecture, Design Patterns, Human Computer Interaction (HCI), Logic Programming, and SQA.',
      skills: ['Software Architecture', 'Design Patterns', 'HCI', 'AI Foundations']
    },
    {
      title: 'Self-Guided Learning',
      period: '2023 - 2024',
      icon: Code,
      subtitle: 'MERN Stack Specialization',
      description: 'Completed boot camps and developed proficiency in React.js, Node.js, Express, MongoDB, and modern layouts using Tailwind CSS/CSS modules.',
      skills: ['React.js', 'Node.js', 'MongoDB', 'Postman', 'Figma']
    },
    {
      title: 'Project Development',
      period: '2024 - 2025',
      icon: Server,
      subtitle: 'Building Enterprise Scaled Apps',
      description: 'Architected booking systems and analytics engines (e.g. Lumina Dining, Cognitive Task Grid) to put structural design patterns into practice.',
      skills: ['REST APIs', 'JWT Security', 'Mongoose Schemas', 'SVG Architecture']
    },
    {
      title: 'Internship Stage',
      period: '2025 - Present',
      icon: Heart,
      subtitle: 'Full Stack Development Intern',
      description: 'Currently working in a professional team environment. Designing database optimizations, implementing security filters, and building dashboards.',
      skills: ['Production Express', 'Query Optimization', 'Team Agile Git', 'Sanitization']
    },
    {
      title: 'Future Roadmap',
      period: '2026+',
      icon: Compass,
      subtitle: 'Senior Software Engineer Goal',
      description: 'Striving to lead large-scale architectural designs, integrate advanced AI workflows into SaaS products, and build cloud-native applications.',
      skills: ['System Design', 'Cloud Architecture (AWS)', 'Kubernetes', 'CI/CD']
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
                  background: isActive ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'rgba(255, 255, 255, 0.05)',
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
          background: 'rgba(255, 255, 255, 0.02)',
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
