import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: String, // E.g., "Dec 2025" or ISO string
    required: true
  },
  credentialId: {
    type: String,
    default: ''
  },
  credentialUrl: {
    type: String,
    default: ''
  },
  verificationLink: {
    type: String,
    default: ''
  },
  badgeIcon: {
    type: String, // Lucide icon name or image url
    default: 'Award'
  },
  category: {
    type: String,
    enum: ['Coursework', 'Professional Certificate', 'Badge', 'Award'],
    default: 'Professional Certificate'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
