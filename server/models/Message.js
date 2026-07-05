import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Meeting Request', 'Interview Request', 'Collaboration Request', 'General Inquiry'],
    default: 'General Inquiry'
  },
  content: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  responseSent: {
    type: Boolean,
    default: false
  },
  responseContent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
