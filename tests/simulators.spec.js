import { test, expect } from '@playwright/test';

/**
 * Helper to navigate to a specific chapter by number.
 */
async function navigateToChapter(page, num) {
  await page.locator('button.chapter-btn').filter({
    has: page.locator('.chapter-num', { hasText: new RegExp(`^Chapter ${num}$`) }),
  }).click();
}

test.describe('Chapter Simulators', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
    await page.goto('/');
  });

  test('Chapter 1: Flashlight Morse code challenge', async ({ page }) => {
    // Use Playwright's clock API for deterministic timing
    await page.clock.install();

    await navigateToChapter(page, 1);

    const flashlightBtn = page.getByTestId('ch1-flashlight-btn');

    // Helper: tap flashlight quickly (dot = < 200ms)
    const tapFlashlight = async (count) => {
      for (let i = 0; i < count; i++) {
        await flashlightBtn.dispatchEvent('mousedown');
        await page.clock.fastForward(50);
        await flashlightBtn.dispatchEvent('mouseup');
        await page.clock.fastForward(100);
      }
    };

    // Transmit 'H' (4 dots)
    await tapFlashlight(4);
    // Wait for character decode timer (> 700ms)
    await page.clock.fastForward(800);

    // Transmit 'I' (2 dots)
    await tapFlashlight(2);
    await page.clock.fastForward(800);

    // Verify challenge completion
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).toHaveClass(/success/);
    await expect(page.locator('.challenge-header')).toContainText('Challenge Completed!');
  });

  test('Chapter 2: Codes and Combinations challenge', async ({ page }) => {
    await navigateToChapter(page, 2);

    // Set bits to 5 via the slider
    const slider = page.getByTestId('ch2-bits-slider');
    await slider.fill('5');

    // Verify bits indicator shows 5
    await expect(page.locator('text=Number of Signals (Bits): 5')).toBeVisible();

    // Enter correct answer (2^5 = 32)
    const input = page.getByTestId('ch2-answer-input');
    await input.fill('32');
    await page.getByTestId('ch2-check-btn').click();

    // Verify success
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).toHaveClass(/success/);
  });

  test('Chapter 2: Wrong answer shows error feedback', async ({ page }) => {
    await navigateToChapter(page, 2);

    const input = page.getByTestId('ch2-answer-input');
    await input.fill('16');
    await page.getByTestId('ch2-check-btn').click();

    // Challenge should NOT be completed
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).not.toHaveClass(/success/);
  });

  test('Chapter 3: Braille and Binary Codes challenge', async ({ page }) => {
    await navigateToChapter(page, 3);

    // Select Dot 1 and Dot 4 for letter "C"
    await page.locator('button[title="Dot 1"]').click();
    await page.locator('button[title="Dot 4"]').click();

    // Check that letter displays "C"
    await expect(page.locator('text=Letter: C')).toBeVisible();

    // Check for success
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).toHaveClass(/success/);
  });

  test('Chapter 4: Anatomy of a Flashlight challenge', async ({ page }) => {
    await navigateToChapter(page, 4);

    // Verify initial OFF state — challenge should NOT be complete
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).not.toHaveClass(/success/);

    // Find the switch button (text describes the action, not the state)
    const switchBtn = page.locator('button:has-text("Close Switch (ON)")');
    await expect(switchBtn).toBeVisible();

    // Close the switch
    await switchBtn.click();

    // Verify ON state and challenge completion
    await expect(page.locator('button:has-text("Open Switch (OFF)")')).toBeVisible();
    await expect(challengeBox).toHaveClass(/success/);
  });

  test('Chapter 10: Alternative 10s challenge', async ({ page }) => {
    await navigateToChapter(page, 10);

    // Enter decimal value 42
    const input = page.getByTestId('ch10-decimal-input');
    await input.fill('42');

    // Verify binary output
    const binaryCard = page.getByTestId('ch10-binary-display');
    await expect(binaryCard).toContainText('101010');

    // Verify octal output
    const octalCard = page.getByTestId('ch10-octal-display');
    await expect(octalCard).toContainText('52');

    // Verify challenge completes
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).toHaveClass(/success/);
  });

  test('Chapter 6: Logic with Switches — AND gate', async ({ page }) => {
    await navigateToChapter(page, 6);

    // Initially challenge should not be complete
    const challengeBox = page.getByTestId('challenge-box');
    await expect(challengeBox).not.toHaveClass(/success/);

    // Toggle Switch A ON
    const switchA = page.getByTestId('ch6-switch-a');
    await switchA.click();

    // Still not complete (need all switches for series circuit)
    await expect(challengeBox).not.toHaveClass(/success/);

    // Toggle Switch B ON
    const switchB = page.getByTestId('ch6-switch-b');
    await switchB.click();

    // Toggle Switch C ON (if needed for the specific gate)
    const switchC = page.getByTestId('ch6-switch-c');
    await switchC.click();

    // Now the challenge should be complete
    await expect(challengeBox).toHaveClass(/success/);
  });

  test('should listen for page errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    // Navigate through several chapters to check for runtime errors
    for (const ch of [1, 5, 10, 15, 20, 25]) {
      await navigateToChapter(page, ch);
      // Small pause to let React render
      await page.waitForTimeout(100);
    }

    expect(errors).toEqual([]);
  });
});
