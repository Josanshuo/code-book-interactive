import { test, expect } from '@playwright/test';

test.describe('State Persistence and Progress', () => {
  test('should load completed chapters from localStorage', async ({ page }) => {
    // Inject mock completed chapters into localStorage before the page loads
    await page.addInitScript(() => {
      window.localStorage.setItem('completed_chapters', JSON.stringify({ '2': true, '3': true }));
    });

    await page.goto('/');

    // Verify progress bar shows 2 / 28 completed
    const progressText = page.locator('span:has-text("Progress") + span');
    await expect(progressText).toHaveText('2 / 28 (7%)');

    // Verify Chapter 2 and Chapter 3 in sidebar have checkmarks
    // Look for checkmark icons in the buttons
    const ch2Check = page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 2$/ }) }).locator('svg');
    const ch3Check = page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 3$/ }) }).locator('svg');
    await expect(ch2Check).toBeVisible();
    await expect(ch3Check).toBeVisible();

    // Verify Chapter 1 doesn't have a checkmark
    const ch1Check = page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 1$/ }) }).locator('svg');
    await expect(ch1Check).not.toBeVisible();
  });

  test('should save completion state and persist it across page reloads', async ({ page }) => {
    await page.goto('/');

    // Navigate to Chapter 4 (Anatomy of a Flashlight) using exact matching
    await page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 4$/ }) }).click();

    // Verify challenge box does not show completed
    await expect(page.locator('.challenge-box')).not.toHaveClass(/success/);
    await expect(page.locator('.challenge-header')).toContainText('Active Challenge');

    // Solve Chapter 4: Close the switch in the circuit diagram to light the bulb
    const switchBtn = page.locator('button:has-text("Close Switch")');
    await switchBtn.click();

    // Verify challenge is marked complete
    await expect(page.locator('.challenge-box')).toHaveClass(/success/);
    await expect(page.locator('.challenge-header')).toContainText('Challenge Completed!');

    // Check sidebar checkmark for Chapter 4 is now visible
    const ch4Check = page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 4$/ }) }).locator('svg');
    await expect(ch4Check).toBeVisible();

    // Reload the page
    await page.reload();

    // Verify Chapter 4 checkmark is still visible and progress is updated
    await expect(page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 4$/ }) }).locator('svg')).toBeVisible();
    const progressText = page.locator('span:has-text("Progress") + span');
    await expect(progressText).toHaveText('1 / 28 (4%)');
  });
});
