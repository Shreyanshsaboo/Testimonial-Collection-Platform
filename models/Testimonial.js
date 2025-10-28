import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema({
  // User/Project reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  
  // Testimonial content
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
  },
  company: {
    type: String,
    maxlength: [100, 'Company name cannot be more than 100 characters'],
  },
  position: {
    type: String,
    maxlength: [100, 'Position cannot be more than 100 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
  },
  testimonial: {
    type: String,
    required: [true, 'Please provide testimonial text'],
    maxlength: [1000, 'Testimonial cannot be more than 1000 characters'],
  },
  
  // Media
  photo: {
    type: String, // URL to photo
  },
  video: {
    type: String, // URL to video
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  
  // Featured flag
  featured: {
    type: Boolean,
    default: false,
  },
  
  // Metadata
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
})

// Update the updatedAt field on save
TestimonialSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Index for faster queries
TestimonialSchema.index({ userId: 1, status: 1 })
TestimonialSchema.index({ projectId: 1, status: 1 })

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)
