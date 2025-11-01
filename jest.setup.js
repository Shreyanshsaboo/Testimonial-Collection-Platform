import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream } from 'stream/web'

// Polyfill Web APIs for Node environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream

// Polyfill Request and Response for Next.js API routes
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = input
      this.method = init.method || 'GET'
      this.headers = new Map(Object.entries(init.headers || {}))
      this.body = init.body
      this._bodyInit = init.body
    }

    async json() {
      if (typeof this._bodyInit === 'string') {
        return JSON.parse(this._bodyInit)
      }
      return this._bodyInit
    }

    async text() {
      return this._bodyInit || ''
    }
  }
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || ''
      this.headers = new Map(Object.entries(init.headers || {}))
    }

    async json() {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body)
      }
      return this.body
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    }
  }
}

import '@testing-library/jest-dom'

// Mock nanoid to avoid ESM issues and generate unique IDs
let nanoidCounter = 0
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => {
    nanoidCounter++
    return `test${nanoidCounter.toString().padStart(6, '0')}`
  }),
}))

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock NextAuth
jest.mock('next-auth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      const handler = jest.fn()
      return handler
    }),
    getServerSession: jest.fn(),
  }
})

// Mock NextAuth route to avoid initialization issues
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
  GET: jest.fn(),
  POST: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Suppress console errors in tests unless explicitly needed
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})
