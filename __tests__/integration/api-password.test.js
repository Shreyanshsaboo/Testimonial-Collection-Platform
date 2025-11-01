/**
 * Integration tests for password change API endpoint
 * Test file: app/api/user/password/route.js
 */

import { PATCH } from '@/app/api/user/password/route'
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

describe('PATCH /api/user/password', () => {
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
    // Create a test user
    const hashedPassword = await bcrypt.hash('OldPassword123!', 12)
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    })

    // Mock authenticated session
    getServerSession.mockResolvedValue({
      user: {
        id: testUser._id.toString(),
        email: testUser.email,
        name: testUser.name,
      },
    })
  })

  afterEach(async () => {
    await User.deleteMany({})
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    getServerSession.mockResolvedValue(null)

    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should successfully change password with valid credentials', async () => {
    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Password updated successfully')

    // Verify password was updated in database
    const updatedUser = await User.findById(testUser._id).select('+password')
    const isNewPasswordMatch = await bcrypt.compare('NewPassword456!', updatedUser.password)
    expect(isNewPasswordMatch).toBe(true)

    // Verify old password no longer works
    const isOldPasswordMatch = await bcrypt.compare('OldPassword123!', updatedUser.password)
    expect(isOldPasswordMatch).toBe(false)
  })

  it('should return 400 if current password is incorrect', async () => {
    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'WrongPassword!',
        newPassword: 'NewPassword456!',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Current password is incorrect')

    // Verify password was NOT changed
    const unchangedUser = await User.findById(testUser._id).select('+password')
    const isOldPasswordStillValid = await bcrypt.compare('OldPassword123!', unchangedUser.password)
    expect(isOldPasswordStillValid).toBe(true)
  })

  it('should return 400 if new password is same as current password', async () => {
    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'OldPassword123!',
        newPassword: 'OldPassword123!', // Same as current
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('New password must be different from the current password')
  })

  it('should return 400 if new password is too short', async () => {
    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'OldPassword123!',
        newPassword: '12345', // Only 5 characters
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('New password must be at least 6 characters')
  })

  it('should return 400 if currentPassword is missing', async () => {
    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newPassword: 'NewPassword456!',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Current and new password are required')
  })

  it('should return 400 if newPassword is missing', async () => {
    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'OldPassword123!',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Current and new password are required')
  })

  it('should return 404 if user is not found', async () => {
    // Mock session with non-existent user ID
    getServerSession.mockResolvedValue({
      user: {
        id: new mongoose.Types.ObjectId().toString(),
        email: 'nonexistent@example.com',
        name: 'Ghost User',
      },
    })

    const request = new Request('http://localhost:3000/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('User not found')
  })
})
