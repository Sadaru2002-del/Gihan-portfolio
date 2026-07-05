import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { securityHeaders, apiLimiter, sanitizeInput } from './middleware/security.js';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (MongoDB with JSON fallback)
connectDB();

// Global Middlewares
app.use(securityHeaders);
app.use(cors({
  origin: '*', // In production, replace with specific domain
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter and XSS sanitization globally on API routes
app.use('/api', apiLimiter);
app.use('/api', sanitizeInput);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Simple Healthcheck Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Serve Frontend Static Assets in Production
const clientBuildPath = path.join(__dirname, '../dist');
app.use(express.static(clientBuildPath));

// Fallback all non-API routes to index.html in production
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      // If client is not built, output default message
      res.status(200).send('<h1>Gihan Suminda Personal Brand Ecosystem API</h1><p>API Server is running. Frontend dev server should be run independently or built via npm run build.</p>');
    }
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
