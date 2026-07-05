import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// General rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tight rate limiter for Auth and Contact Form submissions
export const authAndContactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Limit each IP to 15 requests per hour
  message: {
    message: 'Submit rate limit exceeded. Please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom Input Sanitization Middleware (XSS Protection)
export const sanitizeInput = (req, res, next) => {
  const cleanString = (val) => {
    if (typeof val !== 'string') return val;
    // Strip tags and dangerous scripting patterns
    return val
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/javascript:/gi, '') // remove javascript pseudo-protocol
      .trim();
  };

  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = cleanString(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// Configures standard security headers via Helmet
export const securityHeaders = helmet();
