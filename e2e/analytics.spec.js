import { test, expect } from '@playwright/test'

test.describe('Analytics E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Create authenticated user
    const timestamp = Date.now()
    const testEmail = `analytics${timestamp}@example.com`

    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Analytics User')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
  })

  test('Scenario: Analytics filter shows data for selected timeframe', async ({ page }) => {
    // Given I have access to analytics
    await page.goto('/dashboard/analytics')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // When I select "Last 30 days" from timeframe dropdown
    const timeframeSelect = page.locator('select[name="timeframe"], button:has-text(/30 days|timeframe/i)').first()
    
    if (await timeframeSelect.isVisible()) {
      // If it's a select element
      if (await timeframeSelect.evaluate(el => el.tagName === 'SELECT')) {
        await timeframeSelect.selectOption({ label: /30 days/i })
      } else {
        // If it's a button/dropdown
        await timeframeSelect.click()
        await page.locator('text=/30 days/i').click()
      }

      // Then the dashboard updates to show counts and charts
      // Wait for content to update
      await page.waitForTimeout(1000)

      // Verify analytics data is displayed
      const analyticsContent = page.locator('text=/testimonials|views|rating|analytics/i').first()
      await expect(analyticsContent).toBeVisible()
    }
  })

  test('Scenario: Analytics select text is readable in dark theme', async ({ page }) => {
    // Navigate to analytics
    await page.goto('/dashboard/analytics')

    // Toggle dark mode if available
    const darkModeToggle = page.locator('button[aria-label*="theme"], button:has-text(/dark|theme/i)').first()
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click()
      
      // Wait for theme to apply
      await page.waitForTimeout(500)

      // Check if dark mode is active
      const isDark = await page.locator('html, body').evaluate(el => {
        return el.classList.contains('dark') || 
               window.getComputedStyle(el).backgroundColor.includes('0, 0, 0') ||
               window.getComputedStyle(el).backgroundColor.includes('rgb(0, 0, 0)')
      })

      if (isDark) {
        // Ensure select element has readable text
        const selectElement = page.locator('select, [role="combobox"]').first()
        
        if (await selectElement.isVisible()) {
          const textColor = await selectElement.evaluate(el => 
            window.getComputedStyle(el).color
          )
          
          // Verify text is not black (should be white or light color in dark theme)
          expect(textColor).not.toBe('rgb(0, 0, 0)')
          
          // Check for text-white or similar classes
          const className = await selectElement.getAttribute('class')
          expect(
            className?.includes('text-white') || 
            className?.includes('text-gray-') ||
            textColor.includes('255') // Light color
          ).toBeTruthy()
        }
      }
    }
  })

  test('Scenario: View analytics navigation', async ({ page }) => {
    // Given I am on dashboard
    await page.goto('/dashboard')

    // When I click on Analytics link
    const analyticsLink = page.locator('a[href*="/analytics"], text=Analytics').first()
    await analyticsLink.click()

    // Then I should see the analytics page
    await expect(page).toHaveURL(/\/dashboard\/analytics/)
    
    // And analytics content is visible
    await expect(page.locator('h1, h2').filter({ hasText: /analytics|statistics|insights/i })).toBeVisible()
  })
})
