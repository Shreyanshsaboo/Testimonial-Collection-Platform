import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Project details
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    maxlength: [100, 'Project name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  website: {
    type: String,
    maxlength: [200, 'Website URL cannot be more than 200 characters'],
  },
  
  // Unique shareable ID for testimonial form
  shareId: {
    type: String,
    unique: true,
    default: () => nanoid(10),
  },
  
  // Form settings
  formSettings: {
    collectEmail: {
      type: Boolean,
      default: true,
    },
    collectCompany: {
      type: Boolean,
      default: true,
    },
    collectPosition: {
      type: Boolean,
      default: true,
    },
    allowVideo: {
      type: Boolean,
      default: true,
    },
    allowPhoto: {
      type: Boolean,
      default: true,
    },
    requireApproval: {
      type: Boolean,
      default: true,
    },
    customQuestions: [{
      question: String,
      required: Boolean,
    }],
  },
  
  // Widget customization
  widgetSettings: {
    layout: {
      type: String,
      enum: ['carousel', 'grid', 'cards', 'list'],
      default: 'carousel',
    },
    theme: {
      primaryColor: {
        type: String,
        default: '#0ea5e9',
      },
      backgroundColor: {
        type: String,
        default: '#ffffff',
      },
      textColor: {
        type: String,
        default: '#1f2937',
      },
      fontFamily: {
        type: String,
        default: 'Inter, sans-serif',
      },
    },
    showRatings: {
      type: Boolean,
      default: true,
    },
    showPhotos: {
      type: Boolean,
      default: true,
    },
    showCompany: {
      type: Boolean,
      default: true,
    },
    maxTestimonials: {
      type: Number,
      default: 10,
    },
  },
  
  // Status
  active: {
    type: Boolean,
    default: true,
  },
  
  // Statistics
  stats: {
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    approvedCount: {
      type: Number,
      default: 0,
    },
    rejectedCount: {
      type: Number,
      default: 0,
    },
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field on save
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Index for faster queries
ProjectSchema.index({ userId: 1 })
ProjectSchema.index({ shareId: 1 })

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
