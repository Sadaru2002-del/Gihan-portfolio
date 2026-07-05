# Gihan Suminda - Personal Brand Ecosystem & Platform

An enterprise-grade, premium digital identity platform and content management system for Software Engineering Undergraduate & Full Stack Development Intern, Gihan Suminda. 

This platform acts as a complete brand dashboard, including traffic analytics tracking, a markdown blog publishing pipeline, recruiter request schedulers, interactive code terminal consoles, and project showcase case studies.

---

## 🚀 Key Features

1. **Interactive Hero Command Center:** Canvas-based proximity particle networking, live coded stat counters, and an interactive CLI bash terminal.
2. **Storytelling Journey Roadmap:** Animated vertical and horizontal progress timeline of academic and industrial stages.
3. **Advanced Skill Matrix:** Structured categories (Frontend, Backend, Databases, Academic, Tools) with progress meters, dependency subtrees, and interactive SVG radar coordinates.
4. **Project Case Studies:** Filterable project cards with automated metrics (Lines of Code, Test Coverage, Lighthouse performance scores) and embedded inline SVG architecture layouts.
5. **AI Recruitment Chat Agent:** Simulated conversational sidebar chatbot pre-trained on Gihan's academic achievements and project stack.
6. **Recruiter Scheduler Gate:** Mock resume download triggers and direct interview proposals that request blocks on the database queue and launch particle confetti.
7. **Contact Center Tracker:** Multi-category feedback forms that display active tracking IDs and eta updates on success.
8. **Admin Control Room:** Administrative portal secured with JWT showing operating system analytics charts, message status registers, project editors, and blog markdown publishers.

---

## 📁 Repository Folder Structure

```
yashika portfolio/
├── package.json         # Vite frontend configuration & scripts
├── vite.config.js       # Vite bundler parameters
├── index.html           # Master HTML wrapper with SEO metadata
├── src/                 # React frontend source files
│   ├── main.jsx         # App mounting entry point
│   ├── index.css        # Custom design system styling
│   ├── App.jsx          # React page router gates
│   ├── components/      # UI components (Canvas, Terminal, Schedulers)
│   │   ├── AIAssistant.jsx
│   │   ├── JourneyTimeline.jsx
│   │   ├── Navbar.jsx
│   │   ├── ParticlesBackground.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── RecruiterPanel.jsx
│   │   └── Terminal.jsx
│   ├── pages/           # High-level layouts
│   │   ├── Home.jsx
│   │   ├── Blog.jsx
│   │   ├── Login.jsx
│   │   └── AdminDashboard.jsx
│   └── utils/
│       └── api.js       # API client connecting client to Express
└── server/              # Express backend server folder
    ├── package.json     # Node server package configurations
    ├── server.js        # Main entry point and server startup
    ├── .env             # Environment variables configuration
    ├── config/
    │   └── db.js        # Dual-mode Mongoose & JSON loader config
    ├── data/
    │   └── db.json      # File-backed fallback database store
    ├── middleware/
    │   ├── auth.js      # JWT validator filter
    │   └── security.js  # Helmet, rate-limiter, and XSS sanitizers
    ├── models/          # Database schema models
    ├── controllers/     # Route logic operations
    ├── routes/          # API endpoint paths
    ├── scripts/
    │   └── seed.js      # Database seed populator script
    └── tests/
        └── api.test.js  # Integration testing scripts
```

---

## 🛠️ Tech Stack & Design Tokens

*   **Frontend:** React (Vite-powered SPA), custom Premium Vanilla CSS.
*   **Backend:** Node.js, Express.js REST API.
*   **Security:** JWT headers, Bcryptjs password hashing, Helmet API headers, Express Rate Limit, Custom String HTML/XSS input sanitizers.
*   **Database (Dual-Mode):** MongoDB (Mongoose Schema) or automatic localized JSON file storage fallback.
*   **Design Tokens:**
    *   *Theme:* Deep Obsidian primary `#050508`, Slate Gray `#0b0b12`, Purple `#a855f7`, Indigo `#6366f1`.
    *   *Typography:* Outfit (headings/displays), Inter (UI body), Fira Code (terminal console).
    *   *Elevation:* backdrop-filter blur `12px` and `16px` glassmorphisms.

---

## 💻 Local Installation & Setup

### Prerequisites
*   Node.js (v18.0+)
*   npm (v9.0+)

### Setup Commands

1.  **Clone / open the workspace directory:**
    ```bash
    cd "yashika portfolio"
    ```
2.  **Install client dependencies:**
    ```bash
    npm install
    ```
3.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```
4.  **Seed the local database:**
    ```bash
    node server/scripts/seed.js
    ```
    *(This creates the default JSON database structure at `server/data/db.json` and seeds Gihan's core info)*
5.  **Run backend API server:**
    ```bash
    npm run dev --prefix server
    ```
6.  **Run React frontend server:**
    ```bash
    npm run dev
    ```
7.  **Navigate to the app:**
    *   Frontend: `http://localhost:5173`
    *   Backend Healthcheck: `http://localhost:5000/health`
    *   Admin Login: `http://localhost:5173/login` (`admin@gihan.com` / `adminpassword123`)

---

## 📡 REST API Documentation

All API endpoints are prefixed with `/api`.

| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/auth/login` | POST | Public (15/hr) | Auths admin credentials, returns JWT |
| `/auth/me` | GET | Admin JWT | Retrieves active logged-in user profile |
| `/projects` | GET | Public | Lists all showcase projects |
| `/projects` | POST | Admin JWT | Adds a new project card |
| `/projects/:id`| PUT | Admin JWT | Modifies a project card |
| `/projects/:id`| DELETE| Admin JWT | Deletes a project card |
| `/blogs` | GET | Public | Lists all published blog posts |
| `/blogs/:slug` | GET | Public | Gets a single article detail |
| `/blogs/:id/comment` | POST | Public | Appends a comment to an article |
| `/blogs/:id/like` | POST | Public | Increments an article's like counter |
| `/messages` | POST | Public (15/hr) | Submits contact inquiries / interview requests |
| `/messages` | GET | Admin JWT | Retrieves all inbox records |
| `/content/skills`| GET | Public | Retrieves skill matrix list |
| `/analytics/log` | POST | Public | Logs a visitor hit (anonymous) |
| `/analytics/stats`| GET | Admin JWT | Computes traffic distribution report stats |

---

## 🧪 Running Integration Tests

To run the automated API and database validations:
```bash
node server/tests/api.test.js
```

---

## 🚢 Deployment Guidelines

### 1. Docker Deployment
A basic Docker configuration can package the Express API (which automatically serves the compiled static React build).
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "server/server.js"]
```

### 2. Cloud Platforms (Railway, Render, AWS, GCP)
1.  Set up your environment variables on the hosting platform:
    *   `JWT_SECRET` = `<your_secure_hash>`
    *   `MONGO_URI` = `mongodb+srv://...` (If using Atlas cloud database. Leave empty to auto-use JSON file storage fallback).
    *   `PORT` = `5000`
2.  Deploy the root repository. The Express server serves compiled files in production out of `/dist` automatically.

---

## 🛠️ Maintenance & Contribution

*   **Adding Skills:** Can be added via the administrative REST endpoints or seeded via `server/scripts/seed.js` using corresponding SVG icons.
*   **Updating Resume:** Modify Gihan's downloadable text parameters inside `downloadMockResume()` in `src/components/RecruiterPanel.jsx`.
*   **Theme tweaks:** Modify CSS variables in `src/index.css` inside `body` or `body.light-mode`.
