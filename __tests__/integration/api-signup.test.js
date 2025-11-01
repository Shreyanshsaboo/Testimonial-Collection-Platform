/**
 * Integration tests for signup API endpoint
 * Test file: app/api/auth/signup/route.js
 */

import { POST } from '@/app/api/auth/signup/route'
import User from '@/models/User'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import bcrypt from 'bcryptjs'

let mongoServer

// Mock the mongodb connection to use our test database
jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

describe('POST /api/auth/signup', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await User.deleteMany({})
  })

  it('should create a new user with valid data', async () => {
    const validData = {
      name: 'Alice Example',
      email: 'alice@example.com',
      password: 'P@ssw0rd!',
    }

    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe(validData.email)
    expect(data.user.name).toBe(validData.name)
    expect(data.user.password).toBeUndefined() // Should not return password

    // Verify user exists in database
    const userInDb = await User.findOne({ email: validData.email }).select('+password')
    expect(userInDb).toBeTruthy()
    
    // Verify password is hashed
    expect(userInDb.password).not.toBe(validData.password)
    const isPasswordMatch = await bcrypt.compare(validData.password, userInDb.password)
    expect(isPasswordMatch).toBe(true)
  })

  it('should return 400 for duplicate email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'duplicate@example.com',
      password: 'password123',
    }

    // Create first user
    await User.create({
      ...userData,
      password: await bcrypt.hash(userData.password, 12),
    })

    // Attempt to create second user with same email
    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('already exists')
  })

  it('should return 400 for invalid name with numbers', async () => {
    const invalidData = {
      name: 'Bob123',
      email: 'bob@example.com',
      password: 'password123',
    }

    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details).toBeDefined()
    expect(data.details[0].message).toBe('Name cannot contain numbers or special characters')
  })

  it('should return 400 for invalid email', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
    }

    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
  })

  it('should return 400 for short password', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345', // Only 5 characters
    }

    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details[0].message).toBe('Password must be at least 6 characters')
  })

  it('should trim and validate name', async () => {
    const validData = {
      name: '  José Álvarez  ',
      email: 'jose@example.com',
      password: 'password123',
    }

    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user.name).toBe('José Álvarez')
  })

  it('should accept optional company field', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      company: 'Acme Corp',
    }

    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user.company).toBe('Acme Corp')
  })

  it('should return 400 for missing required fields', async () => {
    const invalidData = {
      email: 'test@example.com',
      // Missing name and password
    }

    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
  })
})
