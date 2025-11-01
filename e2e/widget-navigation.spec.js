import { test, expect } from '@playwright/test'

test.describe('Widget Design Navigation E2E', () => {
  let projectId

  test.beforeEach(async ({ page }) => {
    // Create a user and project
    const timestamp = Date.now()
    const testEmail = `widget${timestamp}@example.com`

    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Widget Test User')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Create project
    await page.goto('/dashboard/projects/new')
    await page.fill('input[name="name"]', 'Widget Design Test Project Name Here')
    await page.click('button[type="submit"]:has-text(/create|save/i)')
    await page.waitForURL(/\/dashboard\/projects\/([^/]+)/, { timeout: 10000 })

    // Extract project ID from URL
    const url = page.url()
    const match = url.match(/\/dashboard\/projects\/([^/]+)/)
    projectId = match ? match[1] : null
  })

  test('Scenario: Clicking "Customize" opens Widget Design tab', async ({ page }) => {
    // Given I am on a projects embed page
    await page.goto(`/dashboard/projects/${projectId}/embed`)

    // When I click "Customize" button/link
    const customizeButton = page.locator('a:has-text("Customize"), button:has-text("Customize")').first()
    
    // Verify it includes ?tab=widget in href
    if (await customizeButton.getAttribute('href')) {
      const href = await customizeButton.getAttribute('href')
      expect(href).toContain('tab=widget')
    }

    await customizeButton.click()

    // Then I am taken to settings with widget tab active
    await expect(page).toHaveURL(/\/dashboard\/projects\/.*\/settings\?tab=widget/)

    // And the "Widget Design" tab is visible and active
    const widgetTab = page.locator('text=/widget design|widget|customize/i')
    await expect(widgetTab).toBeVisible()
  })

  test('Scenario: Clicking "Widget settings" opens Widget Design tab', async ({ page }) => {
    // Given I am on a projects embed page
    await page.goto(`/dashboard/projects/${projectId}/embed`)

    // When I click "Widget settings" link
    const widgetSettingsLink = page.locator('a:has-text(/widget settings/i), button:has-text(/widget settings/i)').first()
    
    // Verify it includes ?tab=widget
    if (await widgetSettingsLink.getAttribute('href')) {
      const href = await widgetSettingsLink.getAttribute('href')
      expect(href).toContain('tab=widget')
    }

    await widgetSettingsLink.click()

    // Then I am taken to settings with widget tab
    await expect(page).toHaveURL(/\/dashboard\/projects\/.*\/settings\?tab=widget/)

    // And the widget tab is active
    const widgetTab = page.locator('[data-state="active"]:has-text(/widget/i), .active:has-text(/widget/i)')
    await expect(widgetTab).toBeVisible({ timeout: 5000 })
  })

  test('Scenario: Widget tab loads correctly with query parameter', async ({ page }) => {
    // Given I navigate directly with ?tab=widget
    await page.goto(`/dashboard/projects/${projectId}/settings?tab=widget`)

    // Then the Widget Design tab is active
    const activeTab = page.locator('[data-state="active"]:has-text(/widget/i), .active:has-text(/widget/i), [aria-selected="true"]:has-text(/widget/i)')
    await expect(activeTab).toBeVisible()

    // And widget customization options are visible
    const widgetOptions = page.locator('text=/layout|theme|color|primary/i').first()
    await expect(widgetOptions).toBeVisible({ timeout: 5000 })
  })
})
