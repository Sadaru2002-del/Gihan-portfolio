import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  approved: { type: Boolean, default: true }
}, {
  timestamps: true
});

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow optional author link for local testing/seed
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published'
  },
  readingTime: {
    type: String,
    default: '5 min read'
  },
  likes: {
    type: Number,
    default: 0
  },
  bookmarksCount: {
    type: Number,
    default: 0
  },
  comments: [CommentSchema],
  featured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
