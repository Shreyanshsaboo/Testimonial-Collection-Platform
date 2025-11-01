import { test, expect } from '@playwright/test'

test.describe('Submit Testimonial E2E', () => {
  let shareLink

  test.beforeEach(async ({ page }) => {
    // Create a user and project to get a share link
    const timestamp = Date.now()
    const testEmail = `projowner${timestamp}@example.com`

    // Sign up
    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Project Owner')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Create a new project
    await page.goto('/dashboard/projects/new')
    await page.fill('input[name="name"], input[placeholder*="project name" i]', 'Test Project For Collecting Testimonials Today')
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'A test project')
    await page.click('button[type="submit"]:has-text(/create|save/i)')
    
    // Wait for redirect to project page
    await page.waitForURL(/\/dashboard\/projects\/[^/]+/, { timeout: 10000 })

    // Get the share link from the page
    const shareLinkElement = page.locator('text=/submit|share|public/i').first()
    if (await shareLinkElement.isVisible()) {
      await shareLinkElement.click()
    }

    // Find the actual share URL
    const urlPattern = /\/submit\/[a-zA-Z0-9]+/
    const shareUrl = await page.locator(`a[href*="/submit/"]`).first().getAttribute('href')
    shareLink = shareUrl || '/submit/test123' // Fallback for testing
  })

  test('Scenario: Submit testimonial successfully', async ({ page, context }) => {
    // Given I open a projects public share link
    await context.clearCookies() // Submit as anonymous user
    await page.goto(shareLink)

    // When I enter valid data
    await page.fill('input[name="name"]', 'Chandra Kumar')
    await page.fill('input[name="email"]', 'chandra@example.com')
    
    // Select rating
    const rating5 = page.locator('button[data-rating="5"], input[value="5"], label:has-text("5")').first()
    if (await rating5.isVisible()) {
      await rating5.click()
    }

    // Enter testimonial
    await page.fill(
      'textarea[name="testimonial"], textarea[placeholder*="testimonial" i], textarea[placeholder*="feedback" i]',
      'This is an excellent product that has helped our team immensely!'
    )

    // Submit
    await page.click('button[type="submit"]:has-text(/submit|send/i)')

    // Then I should see success message
    await expect(
      page.locator('text=/thank you|success|submitted/i')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Scenario: Submit testimonial with invalid description', async ({ page, context }) => {
    // Given I open a projects public share link
    await context.clearCookies()
    await page.goto(shareLink)

    // When I enter name "Chandra" and description "ok" and submit
    await page.fill('input[name="name"]', 'Chandra')
    await page.fill('input[name="email"]', 'chandra@example.com')
    
    const rating5 = page.locator('button[data-rating="5"], input[value="5"], label:has-text("5")').first()
    if (await rating5.isVisible()) {
      await rating5.click()
    }

    await page.fill(
      'textarea[name="testimonial"], textarea[placeholder*="testimonial" i]',
      'ok' // Too short
    )

    // Trigger blur to show validation
    await page.click('input[name="name"]')

    // Then I should see error
    const errorMessage = page.locator('text=/must be at least|too short|minimum.*characters/i')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })

    // Try to submit
    await page.click('button[type="submit"]:has-text(/submit|send/i)')

    // And no testimonial should be created (we stay on the same page)
    await expect(page).toHaveURL(shareLink)
  })

  test('Scenario: Submit testimonial with invalid name', async ({ page, context }) => {
    // Given I open share link
    await context.clearCookies()
    await page.goto(shareLink)

    // When I enter invalid name
    await page.fill('input[name="name"]', 'John123')
    await page.fill('input[name="email"]', 'john@example.com')

    // Trigger validation
    await page.click('input[name="email"]')

    // Then I should see error
    await expect(
      page.locator('text=/Name cannot contain numbers or special characters/i')
    ).toBeVisible({ timeout: 5000 })
  })
})
