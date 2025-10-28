import { z } from 'zod'

// User signup validation
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  company: z.string().max(100).optional(),
})

// Testimonial submission validation
export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
  rating: z.number().min(1).max(5),
  testimonial: z.string().min(10, 'Testimonial must be at least 10 characters').max(1000),
  photo: z.string().url().optional(),
  video: z.string().url().optional(),
})

// Project creation validation
export const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

// Widget customization validation
export const widgetCustomizationSchema = z.object({
  layout: z.enum(['carousel', 'grid', 'cards', 'list']),
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    fontFamily: z.string(),
  }),
  showRatings: z.boolean(),
  showPhotos: z.boolean(),
  showCompany: z.boolean(),
  maxTestimonials: z.number().min(1).max(50),
})
