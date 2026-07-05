import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Academic Subject']
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  icon: {
    type: String, // Icon ID from Lucide-React
    required: true
  },
  color: {
    type: String, // CSS color variable or hex
    default: 'var(--color-primary)'
  },
  relationshipTree: [{
    type: String // Names of related technologies (e.g. Node.js -> Express.js, MongoDB)
  }],
  learningProgress: {
    type: Number, // Current progress indicator
    default: 100
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
