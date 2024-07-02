import { test, expect } from '@playwright/test'

const baseUrl = 'http://localhost:3000'

test.describe('Dashboard page', () => {
  test('should have a title', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard`)
    const title = page.getByTestId('dashboard-title')
    await expect(title).toHaveText('Dashboard')
  })
})
