import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['pageview', 'click', 'form_submit'],
    default: 'pageview'
  },
  path: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: ''
  },
  browser: {
    type: String,
    default: 'Unknown'
  },
  os: {
    type: String,
    default: 'Unknown'
  },
  duration: {
    type: Number, // in seconds, if tracking scroll/session duration
    default: 0
  },
  ipHash: {
    type: String, // Anonymized hash of client IP
    default: ''
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
