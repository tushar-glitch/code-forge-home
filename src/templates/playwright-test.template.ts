
// Basic React app test template
import { test, expect } from '@playwright/test';

test('App renders without crashing', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/React App/);
});

test('Page contains a header element', async ({ page }) => {
  await page.goto('/');
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
});

test('Page navigation works correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if there's a link and click it
  const link = page.getByRole('link');
  if (await link.count() > 0) {
    await link.first().click();
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Check that URL has changed
    expect(page.url()).not.toBe('/');
  }
});

test('Interactive elements respond to user input', async ({ page }) => {
  await page.goto('/');
  
  // Look for a button
  const button = page.getByRole('button');
  if (await button.count() > 0) {
    // Click the button
    await button.first().click();
    
    // Check for some kind of response
    // This would depend on the app, but could be a new element appearing
    // or text changing, etc.
  }
  
  // Look for an input field
  const input = page.getByRole('textbox');
  if (await input.count() > 0) {
    // Type into the input
    await input.first().fill('Test input');
    
    // Check the value was set
    await expect(input.first()).toHaveValue('Test input');
  }
});
