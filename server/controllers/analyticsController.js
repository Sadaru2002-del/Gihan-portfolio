import { AnalyticsStore, Messages, Projects, Blogs } from '../models/dbStore.js';
import crypto from 'crypto';

export const logEvent = async (req, res) => {
  const { eventType, path, referrer, browser, os } = req.body;

  if (!path) {
    return res.status(400).json({ message: 'Path is required' });
  }

  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    // Create anonymized IP hash
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    const newLog = await AnalyticsStore.create({
      eventType: eventType || 'pageview',
      path,
      referrer: referrer || '',
      browser: browser || 'Unknown',
      os: os || 'Unknown',
      ipHash
    });

    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: 'Error logging analytics event', error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const allEvents = await AnalyticsStore.find() || [];
    
    // Page views
    const pageviews = allEvents.length;
    
    // Unique visitors (by ipHash)
    const uniqueIPs = new Set(allEvents.map(e => e.ipHash));
    const uniqueVisitors = uniqueIPs.size;

    // Project and Blog counts
    const projectCount = await Projects.countDocuments();
    const blogCount = await Blogs.countDocuments();
    const messageCount = await Messages.countDocuments();

    // Group pageviews by path
    const pathStats = {};
    allEvents.forEach(e => {
      pathStats[e.path] = (pathStats[e.path] || 0) + 1;
    });

    // Group visitors by OS
    const osStats = {};
    allEvents.forEach(e => {
      osStats[e.os] = (osStats[e.os] || 0) + 1;
    });

    // Group visitors by Browser
    const browserStats = {};
    allEvents.forEach(e => {
      browserStats[e.browser] = (browserStats[e.browser] || 0) + 1;
    });

    res.json({
      summary: {
        pageviews,
        uniqueVisitors,
        projectCount,
        blogCount,
        messageCount
      },
      paths: pathStats,
      os: osStats,
      browsers: browserStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving analytics statistics', error: error.message });
  }
};
