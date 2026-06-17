import { test, expect } from '@playwright/test';

test.describe('Navigation and Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local homepage
    await page.goto('/');
  });

  test('should display the core application shell', async ({ page }) => {
    // Check the logo and header title
    await expect(page.locator('h1.sidebar-logo')).toHaveText('CODE LABS');
    await expect(page.locator('header.app-header')).toContainText('Charles Petzold Companion');
  });

  test('should default to Chapter 1', async ({ page }) => {
    // Chapter 1 header title and number
    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 1');
    await expect(page.locator('.header-chapter-title')).toHaveText('Best Friends');
    
    // Concept overview panel check
    await expect(page.locator('.summary-text')).toContainText('communicate at night');
  });

  test('should navigate to different chapters via sidebar', async ({ page }) => {
    // Click on Chapter 2 in the sidebar using exact match
    const chapter2Btn = page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 2$/ }) });
    await chapter2Btn.click();

    // Verify main workspace updates to Chapter 2
    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 2');
    await expect(page.locator('.header-chapter-title')).toHaveText('Codes and Combinations');
    await expect(page.locator('.summary-text')).toContainText('combinatorics');

    // Click on Chapter 3 in the sidebar using exact match
    const chapter3Btn = page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 3$/ }) });
    await chapter3Btn.click();

    // Verify workspace updates to Chapter 3
    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 3');
    await expect(page.locator('.header-chapter-title')).toHaveText('Braille and Binary Codes');
    await expect(page.locator('.summary-text')).toContainText('Louis Braille');
  });

  test('should toggle the challenge hint correctly', async ({ page }) => {
    // Start on Chapter 1
    const hintBtn = page.locator('.challenge-box button');
    await expect(hintBtn).toHaveText(/Show Hint/);

    // Ensure the hint text container is not visible initially
    await expect(page.locator('text=Click the flashlight button quickly 4 times')).not.toBeVisible();

    // Click to show hint
    await hintBtn.click();
    await expect(hintBtn).toHaveText(/Hide Hint/);
    
    // Check that the hint text is now visible
    const hintBox = page.getByText("Click the flashlight button quickly 4 times", { exact: false });
    await expect(hintBox).toBeVisible();

    // Click to hide hint
    await hintBtn.click();
    await expect(hintBtn).toHaveText(/Show Hint/);
    await expect(hintBox).not.toBeVisible();
  });
});
