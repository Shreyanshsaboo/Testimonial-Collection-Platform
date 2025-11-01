/**
 * Integration tests for Project and Testimonial models
 */

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Project from '@/models/Project'
import Testimonial from '@/models/Testimonial'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

// Mock nanoid locally with unique values
jest.mock('nanoid', () => {
  let counter = 0
  return {
    nanoid: jest.fn(() => {
      counter++
      return `share${counter.toString().padStart(10, '0')}`
    }),
  }
})

let mongoServer

describe('Project and Testimonial Models', () => {
  let testUser

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)

    // Create a test user for references
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 12),
    })
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await Project.deleteMany({})
    await Testimonial.deleteMany({})
    jest.clearAllMocks()
  })

  describe('Project Model', () => {
    it('should create project with valid data', async () => {
      const projectData = {
        userId: testUser._id,
        name: 'My Awesome Project For Testing Today',
        description: 'Test description',
      }

      const project = await Project.create(projectData)

      expect(project.name).toBe(projectData.name)
      expect(project.description).toBe(projectData.description)
      expect(project.shareId).toBeDefined()
      expect(project.shareId.length).toBe(10) // nanoid(10)
    })

    it('should generate unique shareId', async () => {
      const project1 = await Project.create({
        userId: testUser._id,
        name: 'First Project With Five Words Here',
      })

      const project2 = await Project.create({
        userId: testUser._id,
        name: 'Second Project With Five Words Here',
      })

      expect(project1.shareId).not.toBe(project2.shareId)
    })

    it('should set default widget settings', async () => {
      const project = await Project.create({
        userId: testUser._id,
        name: 'Project With Default Settings Goes Here',
      })

      expect(project.widgetSettings.layout).toBe('carousel')
      expect(project.widgetSettings.theme.primaryColor).toBe('#0ea5e9')
      expect(project.widgetSettings.showRatings).toBe(true)
    })

    it('should enforce name max length (100 characters)', async () => {
      const longName = 'Word '.repeat(30) // Much longer than 100 chars

      await expect(
        Project.create({
          userId: testUser._id,
          name: longName,
        })
      ).rejects.toThrow()
    })

    it('should require userId', async () => {
      await expect(
        Project.create({
          name: 'Project Without User ID Reference',
        })
      ).rejects.toThrow()
    })

    it('should require name', async () => {
      await expect(
        Project.create({
          userId: testUser._id,
        })
      ).rejects.toThrow()
    })
  })

  describe('Testimonial Model', () => {
    let testProject

    beforeEach(async () => {
      testProject = await Project.create({
        userId: testUser._id,
        name: 'Test Project For Testimonial Validation',
      })
    })

    it('should create testimonial with required fields', async () => {
      const testimonialData = {
        userId: testUser._id,
        projectId: testProject._id,
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        testimonial: 'This is an excellent product that I highly recommend!',
      }

      const testimonial = await Testimonial.create(testimonialData)

      expect(testimonial.name).toBe(testimonialData.name)
      expect(testimonial.email).toBe(testimonialData.email)
      expect(testimonial.rating).toBe(testimonialData.rating)
      expect(testimonial.testimonial).toBe(testimonialData.testimonial)
      expect(testimonial.status).toBe('pending') // Default status
    })

    it('should require projectId', async () => {
      await expect(
        Testimonial.create({
          userId: testUser._id,
          name: 'John Doe',
          email: 'john@example.com',
          rating: 5,
          testimonial: 'Great product!',
          // Missing projectId
        })
      ).rejects.toThrow()
    })

    it('should require name', async () => {
      await expect(
        Testimonial.create({
          userId: testUser._id,
          projectId: testProject._id,
          email: 'john@example.com',
          rating: 5,
          testimonial: 'Great product!',
          // Missing name
        })
      ).rejects.toThrow()
    })

    it('should require description (testimonial text)', async () => {
      await expect(
        Testimonial.create({
          userId: testUser._id,
          projectId: testProject._id,
          name: 'John Doe',
          email: 'john@example.com',
          rating: 5,
          // Missing testimonial
        })
      ).rejects.toThrow()
    })

    it('should enforce rating between 1 and 5', async () => {
      // Test rating too high
      await expect(
        Testimonial.create({
          userId: testUser._id,
          projectId: testProject._id,
          name: 'John Doe',
          email: 'john@example.com',
          rating: 6, // Invalid: too high
          testimonial: 'Great product!',
        })
      ).rejects.toThrow()

      // Test rating too low
      await expect(
        Testimonial.create({
          userId: testUser._id,
          projectId: testProject._id,
          name: 'John Doe',
          email: 'john@example.com',
          rating: 0, // Invalid: too low
          testimonial: 'Great product!',
        })
      ).rejects.toThrow()
    })

    it('should convert email to lowercase', async () => {
      const testimonial = await Testimonial.create({
        userId: testUser._id,
        projectId: testProject._id,
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        rating: 5,
        testimonial: 'Great product!',
      })

      expect(testimonial.email).toBe('john@example.com')
    })

    it('should enforce name max length', async () => {
      const longName = 'A'.repeat(101)

      await expect(
        Testimonial.create({
          userId: testUser._id,
          projectId: testProject._id,
          name: longName,
          email: 'john@example.com',
          rating: 5,
          testimonial: 'Great product!',
        })
      ).rejects.toThrow()
    })

    it('should enforce testimonial max length', async () => {
      const longTestimonial = 'A'.repeat(1001)

      await expect(
        Testimonial.create({
          userId: testUser._id,
          projectId: testProject._id,
          name: 'John Doe',
          email: 'john@example.com',
          rating: 5,
          testimonial: longTestimonial,
        })
      ).rejects.toThrow()
    })

    it('should set default status to pending', async () => {
      const testimonial = await Testimonial.create({
        userId: testUser._id,
        projectId: testProject._id,
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        testimonial: 'Great product!',
      })

      expect(testimonial.status).toBe('pending')
    })

    it('should allow valid status values', async () => {
      const statuses = ['pending', 'approved', 'rejected']

      for (const status of statuses) {
        const testimonial = await Testimonial.create({
          userId: testUser._id,
          projectId: testProject._id,
          name: 'John Doe',
          email: 'john@example.com',
          rating: 5,
          testimonial: 'Great product!',
          status,
        })

        expect(testimonial.status).toBe(status)
        await Testimonial.deleteOne({ _id: testimonial._id })
      }
    })

    it('should set featured to false by default', async () => {
      const testimonial = await Testimonial.create({
        userId: testUser._id,
        projectId: testProject._id,
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        testimonial: 'Great product!',
      })

      expect(testimonial.featured).toBe(false)
    })

    it('should accept optional fields', async () => {
      const testimonial = await Testimonial.create({
        userId: testUser._id,
        projectId: testProject._id,
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        position: 'CEO',
        rating: 5,
        testimonial: 'Great product!',
        photo: 'https://example.com/photo.jpg',
        video: 'https://example.com/video.mp4',
      })

      expect(testimonial.company).toBe('Acme Corp')
      expect(testimonial.position).toBe('CEO')
      expect(testimonial.photo).toBe('https://example.com/photo.jpg')
      expect(testimonial.video).toBe('https://example.com/video.mp4')
    })
  })
})
