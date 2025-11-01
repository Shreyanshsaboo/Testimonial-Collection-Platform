# Testing Guide

This document provides comprehensive information about running tests in the Testimonial Collection Platform.

> **📋 For Complete Testing Strategy:** See [TESTING_STRATEGY.md](./docs/TESTING_STRATEGY.md) for comprehensive TDD/BDD approach, detailed test cases with inputs/outputs, and coverage metrics.

## Test Coverage Goals

- **Unit Tests**: 70–85% coverage across utility functions and components
- **Integration Tests**: 80–95% on API routes (critical flows 95–100%)
- **E2E Tests**: Cover 6–10 critical user journeys
- **Overall Target**: 85%+ combined coverage, 100% coverage on security-critical paths

## Testing Philosophy

This project follows **Test-Driven Development (TDD)** and **Behavior-Driven Development (BDD)** principles:

### TDD: Red-Green-Refactor
1. **RED**: Write failing test first
2. **GREEN**: Write minimal code to pass
3. **REFACTOR**: Improve while keeping tests green

### BDD: Given-When-Then
- **Given**: Initial context
- **When**: Action taken
- **Then**: Expected outcome

## Test Structure

```
__tests__/
├── unit/                    # Unit tests for pure functions
│   ├── schemas.test.js      # Validation schema tests
│   └── utils.test.js        # Utility function tests
├── integration/             # Integration tests for API routes
│   ├── api-signup.test.js   # Signup endpoint tests
│   ├── api-password.test.js # Password change tests
│   ├── api-profile.test.js  # Profile update tests
│   ├── user-model.test.js   # User model tests
│   ├── models-validation.test.js  # Model validation tests
│   └── security.test.js     # Security & authorization tests
└── helpers/
    └── test-utils.js        # Test helper functions

e2e/                         # End-to-end tests with Playwright
├── auth.spec.js             # Authentication flows
├── password-change.spec.js  # Password change flows
├── submit-testimonial.spec.js  # Testimonial submission
├── widget-navigation.spec.js   # Widget design navigation
├── analytics.spec.js        # Analytics views
└── profile-update.spec.js   # Profile management
```

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
# Run all unit and integration tests with coverage
npm test

# Run tests in watch mode (for development)
npm run test:watch
```

### Run Specific Test Suites

```bash
# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Run Specific Test Files

```bash
# Run a specific test file
npx jest __tests__/unit/schemas.test.js

# Run tests matching a pattern
npx jest --testPathPattern=password

# Run a specific E2E test
npx playwright test e2e/auth.spec.js
```

## Test Coverage

### View Coverage Report

After running `npm test`, open the coverage report:

```bash
# Open HTML coverage report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

The project enforces minimum coverage thresholds:
- Branches: 85%
- Functions: 85%
- Lines: 85%
- Statements: 85%

## Test Categories

### Unit Tests

Test individual functions and schemas in isolation:
- ✅ Name validation (Unicode support, no numbers/special chars)
- ✅ Email validation
- ✅ Password validation
- ✅ Testimonial description validation
- ✅ Project name validation (5+ words)
- ✅ Utility functions (className merger, etc.)

### Integration Tests

Test API routes and database interactions:
- ✅ User signup with duplicate email detection
- ✅ Password hashing in User model
- ✅ Password change with current password verification
- ✅ Profile updates (name only, email protection)
- ✅ Security: unauthorized access prevention
- ✅ Security: cross-user data manipulation prevention
- ✅ Model validations (Project, Testimonial)

### E2E Tests

Test complete user flows in the browser:
- ✅ User signup and authentication
- ✅ Sign in and session management
- ✅ Submit testimonial with validation
- ✅ Change password successfully
- ✅ Widget design navigation
- ✅ Analytics view and filtering
- ✅ Profile management

## Critical Security Tests (100% Coverage Required)

These paths must have complete test coverage:

1. **Authentication**
   - Signup validation
   - Password hashing
   - Session management

2. **Password Change**
   - Current password verification
   - New password different from current
   - Unauthorized access prevention

3. **Authorization**
   - Authenticated endpoints reject unauthenticated requests
   - Users cannot modify other users' data
   - Session validation

## Writing New Tests

### Unit Test Template

```javascript
import { functionToTest } from '@/lib/your-file'

describe('FunctionName', () => {
  it('should handle valid input', () => {
    const result = functionToTest('valid input')
    expect(result).toBe('expected output')
  })

  it('should handle invalid input', () => {
    expect(() => functionToTest('invalid')).toThrow()
  })
})
```

### Integration Test Template

```javascript
import { POST } from '@/app/api/your-route/route'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

describe('POST /api/your-route', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  it('should handle valid request', async () => {
    const request = new Request('http://localhost:3000/api/your-route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### E2E Test Template

```javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should complete user flow', async ({ page }) => {
    await page.goto('/your-page')
    await page.fill('input[name="field"]', 'value')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/expected-url/)
  })
})
```

## Debugging Tests

### Debug Unit/Integration Tests

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Use console.log in tests (will be visible in output)
```

### Debug E2E Tests

```bash
# Run with headed browser
npx playwright test --headed

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in debug mode
npx playwright test --debug
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Before deployments

CI Configuration:
- Runs all unit and integration tests
- Generates coverage reports
- Runs E2E tests in headless mode
- Fails build if coverage drops below thresholds

## Test Data Management

### In-Memory Database

Integration tests use MongoDB Memory Server:
- No external MongoDB instance required
- Fast test execution
- Isolated test environment
- Automatic cleanup between tests

### Test User Creation

Use helper functions for consistency:

```javascript
import { createTestUser } from '@/tests/helpers/test-utils'

const user = await createTestUser({
  name: 'Test User',
  email: 'test@example.com',
})
```

## Common Issues

### Tests Failing Locally

1. **MongoDB Connection**: Ensure no MongoDB instance is interfering
2. **Port Conflicts**: Check if port 3000 is available for E2E tests
3. **Environment Variables**: Check `.env.local` is properly configured
4. **Dependencies**: Run `npm install` to ensure all deps are installed

### E2E Tests Timeout

- Increase timeout in `playwright.config.js`
- Check if dev server starts successfully
- Verify network connections

### Coverage Not Meeting Threshold

- Run `npm test` to see which files need coverage
- Focus on critical paths first (auth, security)
- Add tests for uncovered branches

## Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested
2. **Isolation**: Each test should be independent
3. **Setup/Teardown**: Clean up database between tests
4. **Mock External Services**: Don't call real APIs in tests
5. **Async/Await**: Always use async/await for database operations
6. **Assertions**: Use specific assertions (toBe, toContain, etc.)
7. **Coverage**: Aim for meaningful tests, not just coverage numbers

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
