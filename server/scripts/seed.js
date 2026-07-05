import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, dbMode } from '../config/db.js';
import { Users, Projects, Blogs, Skills, Certificates, Testimonials, SettingsStore } from '../models/dbStore.js';

dotenv.config();

const seedData = async () => {
  console.log('🌱 Starting database seeding...');
  
  // Ensure database initialization
  await connectDB();

  try {
    // 1. Seed Admin User
    const adminEmail = 'thanivunum@gmail.com';
    const existingAdmin = await Users.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('20021217@', salt);
      await Users.create({
        name: 'Portfolio Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
        bio: 'Portfolio Administrator'
      });
      console.log('✅ Admin user created: thanivunum@gmail.com / 20021217@');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Seed Skills Matrix
    const skillsList = [
      // Frontend
      { name: 'HTML5 & CSS3', category: 'Frontend', level: 90, icon: 'Html5', color: '#E34F26', relationshipTree: ['CSSGrid', 'Flexbox'], learningProgress: 100 },
      { name: 'JavaScript (ES6+)', category: 'Frontend', level: 88, icon: 'Cpu', color: '#F7DF1E', relationshipTree: ['React', 'Node.js'], learningProgress: 100 },
      { name: 'React.js', category: 'Frontend', level: 85, icon: 'React', color: '#61DAFB', relationshipTree: ['Tailwind CSS', 'Express.js'], learningProgress: 100 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 85, icon: 'Wind', color: '#06B6D4', relationshipTree: ['React.js'], learningProgress: 100 },
      { name: 'Bootstrap', category: 'Frontend', level: 80, icon: 'Layout', color: '#7952B3', relationshipTree: ['HTML5 & CSS3'], learningProgress: 100 },
      
      // Backend
      { name: 'Node.js', category: 'Backend', level: 82, icon: 'Terminal', color: '#339933', relationshipTree: ['Express.js', 'MongoDB'], learningProgress: 100 },
      { name: 'Express.js', category: 'Backend', level: 85, icon: 'Server', color: '#000000', relationshipTree: ['Node.js', 'JWT Auth'], learningProgress: 100 },
      
      // Databases
      { name: 'MongoDB', category: 'Database', level: 80, icon: 'Database', color: '#47A248', relationshipTree: ['Node.js', 'Mongoose'], learningProgress: 100 },
      { name: 'MySQL', category: 'Database', level: 78, icon: 'Database', color: '#4479A1', relationshipTree: ['Express.js'], learningProgress: 100 },
      
      // Tools
      { name: 'Git & GitHub', category: 'Tools', level: 85, icon: 'GitBranch', color: '#F05032', relationshipTree: ['VS Code'], learningProgress: 100 },
      { name: 'VS Code', category: 'Tools', level: 90, icon: 'Code', color: '#007ACC', relationshipTree: [], learningProgress: 100 },
      { name: 'Postman', category: 'Tools', level: 80, icon: 'Shield', color: '#FF6C37', relationshipTree: ['Express.js'], learningProgress: 100 },
      { name: 'Figma', category: 'Tools', level: 75, icon: 'Figma', color: '#F24E1E', relationshipTree: ['React.js'], learningProgress: 100 },
      
      // Academic
      { name: 'Software Architecture', category: 'Academic Subject', level: 80, icon: 'Layers', color: '#9333EA', relationshipTree: ['Design Patterns'], learningProgress: 95 },
      { name: 'Design Patterns', category: 'Academic Subject', level: 82, icon: 'Grid', color: '#3B82F6', relationshipTree: ['Software Architecture'], learningProgress: 95 },
      { name: 'Human Computer Interaction', category: 'Academic Subject', level: 85, icon: 'Users', color: '#EC4899', relationshipTree: ['Figma'], learningProgress: 98 },
      { name: 'Artificial Intelligence', category: 'Academic Subject', level: 75, icon: 'Cpu', color: '#10B981', relationshipTree: ['Logic Programming'], learningProgress: 88 },
      { name: 'Software Quality Assurance', category: 'Academic Subject', level: 80, icon: 'CheckCircle', color: '#EF4444', relationshipTree: [], learningProgress: 92 }
    ];

    const currentSkills = await Skills.find();
    if (currentSkills.length === 0) {
      for (const skill of skillsList) {
        await Skills.create(skill);
      }
      console.log(`✅ Seeded ${skillsList.length} skills successfully.`);
    }

    // 3. Seed Projects
    const projectsList = [
      {
        title: 'Lumina Dining Platform',
        description: 'Advanced restaurant booking and digital ordering system with multi-role dashboards.',
        longDescription: 'A comprehensive digital system built for restaurants to manage online reservations, visual menus, dynamic orders, and customer billing. Implements secure JWT authentication, detailed logs, dynamic role dashboard widgets, and complex aggregation analytics for restaurant owners.',
        category: 'Web App',
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
        githubLink: 'https://github.com/GihanSuminda/Lumina-Dining',
        liveLink: 'https://lumina-dining.demo.gihan.dev',
        status: 'Completed',
        featured: true,
        codeMetrics: { linesOfCode: 15400, testCoverage: 92 },
        performanceMetrics: { lighthouseScore: 98, loadTimeMs: 420 },
        architectureDiagram: `<svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect width="800" height="200" rx="12" fill="#0b0b12" stroke="rgba(255,255,255,0.05)"/>
          <!-- Clients -->
          <rect x="50" y="70" width="120" height="60" rx="8" fill="rgba(168, 85, 247, 0.1)" stroke="#a855f7" stroke-width="2"/>
          <text x="110" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">React SPA</text>
          <!-- API Gateway / Express -->
          <rect x="340" y="70" width="120" height="60" rx="8" fill="rgba(236, 72, 153, 0.1)" stroke="#ec4899" stroke-width="2"/>
          <text x="400" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">Express.js API</text>
          <!-- Database -->
          <rect x="630" y="70" width="120" height="60" rx="8" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" stroke-width="2"/>
          <text x="690" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">MongoDB</text>
          <!-- Connectors -->
          <path d="M 170 100 L 340 100" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 4"/>
          <polygon points="340,100 330,95 330,105" fill="#a855f7"/>
          <path d="M 460 100 L 630 100" stroke="#ec4899" stroke-width="2" stroke-dasharray="4 4"/>
          <polygon points="630,100 620,95 620,105" fill="#ec4899"/>
        </svg>`,
        order: 1
      },
      {
        title: 'Cognitive Task Grid',
        description: 'An AI-powered project scheduler and task estimation model for Agile squads.',
        longDescription: 'Leverages statistical inference and historical team velocities to predict project timelines and auto-assign tasks. Features dynamic dependency visualization trees and automated sprint retrospectives.',
        category: 'AI / ML',
        technologies: ['React', 'Python', 'Flask', 'MySQL', 'CSS Modules'],
        githubLink: 'https://github.com/GihanSuminda/Cognitive-Task-Grid',
        liveLink: 'https://cognitive-tasks.demo.gihan.dev',
        status: 'In Progress',
        featured: true,
        codeMetrics: { linesOfCode: 8900, testCoverage: 84 },
        performanceMetrics: { lighthouseScore: 95, loadTimeMs: 680 },
        architectureDiagram: `<svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect width="800" height="200" rx="12" fill="#0b0b12" stroke="rgba(255,255,255,0.05)"/>
          <rect x="50" y="70" width="120" height="60" rx="8" fill="rgba(168, 85, 247, 0.1)" stroke="#a855f7" stroke-width="2"/>
          <text x="110" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">Vite App</text>
          <rect x="340" y="70" width="120" height="60" rx="8" fill="rgba(236, 72, 153, 0.1)" stroke="#ec4899" stroke-width="2"/>
          <text x="400" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">Flask / ML</text>
          <rect x="630" y="70" width="120" height="60" rx="8" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" stroke-width="2"/>
          <text x="690" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">MySQL</text>
          <path d="M 170 100 L 340 100" stroke="#a855f7" stroke-width="2"/>
          <polygon points="340,100 330,95 330,105" fill="#a855f7"/>
          <path d="M 460 100 L 630 100" stroke="#ec4899" stroke-width="2"/>
          <polygon points="630,100 620,95 620,105" fill="#ec4899"/>
        </svg>`,
        order: 2
      }
    ];

    const currentProjects = await Projects.find();
    if (currentProjects.length === 0) {
      for (const proj of projectsList) {
        await Projects.create(proj);
      }
      console.log('✅ Seeded projects successfully.');
    }

    // 4. Seed Certificates
    const certificatesList = [
      { title: 'Full Stack Web Development Boot Camp', issuer: 'Udemy / Online Academy', issueDate: 'Aug 2024', credentialId: 'UC-FE128', credentialUrl: '#', verificationLink: '#', badgeIcon: 'Award', category: 'Professional Certificate', order: 1 },
      { title: 'Responsive Design with CSS & Tailwind', issuer: 'FreeCodeCamp', issueDate: 'Jan 2024', credentialId: 'FCC-CSS-T', credentialUrl: '#', verificationLink: '#', badgeIcon: 'CheckCircle', category: 'Badge', order: 2 },
      { title: 'Academic Excellence Award - Year 2', issuer: 'University Board', issueDate: 'Oct 2025', credentialId: 'ACA-Y2', credentialUrl: '#', verificationLink: '#', badgeIcon: 'Award', category: 'Award', order: 3 }
    ];

    const currentCerts = await Certificates.find();
    if (currentCerts.length === 0) {
      for (const cert of certificatesList) {
        await Certificates.create(cert);
      }
      console.log('✅ Seeded certificates successfully.');
    }

    // 5. Seed Testimonials
    const testimonialsList = [
      { name: 'Sandun Perera', position: 'Lead Backend Developer', company: 'SysOps Solutions', content: 'Gihan is an incredibly proactive intern. He picked up our Express REST architecture within his first week and optimized three critical database index lookup queries.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', rating: 5, verified: true },
      { name: 'Professor Amal Silva', position: 'Department Chair (HCI)', company: 'University Center', content: 'In our Human Computer Interaction projects, Gihans commitment to designing accessible interfaces was unmatched. His software architectures are always clean and follow pattern best practices.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', rating: 5, verified: true }
    ];

    const currentTestimonials = await Testimonials.find();
    if (currentTestimonials.length === 0) {
      for (const test of testimonialsList) {
        await Testimonials.create(test);
      }
      console.log('✅ Seeded testimonials successfully.');
    }

    // 6. Seed Blogs
    const blogsList = [
      {
        title: 'Mastering REST API Security: JWT, Cors, and Helmet in Node.js',
        summary: 'A complete developer checklist to configure express backends securely for production deployment.',
        content: `### Security First: Essential Middleware

When launching production APIs in Express, safeguarding endpoints from malicious request patterns is crucial. This article outlines the key steps to implement robust authentication, secure response headers, and rate-limiting.

#### 1. HTTP Header Protection with Helmet
The \`helmet\` middleware secures Express apps by setting various HTTP headers. It prevents common vulnerabilities like Clickjacking, MIME type sniffing, and XSS.

\`\`\`javascript
import helmet from 'helmet';
app.use(helmet());
\`\`\`

#### 2. Cross-Origin Resource Sharing (CORS)
Be explicit about which domains can invoke your API endpoints:

\`\`\`javascript
app.use(cors({
  origin: 'https://gihan.dev',
  credentials: true
}));
\`\`\`

#### 3. Token-Based Authentication via JWT
Always sign tokens securely and store secrets in environment variables. Avoid storing credentials on client-side state without HTTPS cookies or encrypted stores.`,
        category: 'Backend Security',
        tags: ['Security', 'Node.js', 'Express', 'JWT'],
        featured: true,
        readingTime: '4 min read',
        likes: 12,
        bookmarksCount: 4,
        comments: [
          { name: 'Jane Recruiter', email: 'jane@hiring.com', content: 'Very detailed checklist. I will share this with our engineering team!', approved: true }
        ]
      },
      {
        title: 'Building Accessible UIs: An HCI Perspective',
        summary: 'How to combine semantic HTML and ARIA standards to create highly accessible web platforms.',
        content: `### Design for Everyone

In modern software engineering, web accessibility (a11y) is not a feature—it is a core requirement. This article reviews design considerations based on Human-Computer Interaction (HCI) research.

#### Key Principles
1. **Semantic Markup**: Avoid overuse of \`<div />\` containers. Prefer semantic wrappers like \`<header />\`, \`<main />\`, and \`<button />\`.
2. **Keyboard Navigation**: Ensure all interactive elements can be focused using the \`Tab\` key and triggered with \`Enter\` or \`Space\`.
3. **Contrast Ratios**: Check that display text satisfies WCAG AAA contrast metrics against background gradients.`,
        category: 'UI/UX Design',
        tags: ['HCI', 'Accessibility', 'A11y', 'HTML'],
        featured: false,
        readingTime: '6 min read',
        likes: 8,
        bookmarksCount: 2
      }
    ];

    const currentBlogs = await Blogs.find();
    if (currentBlogs.length === 0) {
      for (const blog of blogsList) {
        const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await Blogs.create({ ...blog, slug });
      }
      console.log('✅ Seeded blog articles successfully.');
    }

    console.log('🌱 Seeding process complete!');
    if (dbMode === 'json') {
      console.log('📁 Data written to server/data/db.json');
    }
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
  } finally {
    if (dbMode === 'mongodb') {
      // Close Mongoose connection
      import('mongoose').then(m => m.default.connection.close());
    }
  }
};

seedData();
