import { test, expect } from '@playwright/test';

test.describe('Navigation and Layout', () => {
  test.beforeEach(async ({ page }) => {
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

  test('should navigate to Chapter 2 via sidebar', async ({ page }) => {
    const chapter2Btn = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 2$/ }),
    });
    await chapter2Btn.click();

    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 2');
    await expect(page.locator('.header-chapter-title')).toHaveText('Codes and Combinations');
    await expect(page.locator('.summary-text')).toContainText('combinatorics');
  });

  test('should navigate to Chapter 3 via sidebar', async ({ page }) => {
    const chapter3Btn = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 3$/ }),
    });
    await chapter3Btn.click();

    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 3');
    await expect(page.locator('.header-chapter-title')).toHaveText('Braille and Binary Codes');
    await expect(page.locator('.summary-text')).toContainText('Louis Braille');
  });

  test('should toggle the challenge hint correctly', async ({ page }) => {
    const hintBtn = page.getByTestId('hint-toggle-btn');
    await expect(hintBtn).toHaveText(/Show Hint/);

    // Verify hint is not visible initially
    await expect(page.getByTestId('hint-text')).not.toBeVisible();

    // Show hint
    await hintBtn.click();
    await expect(hintBtn).toHaveText(/Hide Hint/);
    await expect(hintBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('hint-text')).toBeVisible();

    // Hide hint
    await hintBtn.click();
    await expect(hintBtn).toHaveText(/Show Hint/);
    await expect(hintBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('hint-text')).not.toBeVisible();
  });

  test('should show progress bar with accessible attributes', async ({ page }) => {
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  test('should have accessible sidebar navigation', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Chapter list"]');
    await expect(nav).toBeVisible();

    // Active chapter should have aria-current
    const activeBtn = page.locator('button.chapter-btn.active');
    await expect(activeBtn).toHaveAttribute('aria-current', 'true');
  });
});
