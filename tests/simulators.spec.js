import { test, expect } from '@playwright/test';

test.describe('Chapter Simulators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Chapter 1: Flashlight Morse code challenge', async ({ page }) => {
    // Inject mock Date.now on the active loaded page to make the test time-independent
    await page.evaluate(() => {
      let mockTime = 1718636000000;
      window.Date.now = () => mockTime;
      window.advanceTime = (ms) => {
        mockTime += ms;
      };
    });

    // Navigate to Chapter 1 (it is the default, but let's click it to be safe) using exact matching
    await page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 1$/ }) }).click();

    // Helper to simulate short flashlight taps (dots) using deterministic mock time
    const tapFlashlight = async (count) => {
      for (let i = 0; i < count; i++) {
        await page.locator('button:has-text("🔦")').dispatchEvent('mousedown');
        await page.evaluate(() => window.advanceTime(50)); // Advance mock time by 50ms
        await page.locator('button:has-text("🔦")').dispatchEvent('mouseup');
        await page.evaluate(() => window.advanceTime(100)); // Advance mock time between taps
        await page.waitForTimeout(50); // Small pause for event processing
      }
    };

    // Transmit 'H' (4 dots)
    await tapFlashlight(4);
    await page.waitForTimeout(850); // Wait for character to decode in real time (> 700ms)

    // Transmit 'I' (2 dots)
    await tapFlashlight(2);
    await page.waitForTimeout(850); // Wait for character to decode in real time (> 700ms)

    // Verify successful decode and challenge completion
    await expect(page.locator('.challenge-box')).toHaveClass(/success/);
    await expect(page.locator('.challenge-header')).toContainText('Challenge Completed!');
    await expect(page.locator('text=Decoded Message: HI')).toBeVisible();
  });

  test('Chapter 2: Codes and Combinations challenge', async ({ page }) => {
    // Navigate using exact matching
    await page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 2$/ }) }).click();

    // The default bits value is 3. We use .fill('5') to set the range input to 5.
    const slider = page.locator('input[type="range"]');
    await slider.fill('5');

    // Check that the bits indicator shows 5
    await expect(page.locator('text=Number of Signals (Bits): 5')).toBeVisible();

    // Input "32" as the answer and submit
    const input = page.locator('input[placeholder="Enter total combinations..."]');
    await input.fill('32');
    await page.locator('button:has-text("Check Answer")').click();

    // Check for success
    await expect(page.locator('.challenge-box')).toHaveClass(/success/);
    await expect(page.locator('.challenge-header')).toContainText('Challenge Completed!');
  });

  test('Chapter 3: Braille and Binary Codes challenge', async ({ page }) => {
    // Navigate using exact matching
    await page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 3$/ }) }).click();

    // Select Dot 1 and Dot 4 for letter "C"
    await page.locator('button[title="Dot 1"]').click();
    await page.locator('button[title="Dot 4"]').click();

    // Check that letter displays "C"
    await expect(page.locator('text=Letter: C')).toBeVisible();

    // Check for success
    await expect(page.locator('.challenge-box')).toHaveClass(/success/);
  });

  test('Chapter 4: Anatomy of a Flashlight challenge', async ({ page }) => {
    // Navigate using exact matching
    await page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 4$/ }) }).click();

    // Initial state: OFF
    const switchBtn = page.locator('button:has-text("Close Switch (ON)")');
    await expect(switchBtn).toBeVisible();

    // Close the switch
    await switchBtn.click();

    // Verify it changed to ON state and challenge completes
    await expect(page.locator('button:has-text("Open Switch (OFF)")')).toBeVisible();
    await expect(page.locator('.challenge-box')).toHaveClass(/success/);
  });

  test('Chapter 10: Alternative 10s challenge', async ({ page }) => {
    // Navigate using exact matching
    await page.locator('button.chapter-btn').filter({ has: page.locator('.chapter-num', { hasText: /^Chapter 10$/ }) }).click();

    // Enter decimal value 42
    const input = page.locator('input[placeholder="Enter a decimal number..."]');
    await input.fill('42');

    // Verify binary output converts to 101010
    await expect(page.locator('text=Binary (Base 2) >> xpath=../div[2]')).toHaveText('101010');
    // Verify octal output converts to 52
    await expect(page.locator('text=Octal (Base 8) >> xpath=../div[2]')).toHaveText('52');

    // Verify challenge completes
    await expect(page.locator('.challenge-box')).toHaveClass(/success/);
  });
});
