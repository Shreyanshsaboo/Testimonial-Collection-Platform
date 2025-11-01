import { test, expect } from '@playwright/test'

test.describe('User Authentication E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/')
  })

  test('Scenario: User signs up successfully', async ({ page }) => {
    // Given I am on the signup page
    await page.goto('/auth/signup')

    // When I enter valid credentials
    const timestamp = Date.now()
    const testEmail = `alice${timestamp}@example.com`
    
    await page.fill('input[name="name"]', 'Alice Example')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'P@ssw0rd!')

    // And I click "Sign up"
    await page.click('button[type="submit"]')

    // Then I should be redirected to /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })

    // And I should see a welcome or success message
    await expect(page.locator('body')).toContainText(/dashboard|welcome|projects/i)
  })

  test('Scenario: User cannot sign up with invalid name', async ({ page }) => {
    // Given I am on the signup page
    await page.goto('/auth/signup')

    // When I enter name with numbers
    await page.fill('input[name="name"]', 'Bob123')
    await page.fill('input[name="email"]', 'bob@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Trigger validation (blur event)
    await page.click('input[name="email"]')

    // Then I should see an inline error
    const errorMessage = await page.locator('text=/Name cannot contain numbers or special characters/i')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })

    // And the signup request should not be sent (button should be disabled or form invalid)
    const submitButton = page.locator('button[type="submit"]')
    // The button might be disabled or clicking it should not proceed
    await submitButton.click()
    
    // Verify we're still on signup page (not redirected)
    await expect(page).toHaveURL(/\/auth\/signup/)
  })

  test('Scenario: User signs in and sees their dashboard', async ({ page, context }) => {
    // Given a user exists (we'll use signup to create one)
    const timestamp = Date.now()
    const testEmail = `test${timestamp}@example.com`
    const testPassword = 'P@ssw0rd!'

    // Create user via signup
    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Sign out
    const signOutButton = page.locator('text=/sign out|logout/i').first()
    if (await signOutButton.isVisible()) {
      await signOutButton.click()
    } else {
      // Clear cookies manually
      await context.clearCookies()
      await page.goto('/')
    }

    // When I sign in with those credentials
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Then I should be redirected to /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })

    // And my session should be active (verify by checking for user-specific content)
    await expect(page.locator('body')).toContainText(/dashboard|projects/i)
  })

  test('Scenario: User cannot sign in with wrong password', async ({ page }) => {
    // Given a user exists
    const timestamp = Date.now()
    const testEmail = `test${timestamp}@example.com`

    // Create user via signup
    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'CorrectPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Sign out
    await page.goto('/auth/signin')

    // When I try to sign in with wrong password
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'WrongPassword!')
    await page.click('button[type="submit"]')

    // Then I should see an error message
    await expect(page.locator('text=/invalid|incorrect|wrong/i')).toBeVisible({ timeout: 5000 })

    // And I should remain on the signin page
    await expect(page).toHaveURL(/\/auth\/signin/)
  })
})
