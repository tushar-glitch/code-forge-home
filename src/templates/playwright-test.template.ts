import { test, expect } from '@playwright/test';

test.describe('React Counter App', () => {
  test('should display the counter and increment on click', async ({ page }) => {
    await page.goto('/');

    // Check that the initial count is 0
    await expect(page.locator('h2')).toContainText('Count: 0');

    // Click the increment button
    await page.click('button:has-text("Increment")');

    // Check that the count has been incremented to 1
    await expect(page.locator('h2')).toContainText('Count: 1');
  });
});