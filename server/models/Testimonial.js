import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  verified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
