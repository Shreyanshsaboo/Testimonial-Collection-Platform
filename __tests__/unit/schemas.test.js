import { 
  signupSchema, 
  testimonialSchema, 
  projectSchema,
  widgetCustomizationSchema 
} from '@/lib/validations/schemas'

describe('Schema Validations', () => {
  describe('signupSchema - Name validator', () => {
    it('should accept valid Unicode names with letters only', () => {
      const validNames = [
        { name: 'Alice', email: 'alice@example.com', password: 'pass123' },
        { name: 'José Álvarez', email: 'jose@example.com', password: 'pass123' },
        { name: 'François René', email: 'francois@example.com', password: 'pass123' },
        { name: 'Müller Schmidt', email: 'muller@example.com', password: 'pass123' },
      ]

      validNames.forEach((data) => {
        const result = signupSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should reject names with numbers', () => {
      const invalidData = { 
        name: 'John Doe2', 
        email: 'john@example.com', 
        password: 'pass123' 
      }
      
      const result = signupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe('Name cannot contain numbers or special characters')
    })

    it('should reject names with special characters (hyphen)', () => {
      const invalidData = { 
        name: 'Mary-Jane', 
        email: 'mary@example.com', 
        password: 'pass123' 
      }
      
      const result = signupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe('Name cannot contain numbers or special characters')
    })

    it('should reject empty string name', () => {
      const invalidData = { 
        name: '', 
        email: 'test@example.com', 
        password: 'pass123' 
      }
      
      const result = signupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe('Name must be at least 2 characters')
    })

    it('should trim whitespace and validate', () => {
      const data = { 
        name: '  Alice  ', 
        email: 'alice@example.com', 
        password: 'pass123' 
      }
      
      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
      expect(result.data.name).toBe('Alice')
    })

    it('should accept names with diacritics', () => {
      const validNames = ['Søren', 'Björk', 'Łukasz', 'Юрий']
      
      validNames.forEach((name) => {
        const result = signupSchema.safeParse({ 
          name, 
          email: 'test@example.com', 
          password: 'pass123' 
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject names that are too short', () => {
      const invalidData = { 
        name: 'A', 
        email: 'test@example.com', 
        password: 'pass123' 
      }
      
      const result = signupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe('Name must be at least 2 characters')
    })

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(61)
      const invalidData = { 
        name: longName, 
        email: 'test@example.com', 
        password: 'pass123' 
      }
      
      const result = signupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe('Name cannot be more than 60 characters')
    })
  })

  describe('testimonialSchema - Description validator', () => {
    it('should reject description shorter than 10 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        testimonial: 'ok'
      }
      
      const result = testimonialSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors.some(e => 
        e.message === 'Testimonial must be at least 10 characters'
      )).toBe(true)
    })

    it('should accept description with exactly 10 characters', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        testimonial: 'Good work!'
      }
      
      const result = testimonialSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept valid testimonial', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        testimonial: 'This is a great product that I highly recommend!'
      }
      
      const result = testimonialSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject description over 1000 characters', () => {
      const longTestimonial = 'A'.repeat(1001)
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        testimonial: longTestimonial
      }
      
      const result = testimonialSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema - Email validator', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'admin@subdomain.example.com',
      ]
      
      validEmails.forEach((email) => {
        const result = signupSchema.safeParse({ 
          name: 'Test User', 
          email, 
          password: 'pass123' 
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@.com',
      ]
      
      invalidEmails.forEach((email) => {
        const result = signupSchema.safeParse({ 
          name: 'Test User', 
          email, 
          password: 'pass123' 
        })
        expect(result.success).toBe(false)
      })
    })

    it('should accept email with multiple dots in domain', () => {
      const email = 'k@gmail.com.com'
      const result = signupSchema.safeParse({ 
        name: 'Test User', 
        email, 
        password: 'pass123' 
      })
      // Based on Zod's email validation, this should pass
      expect(result.success).toBe(true)
    })
  })

  describe('projectSchema - Name validator', () => {
    it('should require at least 5 words in project name', () => {
      const invalidData = { name: 'My Project' }
      
      const result = projectSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe('Project name must contain at least 5 words')
    })

    it('should accept project name with exactly 5 words', () => {
      const validData = { name: 'My Awesome Project For Testing' }
      
      const result = projectSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept project name with more than 5 words', () => {
      const validData = { name: 'My Super Awesome Project For Testing Today' }
      
      const result = projectSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should trim whitespace and count words correctly', () => {
      const validData = { name: '  One Two Three Four Five  ' }
      
      const result = projectSchema.safeParse(validData)
      expect(result.success).toBe(true)
      expect(result.data.name).toBe('One Two Three Four Five')
    })

    it('should handle multiple spaces between words', () => {
      const validData = { name: 'One  Two   Three    Four     Five' }
      
      const result = projectSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty project name', () => {
      const invalidData = { name: '' }
      
      const result = projectSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe('Project name is required')
    })

    it('should reject project name over 100 characters', () => {
      const longName = 'Word '.repeat(30) // Creates a very long name
      const invalidData = { name: longName }
      
      const result = projectSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('widgetCustomizationSchema', () => {
    it('should accept valid widget customization', () => {
      const validData = {
        layout: 'carousel',
        theme: {
          primaryColor: '#0ea5e9',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          fontFamily: 'Inter, sans-serif',
        },
        showRatings: true,
        showPhotos: true,
        showCompany: true,
        maxTestimonials: 10,
      }
      
      const result = widgetCustomizationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid color format', () => {
      const invalidData = {
        layout: 'carousel',
        theme: {
          primaryColor: 'blue', // Invalid format
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          fontFamily: 'Inter',
        },
        showRatings: true,
        showPhotos: true,
        showCompany: true,
        maxTestimonials: 10,
      }
      
      const result = widgetCustomizationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject maxTestimonials out of range', () => {
      const invalidData = {
        layout: 'carousel',
        theme: {
          primaryColor: '#0ea5e9',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          fontFamily: 'Inter',
        },
        showRatings: true,
        showPhotos: true,
        showCompany: true,
        maxTestimonials: 100, // Over max
      }
      
      const result = widgetCustomizationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
