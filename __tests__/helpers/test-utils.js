/**
 * Test helpers for setting up test environment
 */

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

/**
 * Connect to in-memory MongoDB for testing
 */
export async function connectTestDB() {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
}

/**
 * Disconnect and stop MongoDB server
 */
export async function disconnectTestDB() {
  await mongoose.disconnect()
  if (mongoServer) {
    await mongoServer.stop()
  }
}

/**
 * Clear all collections in the database
 */
export async function clearTestDB() {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}
export function createMockRequest(url, method = 'GET', body = null) {
  const request = new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }),
  })
  return request
}

/**
 * Create a test user with hashed password
 */
export async function createTestUser(userData = {}) {
  const bcrypt = require('bcryptjs')
  const User = require('@/models/User').default
  
  const defaultData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
  }
  
  const mergedData = { ...defaultData, ...userData }
  
  // Hash password if provided
  if (mergedData.password) {
    mergedData.password = await bcrypt.hash(mergedData.password, 12)
  }
  
  return await User.create(mergedData)
}

/**
 * Create a test project
 */
export async function createTestProject(userId, projectData = {}) {
  const Project = require('@/models/Project').default
  
  const defaultData = {
    userId,
    name: 'Test Project With At Least Five Words',
    description: 'Test project description',
  }
  
  const mergedData = { ...defaultData, ...projectData }
  
  return await Project.create(mergedData)
}

/**
 * Create a test testimonial
 */
export async function createTestTestimonial(userId, projectId, testimonialData = {}) {
  const Testimonial = require('@/models/Testimonial').default
  
  const defaultData = {
    userId,
    projectId,
    name: 'John Doe',
    email: 'john@example.com',
    rating: 5,
    testimonial: 'This is a great product!',
  }
  
  const mergedData = { ...defaultData, ...testimonialData }
  
  return await Testimonial.create(mergedData)
}
