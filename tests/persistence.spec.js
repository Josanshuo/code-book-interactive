import { test, expect } from '@playwright/test';

test.describe('State Persistence and Progress', () => {
  test('should load completed chapters from localStorage', async ({ page }) => {
    // Inject mock completed chapters into localStorage before the page loads
    await page.addInitScript(() => {
      window.localStorage.setItem('completed_chapters', JSON.stringify({ '2': true, '3': true }));
    });

    await page.goto('/');

    // Verify progress bar shows 2 / 28 completed
    const progressText = page.getByTestId('progress-text');
    await expect(progressText).toHaveText('2 / 28 (7%)');

    // Verify Chapter 2 and Chapter 3 in sidebar have checkmarks (SVG exists)
    const ch2Check = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 2$/ }),
    }).locator('svg');
    const ch3Check = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 3$/ }),
    }).locator('svg');
    await expect(ch2Check).toBeVisible();
    await expect(ch3Check).toBeVisible();

    // Verify Chapter 1 doesn't have a checkmark (element should not exist)
    const ch1Check = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 1$/ }),
    }).locator('svg');
    await expect(ch1Check).toHaveCount(0);
  });

  test('should save completion state and persist it across page reloads', async ({ page }) => {
    // Clear localStorage via evaluate (not addInitScript, which persists across reloads)
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    // Navigate to Chapter 4 (Anatomy of a Flashlight)
    await page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 4$/ }),
    }).click();

    // Verify challenge is not yet completed
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).not.toHaveClass(/success/);
    await expect(page.locator('.challenge-header')).toContainText('Active Challenge');

    // Solve Chapter 4: Close the switch
    const switchBtn = page.locator('button:has-text("Close Switch")');
    await switchBtn.click();

    // Verify challenge is marked complete
    await expect(challengeBox).toHaveClass(/success/);
    await expect(page.locator('.challenge-header')).toContainText('Challenge Completed!');

    // Check sidebar checkmark for Chapter 4
    const ch4Check = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 4$/ }),
    }).locator('svg');
    await expect(ch4Check).toBeVisible();

    // Reload the page — no addInitScript to clear localStorage
    await page.reload();

    // Verify persistence: Chapter 4 checkmark still visible
    await expect(
      page.locator('button.chapter-btn').filter({
        has: page.locator('.chapter-num', { hasText: /^Chapter 4$/ }),
      }).locator('svg')
    ).toBeVisible();

    const progressText = page.getByTestId('progress-text');
    await expect(progressText).toHaveText('1 / 28 (4%)');
  });

  test('should handle corrupted localStorage gracefully', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('completed_chapters', 'not-valid-json{{{');
    });

    await page.goto('/');

    // App should still load with 0 progress instead of crashing
    const progressText = page.getByTestId('progress-text');
    await expect(progressText).toHaveText('0 / 28 (0%)');
  });
});
