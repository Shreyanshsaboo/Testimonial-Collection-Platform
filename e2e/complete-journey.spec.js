import { test, expect } from '@playwright/test'

/**
 * Complete User Journey E2E Test
 * Tests the entire flow from signup to managing testimonials
 */

test.describe('Complete User Journey', () => {
  test('User signs up, creates project, collects testimonial, and views analytics', async ({ page, context }) => {
    const timestamp = Date.now()
    const userEmail = `journey${timestamp}@example.com`
    const projectName = 'Complete User Journey Test Project Today'

    // STEP 1: User signs up
    await test.step('Sign up new user', async () => {
      await page.goto('/auth/signup')
      await page.fill('input[name="name"]', 'Journey Test User')
      await page.fill('input[name="email"]', userEmail)
      await page.fill('input[name="password"]', 'SecurePass123!')
      await page.click('button[type="submit"]')
      
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
    })

    // STEP 2: Create a new project
    let projectId
    let shareLink

    await test.step('Create new project', async () => {
      await page.goto('/dashboard/projects/new')
      await page.fill('input[name="name"], input[placeholder*="project name" i]', projectName)
      await page.fill('textarea[name="description"]', 'A comprehensive test project for E2E testing')
      await page.click('button[type="submit"]:has-text(/create|save/i)')
      
      await page.waitForURL(/\/dashboard\/projects\/[^/]+/, { timeout: 10000 })
      
      // Extract project ID from URL
      const url = page.url()
      const match = url.match(/\/dashboard\/projects\/([^/]+)/)
      projectId = match ? match[1] : null
      expect(projectId).toBeTruthy()
    })

    // STEP 3: Get share link for testimonial collection
    await test.step('Get testimonial collection link', async () => {
      // Navigate to project details or embed page
      const shareButton = page.locator('text=/share|public link|embed/i').first()
      if (await shareButton.isVisible()) {
        await shareButton.click()
      } else {
        await page.goto(`/dashboard/projects/${projectId}/embed`)
      }

      // Get the share URL
      const shareUrlElement = page.locator('input[readonly], code, pre').filter({ hasText: /\/submit\// }).first()
      if (await shareUrlElement.isVisible()) {
        shareLink = await shareUrlElement.textContent()
        // Extract just the path if it's a full URL
        const match = shareLink.match(/\/submit\/[a-zA-Z0-9]+/)
        shareLink = match ? match[0] : shareLink
      } else {
        // Fallback: try to find link in href
        const linkElement = page.locator('a[href*="/submit/"]').first()
        shareLink = await linkElement.getAttribute('href')
      }

      expect(shareLink).toBeTruthy()
      expect(shareLink).toContain('/submit/')
    })

    // STEP 4: Submit a testimonial as anonymous user
    await test.step('Submit testimonial anonymously', async () => {
      // Clear cookies to simulate anonymous user
      await context.clearCookies()
      
      await page.goto(shareLink)
      
      // Fill testimonial form
      await page.fill('input[name="name"]', 'Happy Customer')
      await page.fill('input[name="email"]', 'customer@example.com')
      
      // Select 5-star rating
      const rating = page.locator('button[data-rating="5"], input[value="5"], label:has-text("5"), [aria-label*="5 star"]').first()
      if (await rating.isVisible()) {
        await rating.click()
      }
      
      // Write testimonial
      await page.fill(
        'textarea[name="testimonial"], textarea[placeholder*="testimonial" i]',
        'This is an amazing platform! It has helped our business collect valuable testimonials efficiently.'
      )
      
      // Submit
      await page.click('button[type="submit"]:has-text(/submit|send/i)')
      
      // Verify success message
      await expect(page.locator('text=/thank you|success|submitted/i')).toBeVisible({ timeout: 10000 })
    })

    // STEP 5: Sign back in as project owner
    await test.step('Sign back in', async () => {
      await page.goto('/auth/signin')
      await page.fill('input[name="email"]', userEmail)
      await page.fill('input[name="password"]', 'SecurePass123!')
      await page.click('button[type="submit"]')
      
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
    })

    // STEP 6: View testimonials
    await test.step('View collected testimonials', async () => {
      await page.goto('/dashboard/testimonials')
      
      // Should see the testimonial we submitted
      await expect(page.locator('text=/Happy Customer/i')).toBeVisible({ timeout: 5000 })
    })

    // STEP 7: Customize widget design
    await test.step('Customize widget design', async () => {
      await page.goto(`/dashboard/projects/${projectId}/settings?tab=widget`)
      
      // Widget customization options should be visible
      const widgetOptions = page.locator('text=/layout|theme|color/i').first()
      await expect(widgetOptions).toBeVisible()
      
      // Try to change a setting
      const layoutSelect = page.locator('select[name="layout"], button:has-text(/layout/i)').first()
      if (await layoutSelect.isVisible()) {
        await layoutSelect.click()
        const gridOption = page.locator('text=/grid/i').first()
        if (await gridOption.isVisible()) {
          await gridOption.click()
        }
      }
    })

    // STEP 8: View analytics
    await test.step('View analytics', async () => {
      await page.goto('/dashboard/analytics')
      
      // Analytics page should show data
      await expect(page.locator('h1, h2').filter({ hasText: /analytics/i })).toBeVisible()
      
      // Should see some metrics
      const metrics = page.locator('text=/testimonial|view|rating/i').first()
      await expect(metrics).toBeVisible()
    })

    // STEP 9: Update profile
    await test.step('Update user profile', async () => {
      await page.goto('/dashboard/settings')
      
      // Find profile tab if exists
      const profileTab = page.locator('text=/profile|account/i').first()
      if (await profileTab.isVisible() && await profileTab.getAttribute('role') === 'tab') {
        await profileTab.click()
      }
      
      // Update name
      const nameInput = page.locator('input[name="name"]')
      if (await nameInput.isVisible()) {
        await nameInput.fill('Updated Journey User')
        await page.click('button[type="submit"]:has-text(/save|update/i)')
        
        await expect(page.locator('text=/success|updated/i')).toBeVisible({ timeout: 5000 })
      }
    })

    // STEP 10: Change password
    await test.step('Change password', async () => {
      await page.goto('/dashboard/settings')
      
      // Find password section
      const passwordSection = page.locator('text=/password|security/i').first()
      if (await passwordSection.isVisible()) {
        await passwordSection.click()
        
        // Change password
        await page.fill('input[name="currentPassword"], input[placeholder*="current" i]', 'SecurePass123!')
        await page.fill('input[name="newPassword"], input[placeholder*="new" i]', 'NewSecurePass456!')
        
        const confirmField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]')
        if (await confirmField.isVisible()) {
          await confirmField.fill('NewSecurePass456!')
        }
        
        await page.click('button[type="submit"]:has-text(/save|change|update/i)')
        
        await expect(page.locator('text=/success|updated|changed/i')).toBeVisible({ timeout: 5000 })
      }
    })

    // STEP 11: Sign out and verify new password works
    await test.step('Verify new password works', async () => {
      // Sign out
      await context.clearCookies()
      await page.goto('/auth/signin')
      
      // Try to sign in with new password
      await page.fill('input[name="email"]', userEmail)
      await page.fill('input[name="password"]', 'NewSecurePass456!')
      await page.click('button[type="submit"]')
      
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
    })
  })
})
