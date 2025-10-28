import { test, expect } from '@playwright/test';

test('should increment and decrement the counter', async ({ page }) => {
  await page.goto('http://localhost:8080'); // Assuming your React app runs on 8080

  // Check initial count
  await expect(page.locator('text=Count: 0')).toBeVisible();

  // Increment
  await page.click('text=Increment');
  await expect(page.locator('text=Count: 1')).toBeVisible();

  // Decrement
  await page.click('text=Decrement');
  await expect(page.locator('text=Count: 0')).toBeVisible();

  // Decrement again
  await page.click('text=Decrement');
  await expect(page.locator('text=Count: -1')).toBeVisible();
});
