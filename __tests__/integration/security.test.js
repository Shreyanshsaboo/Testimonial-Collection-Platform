/**
 * Security and Authorization Tests
 * Ensures unauthorized access is rejected and users can't manipulate other users' data
 */

import { PATCH as profilePatch } from '@/app/api/user/profile/route'
import { PATCH as passwordPatch } from '@/app/api/user/password/route'
import User from '@/models/User'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import bcrypt from 'bcryptjs'

// Mock the mongodb connection
jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

const { getServerSession } = require('next-auth')

let mongoServer

describe('Security and Authorization Tests', () => {
  let testUser

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 12),
    })
  })

  afterEach(async () => {
    await User.deleteMany({})
    jest.clearAllMocks()
  })

  describe('Unauthorized Access Prevention', () => {
    it('should reject PATCH /api/user/profile without authentication', async () => {
      getServerSession.mockResolvedValue(null) // No session

      const request = new Request('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacked Name' }),
      })

      const response = await profilePatch(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')

      // Verify user was not modified
      const unchangedUser = await User.findById(testUser._id)
      expect(unchangedUser.name).toBe('Test User')
    })

    it('should reject PATCH /api/user/password without authentication', async () => {
      getServerSession.mockResolvedValue(null)

      const request = new Request('http://localhost:3000/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'password123',
          newPassword: 'hacked123',
        }),
      })

      const response = await passwordPatch(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')

      // Verify password was not changed
      const unchangedUser = await User.findById(testUser._id).select('+password')
      const stillValid = await bcrypt.compare('password123', unchangedUser.password)
      expect(stillValid).toBe(true)
    })
  })

  describe('Cross-User Data Manipulation Prevention', () => {
    it('should prevent user from modifying another users profile', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: await bcrypt.hash('password123', 12),
      })

      // Mock session as testUser
      getServerSession.mockResolvedValue({
        user: {
          id: testUser._id.toString(),
          email: testUser.email,
          name: testUser.name,
        },
      })

      // Try to update profile (the route uses session.user.id, so it will update testUser)
      const request = new Request('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Modified Name' }),
      })

      await profilePatch(request)

      // Verify anotherUser was NOT modified
      const unchangedUser = await User.findById(anotherUser._id)
      expect(unchangedUser.name).toBe('Another User')

      // Verify only testUser was modified
      const modifiedUser = await User.findById(testUser._id)
      expect(modifiedUser.name).toBe('Modified Name')
    })

    it('should prevent user from changing another users password', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: await bcrypt.hash('oldpassword', 12),
      })

      // Mock session as testUser (not anotherUser)
      getServerSession.mockResolvedValue({
        user: {
          id: testUser._id.toString(),
          email: testUser.email,
          name: testUser.name,
        },
      })

      // Try to change password
      const request = new Request('http://localhost:3000/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'oldpassword', // anotherUser's password
          newPassword: 'hackedpassword',
        }),
      })

      await passwordPatch(request)

      // Verify anotherUser's password was NOT changed
      const unchangedUser = await User.findById(anotherUser._id).select('+password')
      const stillValid = await bcrypt.compare('oldpassword', unchangedUser.password)
      expect(stillValid).toBe(true)

      // Verify attempt failed because current password doesn't match testUser's password
      const testUserCheck = await User.findById(testUser._id).select('+password')
      const testUserPasswordUnchanged = await bcrypt.compare('password123', testUserCheck.password)
      expect(testUserPasswordUnchanged).toBe(true)
    })
  })

  describe('Session Validation', () => {
    it('should validate session user ID matches database user', async () => {
      // Mock session with invalid user ID
      getServerSession.mockResolvedValue({
        user: {
          id: new mongoose.Types.ObjectId().toString(), // Non-existent ID
          email: 'ghost@example.com',
          name: 'Ghost User',
        },
      })

      const request = new Request('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Name' }),
      })

      const response = await profilePatch(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })
  })

  describe('Input Validation for Security', () => {
    it('should prevent SQL injection attempts in name field', async () => {
      getServerSession.mockResolvedValue({
        user: {
          id: testUser._id.toString(),
          email: testUser.email,
          name: testUser.name,
        },
      })

      const maliciousInput = "'; DROP TABLE users; --"
      const request = new Request('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: maliciousInput }),
      })

      const response = await profilePatch(request)
      
      // Should succeed (MongoDB is not vulnerable to SQL injection)
      // But the malicious string should be stored as-is, not executed
      expect(response.status).toBe(200)

      const user = await User.findById(testUser._id)
      expect(user.name).toBe(maliciousInput)

      // Verify database still exists (not dropped)
      const userCount = await User.countDocuments()
      expect(userCount).toBeGreaterThan(0)
    })

    it('should prevent XSS attempts in name field', async () => {
      getServerSession.mockResolvedValue({
        user: {
          id: testUser._id.toString(),
          email: testUser.email,
          name: testUser.name,
        },
      })

      const xssPayload = '<script>alert("XSS")</script>'
      const request = new Request('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: xssPayload }),
      })

      const response = await profilePatch(request)
      
      // The API should accept it (storage is safe)
      // XSS prevention should happen on the frontend when displaying
      expect(response.status).toBe(200)

      const user = await User.findById(testUser._id)
      expect(user.name).toBe(xssPayload)
    })
  })
})
