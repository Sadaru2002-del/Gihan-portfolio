import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Web App', 'System Utility', 'AI / ML', 'Mobile App', 'Open Source']
  },
  technologies: [{
    type: String
  }],
  githubLink: {
    type: String,
    default: ''
  },
  liveLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Archived'],
    default: 'Completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  codeMetrics: {
    linesOfCode: { type: Number, default: 0 },
    testCoverage: { type: Number, default: 0 }
  },
  performanceMetrics: {
    lighthouseScore: { type: Number, default: 100 },
    loadTimeMs: { type: Number, default: 0 }
  },
  architectureDiagram: {
    type: String, // Stringified SVG or markup representing custom visual architecture
    default: ''
  },
  screenshots: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
