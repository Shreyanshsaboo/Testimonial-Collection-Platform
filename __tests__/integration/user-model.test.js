import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

describe('User Model', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    // Clean up database between tests
    await User.deleteMany({})
  })

  describe('Password handling', () => {
    it('should store hashed password when created with pre-hashed password', async () => {
      const plainPassword = 'MySecurePassword123!'
      const hashedPassword = await bcrypt.hash(plainPassword, 12)
      
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      })

      // Password in DB should be the hash we provided
      const userFromDb = await User.findById(user._id).select('+password')
      expect(userFromDb.password).toBe(hashedPassword)
      
      // And bcrypt.compare should return true
      const isMatch = await bcrypt.compare(plainPassword, userFromDb.password)
      expect(isMatch).toBe(true)
    })

    it('should not re-hash password if not modified', async () => {
      const hashedPassword = await bcrypt.hash('MySecurePassword123!', 12)
      
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      })

      const originalHash = user.password

      // Update other field
      user.name = 'Updated Name'
      await user.save()

      // Password hash should remain the same
      const updatedUser = await User.findById(user._id).select('+password')
      expect(updatedUser.password).toBe(originalHash)
    })

    it('should update password when password field is changed', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('OldPassword123!', 12),
      })

      const userWithPassword = await User.findById(user._id).select('+password')
      const originalHash = userWithPassword.password

      // Change password
      const newPassword = 'NewPassword456!'
      userWithPassword.password = await bcrypt.hash(newPassword, 12)
      await userWithPassword.save()

      // Password hash should be different
      const updatedUser = await User.findById(user._id).select('+password')
      expect(updatedUser.password).not.toBe(originalHash)
      
      // New password should match
      const isMatch = await bcrypt.compare(newPassword, updatedUser.password)
      expect(isMatch).toBe(true)
    })
  })

  describe('User validation', () => {
    it('should create user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const user = await User.create(userData)

      expect(user.name).toBe(userData.name)
      expect(user.email).toBe(userData.email.toLowerCase())
      expect(user.plan).toBe('free') // Default plan
    })

    it('should enforce unique email constraint', async () => {
      const email = 'duplicate@example.com'

      await User.create({
        name: 'User One',
        email: email,
        password: 'password123',
      })

      // Attempt to create another user with same email
      await expect(
        User.create({
          name: 'User Two',
          email: email,
          password: 'password456',
        })
      ).rejects.toThrow()
    })

    it('should require name field', async () => {
      await expect(
        User.create({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow()
    })

    it('should require email field', async () => {
      await expect(
        User.create({
          name: 'Test User',
          password: 'password123',
        })
      ).rejects.toThrow()
    })

    it('should require password field', async () => {
      await expect(
        User.create({
          name: 'Test User',
          email: 'test@example.com',
        })
      ).rejects.toThrow()
    })

    it('should convert email to lowercase', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      })

      expect(user.email).toBe('test@example.com')
    })

    it('should validate email format', async () => {
      await expect(
        User.create({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        })
      ).rejects.toThrow()
    })

    it('should enforce name max length', async () => {
      const longName = 'A'.repeat(61)
      
      await expect(
        User.create({
          name: longName,
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow()
    })

    it('should enforce password min length', async () => {
      await expect(
        User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: '12345', // Only 5 characters
        })
      ).rejects.toThrow()
    })
  })

  describe('User defaults', () => {
    it('should set default notification settings', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(user.notificationSettings.emailOnNewTestimonial).toBe(true)
      expect(user.notificationSettings.emailOnApproval).toBe(false)
      expect(user.notificationSettings.emailWeeklyReport).toBe(true)
      expect(user.notificationSettings.emailMonthlyReport).toBe(false)
    })

    it('should set default plan to free', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(user.plan).toBe('free')
    })

    it('should set timestamps', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(user.createdAt).toBeDefined()
      expect(user.updatedAt).toBeDefined()
    })
  })

  describe('Password field selection', () => {
    it('should not return password by default', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      const user = await User.findOne({ email: 'test@example.com' })
      expect(user.password).toBeUndefined()
    })

    it('should return password when explicitly selected', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      const user = await User.findOne({ email: 'test@example.com' }).select('+password')
      expect(user.password).toBeDefined()
    })
  })
})
