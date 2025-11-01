import { test, expect } from '@playwright/test'

test.describe('Password Change E2E', () => {
  let testEmail
  let testPassword = 'OldPassword123!'

  test.beforeEach(async ({ page }) => {
    // Create a unique test user for each test
    const timestamp = Date.now()
    testEmail = `pwdtest${timestamp}@example.com`

    // Sign up
    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Password Test User')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
  })

  test('Scenario: Change password successfully', async ({ page, context }) => {
    // Given I am authenticated as user X
    // When I navigate to settings -> change password
    await page.goto('/dashboard/settings')
    
    // Look for password/security section or tab
    const passwordLink = page.locator('text=/password|security/i').first()
    if (await passwordLink.isVisible()) {
      await passwordLink.click()
    }

    // And I enter current password and new password
    const newPassword = 'NewPassword456!'
    await page.fill('input[name="currentPassword"], input[placeholder*="current" i]', testPassword)
    await page.fill('input[name="newPassword"], input[placeholder*="new" i]', newPassword)
    
    // Confirm new password if there's a confirm field
    const confirmField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]')
    if (await confirmField.isVisible()) {
      await confirmField.fill(newPassword)
    }

    // Submit the form
    await page.click('button[type="submit"]:has-text(/save|change|update/i)')

    // Then the server should return success
    await expect(page.locator('text=/success|updated|changed/i')).toBeVisible({ timeout: 5000 })

    // Sign out
    await context.clearCookies()
    await page.goto('/auth/signin')

    // And I should be able to sign in with new password
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', newPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })

    // And not with old password
    await context.clearCookies()
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await expect(page.locator('text=/invalid|incorrect|wrong/i')).toBeVisible({ timeout: 5000 })
  })

  test('Scenario: Change password rejects identical password', async ({ page }) => {
    // Given I am authenticated as user X
    // When I navigate to settings
    await page.goto('/dashboard/settings')

    // Look for password section
    const passwordLink = page.locator('text=/password|security/i').first()
    if (await passwordLink.isVisible()) {
      await passwordLink.click()
    }

    // When I enter the current password and the same string as new password
    await page.fill('input[name="currentPassword"], input[placeholder*="current" i]', testPassword)
    await page.fill('input[name="newPassword"], input[placeholder*="new" i]', testPassword)

    // Submit
    await page.click('button[type="submit"]:has-text(/save|change|update/i)')

    // Then I receive an error
    await expect(
      page.locator('text=/must be different|cannot be the same/i')
    ).toBeVisible({ timeout: 5000 })
  })

  test('Scenario: Change password with incorrect current password', async ({ page }) => {
    // Given I am authenticated
    await page.goto('/dashboard/settings')

    // Look for password section
    const passwordLink = page.locator('text=/password|security/i').first()
    if (await passwordLink.isVisible()) {
      await passwordLink.click()
    }

    // When I enter wrong current password
    await page.fill('input[name="currentPassword"], input[placeholder*="current" i]', 'WrongPassword!')
    await page.fill('input[name="newPassword"], input[placeholder*="new" i]', 'NewPassword456!')

    // Submit
    await page.click('button[type="submit"]:has-text(/save|change|update/i)')

    // Then I see an error
    await expect(
      page.locator('text=/incorrect|invalid|wrong.*current/i')
    ).toBeVisible({ timeout: 5000 })
  })
})
