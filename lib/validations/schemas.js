import { z } from 'zod'

// User signup validation
export const signupSchema = z.object({
  // Trim input, require between 2 and 60 characters, and allow only letters and spaces
  name: z.string()
    .transform((s) => s.trim())
    .refine((s) => s.length >= 2, { message: 'Name must be at least 2 characters' })
    .refine((s) => s.length <= 60, { message: 'Name cannot be more than 60 characters' })
  .refine((s) => /^[\p{L} ]+$/u.test(s), { message: 'Name cannot contain numbers or special characters' }),
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
  // Require project name to be at least 5 words. Trim input and validate word count.
  name: z.string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, { message: 'Project name is required' })
    .refine((s) => s.split(/\s+/).filter(Boolean).length >= 5, { message: 'Project name must contain at least 5 words' })
    .refine((s) => s.length <= 100, { message: 'Project name cannot be more than 100 characters' }),
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
