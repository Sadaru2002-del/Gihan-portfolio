-- ==============================================================================
-- SUPABASE DATABASE & STORAGE SCHEMA FOR PORTFOLIO
-- Execute this entire script in your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Web App',
  technologies TEXT[] DEFAULT '{}',
  github_link TEXT DEFAULT '',
  live_link TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  status TEXT DEFAULT 'Completed',
  featured BOOLEAN DEFAULT false,
  code_metrics JSONB DEFAULT '{"linesOfCode": 0, "testCoverage": 0}'::jsonb,
  performance_metrics JSONB DEFAULT '{"lighthouseScore": 100, "loadTimeMs": 400}'::jsonb,
  architecture_diagram TEXT DEFAULT '',
  screenshots TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Software Development',
  cover_image TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Published',
  reading_time TEXT DEFAULT '5 min read',
  likes INT DEFAULT 0,
  bookmarks_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE BLOG COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Frontend',
  level INT DEFAULT 80,
  icon TEXT DEFAULT 'Code',
  color TEXT DEFAULT '#9333EA',
  relationship_tree TEXT[] DEFAULT '{}',
  learning_progress INT DEFAULT 100,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_id TEXT DEFAULT '',
  credential_url TEXT DEFAULT '',
  verification_link TEXT DEFAULT '',
  badge_icon TEXT DEFAULT 'Award',
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'Professional Certificate',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CREATE TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  rating INT DEFAULT 5,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CREATE MESSAGES TABLE (Contact & Interview inquiries)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'General Inquiry',
  content TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CREATE ANALYTICS TABLE (Pageviews & telemetry)
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT DEFAULT 'pageview',
  path TEXT NOT NULL DEFAULT '/',
  referrer TEXT DEFAULT '',
  browser TEXT DEFAULT 'Unknown',
  os TEXT DEFAULT 'Unknown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CREATE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  site_name TEXT DEFAULT 'Gihan Suminda - Personal Portfolio',
  theme TEXT DEFAULT 'dark',
  seo_keywords TEXT DEFAULT 'Software Engineer, Portfolio, Full Stack Developer, React, Supabase',
  seo_description TEXT DEFAULT 'Personal portfolio and engineering showcase.',
  avatar_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to storage files
CREATE POLICY "Public Read Access to Portfolio Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Allow authenticated / anon upload access to portfolio bucket
CREATE POLICY "Public Upload Access to Portfolio Bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Public Update Access to Portfolio Bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio');

CREATE POLICY "Public Delete Access to Portfolio Bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio');

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public read blog_comments" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Allow public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);

-- Public Insert Policies (Contact messages, blog comments, analytics)
CREATE POLICY "Allow public insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert blog_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);

-- Allow full modifications (using anon key for portfolio dashboard operations)
CREATE POLICY "Allow modify projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify analytics" ON public.analytics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 13. SEED INITIAL DATA (PORTFOLIO CONTENT)
-- ==============================================================================

-- Seed Settings
INSERT INTO public.settings (id, site_name, theme, seo_keywords, seo_description)
VALUES (
  'general',
  'Gihan Suminda - Software Engineer & Portfolio',
  'dark',
  'Software Engineer, Full Stack, React, Node.js, Supabase, Cloud Architecture',
  'Personal brand ecosystem and portfolio of Gihan Suminda, Software Engineering Undergraduate.'
) ON CONFLICT (id) DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (title, description, long_description, category, technologies, github_link, live_link, status, featured, code_metrics, performance_metrics, architecture_diagram, sort_order)
VALUES
(
  'Lumina Dining Platform',
  'Advanced restaurant booking and digital ordering system with multi-role dashboards.',
  'A comprehensive digital system built for restaurants to manage online reservations, visual menus, dynamic orders, and customer billing. Implements secure JWT authentication, detailed logs, dynamic role dashboard widgets, and complex aggregation analytics for restaurant owners.',
  'Web App',
  ARRAY['React', 'Node.js', 'Express.js', 'Supabase', 'Tailwind CSS'],
  'https://github.com/GihanSuminda/Lumina-Dining',
  'https://lumina-dining.demo.gihan.dev',
  'Completed',
  true,
  '{"linesOfCode": 15400, "testCoverage": 92}'::jsonb,
  '{"lighthouseScore": 98, "loadTimeMs": 420}'::jsonb,
  '<svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;"><rect width="800" height="200" rx="12" fill="#0b0b12" stroke="rgba(255,255,255,0.05)"/><rect x="50" y="70" width="120" height="60" rx="8" fill="rgba(168, 85, 247, 0.1)" stroke="#a855f7" stroke-width="2"/><text x="110" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">React SPA</text><rect x="340" y="70" width="120" height="60" rx="8" fill="rgba(236, 72, 153, 0.1)" stroke="#ec4899" stroke-width="2"/><text x="400" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">API Gateway</text><rect x="630" y="70" width="120" height="60" rx="8" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" stroke-width="2"/><text x="690" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">Supabase</text><path d="M 170 100 L 340 100" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 4"/><polygon points="340,100 330,95 330,105" fill="#a855f7"/><path d="M 460 100 L 630 100" stroke="#ec4899" stroke-width="2" stroke-dasharray="4 4"/><polygon points="630,100 620,95 620,105" fill="#ec4899"/></svg>',
  1
),
(
  'Cognitive Task Grid',
  'An AI-powered project scheduler and task estimation model for Agile squads.',
  'Leverages statistical inference and historical team velocities to predict project timelines and auto-assign tasks. Features dynamic dependency visualization trees and automated sprint retrospectives.',
  'AI / ML',
  ARRAY['React', 'Python', 'Flask', 'PostgreSQL', 'CSS Modules'],
  'https://github.com/GihanSuminda/Cognitive-Task-Grid',
  'https://cognitive-tasks.demo.gihan.dev',
  'In Progress',
  true,
  '{"linesOfCode": 8900, "testCoverage": 84}'::jsonb,
  '{"lighthouseScore": 95, "loadTimeMs": 680}'::jsonb,
  '<svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;"><rect width="800" height="200" rx="12" fill="#0b0b12" stroke="rgba(255,255,255,0.05)"/><rect x="50" y="70" width="120" height="60" rx="8" fill="rgba(168, 85, 247, 0.1)" stroke="#a855f7" stroke-width="2"/><text x="110" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">Vite App</text><rect x="340" y="70" width="120" height="60" rx="8" fill="rgba(236, 72, 153, 0.1)" stroke="#ec4899" stroke-width="2"/><text x="400" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">Flask / ML</text><rect x="630" y="70" width="120" height="60" rx="8" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" stroke-width="2"/><text x="690" y="105" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">Supabase DB</text><path d="M 170 100 L 340 100" stroke="#a855f7" stroke-width="2"/><polygon points="340,100 330,95 330,105" fill="#a855f7"/><path d="M 460 100 L 630 100" stroke="#ec4899" stroke-width="2"/><polygon points="630,100 620,95 620,105" fill="#ec4899"/></svg>',
  2
)
ON CONFLICT DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (name, category, level, icon, color, relationship_tree, learning_progress, sort_order)
VALUES
('HTML5 & CSS3', 'Frontend', 90, 'Html5', '#E34F26', ARRAY['CSSGrid', 'Flexbox'], 100, 1),
('JavaScript (ES6+)', 'Frontend', 88, 'Cpu', '#F7DF1E', ARRAY['React', 'Node.js'], 100, 2),
('React.js', 'Frontend', 85, 'React', '#61DAFB', ARRAY['Tailwind CSS', 'Supabase'], 100, 3),
('Tailwind CSS', 'Frontend', 85, 'Wind', '#06B6D4', ARRAY['React.js'], 100, 4),
('Bootstrap', 'Frontend', 80, 'Layout', '#7952B3', ARRAY['HTML5 & CSS3'], 100, 5),
('Node.js', 'Backend', 82, 'Terminal', '#339933', ARRAY['Express.js', 'PostgreSQL'], 100, 6),
('Express.js', 'Backend', 85, 'Server', '#8A2BE2', ARRAY['Node.js', 'JWT Auth'], 100, 7),
('Supabase & PostgreSQL', 'Database', 85, 'Database', '#3ECF8E', ARRAY['SQL', 'Realtime', 'Storage'], 100, 8),
('MongoDB', 'Database', 80, 'Database', '#47A248', ARRAY['Node.js', 'Mongoose'], 100, 9),
('MySQL', 'Database', 78, 'Database', '#4479A1', ARRAY['Express.js'], 100, 10),
('Git & GitHub', 'Tools', 85, 'GitBranch', '#F05032', ARRAY['VS Code'], 100, 11),
('VS Code', 'Tools', 90, 'Code', '#007ACC', ARRAY[]::text[], 100, 12),
('Postman', 'Tools', 80, 'Shield', '#FF6C37', ARRAY['REST APIs'], 100, 13),
('Figma', 'Tools', 75, 'Figma', '#F24E1E', ARRAY['React.js'], 100, 14),
('Software Architecture', 'Academic Subject', 80, 'Layers', '#9333EA', ARRAY['Design Patterns'], 95, 15),
('Design Patterns', 'Academic Subject', 82, 'Grid', '#3B82F6', ARRAY['Software Architecture'], 95, 16),
('Human Computer Interaction', 'Academic Subject', 85, 'Users', '#EC4899', ARRAY['Figma'], 98, 17),
('Artificial Intelligence', 'Academic Subject', 75, 'Cpu', '#10B981', ARRAY['Logic Programming'], 88, 18),
('Software Quality Assurance', 'Academic Subject', 80, 'CheckCircle', '#EF4444', ARRAY[]::text[], 92, 19)
ON CONFLICT DO NOTHING;

-- Seed Certificates
INSERT INTO public.certificates (title, issuer, issue_date, credential_id, credential_url, verification_link, badge_icon, category, sort_order)
VALUES
('Full Stack Web Development Boot Camp', 'Udemy / Online Academy', 'Aug 2024', 'UC-FE128', '#', '#', 'Award', 'Professional Certificate', 1),
('Responsive Design with CSS & Tailwind', 'FreeCodeCamp', 'Jan 2024', 'FCC-CSS-T', '#', '#', 'CheckCircle', 'Badge', 2),
('Academic Excellence Award - Year 2', 'University Board', 'Oct 2025', 'ACA-Y2', '#', '#', 'Award', 'Award', 3)
ON CONFLICT DO NOTHING;

-- Seed Testimonials
INSERT INTO public.testimonials (name, position, company, content, avatar, rating, verified)
VALUES
(
  'Sandun Perera',
  'Lead Backend Developer',
  'SysOps Solutions',
  'Gihan is an incredibly proactive intern. He picked up our Express REST architecture within his first week and optimized three critical database index lookup queries.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  5,
  true
),
(
  'Professor Amal Silva',
  'Department Chair (HCI)',
  'University Center',
  'In our Human Computer Interaction projects, Gihans commitment to designing accessible interfaces was unmatched. His software architectures are always clean and follow pattern best practices.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  5,
  true
)
ON CONFLICT DO NOTHING;

-- Seed Blogs
INSERT INTO public.blogs (title, slug, summary, content, category, tags, featured, reading_time, likes, bookmarks_count)
VALUES
(
  'Mastering Cloud & REST Architecture: Connecting Supabase and React',
  'mastering-cloud-rest-architecture-connecting-supabase-and-react',
  'A complete developer checklist to configure Supabase PostgreSQL backends, Row Level Security, and Storage buckets securely.',
  '### Security First: Essential Architecture\n\nWhen launching modern web apps, utilizing serverless PostgreSQL and cloud storage through Supabase provides instant scalability, high availability, and built-in Row Level Security.\n\n#### 1. Row Level Security (RLS)\nRLS guarantees that database tables can only be accessed or modified by designated roles or policies.\n\n```sql\nALTER TABLE projects ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);\n```\n\n#### 2. Supabase Storage for Assets\nStore project screenshots, resumes, and certificates directly into public or private buckets with automatic CDN caching.\n\n#### 3. Frontend Client Integration\nWith `@supabase/supabase-js`, querying data and uploading files takes only a few clean lines of code.',
  'Cloud Architecture',
  ARRAY['Supabase', 'PostgreSQL', 'Security', 'React', 'Storage'],
  true,
  '5 min read',
  16,
  5
),
(
  'Building Accessible UIs: An HCI Perspective',
  'building-accessible-uis-an-hci-perspective',
  'How to combine semantic HTML and ARIA standards to create highly accessible web platforms.',
  '### Design for Everyone\n\nIn modern software engineering, web accessibility (a11y) is not a feature—it is a core requirement. This article reviews design considerations based on Human-Computer Interaction (HCI) research.\n\n#### Key Principles\n1. **Semantic Markup**: Avoid overuse of generic containers. Prefer semantic wrappers like `<header />`, `<main />`, and `<button />`.\n2. **Keyboard Navigation**: Ensure all interactive elements can be focused using the `Tab` key and triggered with `Enter` or `Space`.\n3. **Contrast Ratios**: Check that display text satisfies WCAG AAA contrast metrics against background gradients.',
  'UI/UX Design',
  ARRAY['HCI', 'Accessibility', 'A11y', 'HTML'],
  false,
  '6 min read',
  12,
  3
)
ON CONFLICT DO NOTHING;
