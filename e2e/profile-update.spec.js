import { test, expect } from '@playwright/test'

test.describe('Profile Update E2E', () => {
  let testEmail

  test.beforeEach(async ({ page }) => {
    // Create authenticated user
    const timestamp = Date.now()
    testEmail = `profile${timestamp}@example.com`

    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Original Name')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
  })

  test('Scenario: Profile update does not allow email change via UI', async ({ page }) => {
    // Given I am authenticated and on the profile settings page
    await page.goto('/dashboard/settings')

    // Look for profile tab
    const profileTab = page.locator('text=/profile|account/i').first()
    if (await profileTab.isVisible() && await profileTab.getAttribute('role') === 'tab') {
      await profileTab.click()
    }

    // When I update my display name
    const nameInput = page.locator('input[name="name"]')
    await nameInput.fill('Updated Name')

    // Verify email field is not editable or not present in the form
    const emailInput = page.locator('input[name="email"]')
    
    if (await emailInput.isVisible()) {
      // If email field exists, it should be disabled or readonly
      const isDisabled = await emailInput.isDisabled()
      const isReadOnly = await emailInput.getAttribute('readonly')
      expect(isDisabled || isReadOnly !== null).toBeTruthy()
    }

    // Click Save
    await page.click('button[type="submit"]:has-text(/save|update/i)')

    // Then my email remains unchanged
    await expect(page.locator('text=/success|updated/i')).toBeVisible({ timeout: 5000 })

    // Verify email is still the same
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // The email should still be displayed but not changeable
    await expect(page.locator(`text=${testEmail}`)).toBeVisible()
  })

  test('Scenario: Profile name update succeeds', async ({ page }) => {
    // Navigate to settings
    await page.goto('/dashboard/settings')

    const profileTab = page.locator('text=/profile|account/i').first()
    if (await profileTab.isVisible() && await profileTab.getAttribute('role') === 'tab') {
      await profileTab.click()
    }

    // Update name
    const nameInput = page.locator('input[name="name"]')
    await nameInput.fill('My New Name')

    // Save
    await page.click('button[type="submit"]:has-text(/save|update/i)')

    // Verify success
    await expect(page.locator('text=/success|updated/i')).toBeVisible({ timeout: 5000 })

    // Verify name was updated
    await page.reload()
    const updatedNameInput = page.locator('input[name="name"]')
    await expect(updatedNameInput).toHaveValue('My New Name')
  })
})
