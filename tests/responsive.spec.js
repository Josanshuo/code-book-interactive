import { test, expect } from '@playwright/test';

// Common mobile viewport — iPhone 14 size
const MOBILE_VIEWPORT = { width: 390, height: 844 };

// Tablet viewport
const TABLET_VIEWPORT = { width: 768, height: 1024 };

// Small desktop — just under sidebar collapse breakpoint
const SMALL_DESKTOP_VIEWPORT = { width: 899, height: 900 };

// Full desktop — sidebar always visible
const DESKTOP_VIEWPORT = { width: 1280, height: 900 };

test.describe('Responsive: Desktop (≥ 900px)', () => {
  test.use({ viewport: DESKTOP_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sidebar is visible without hamburger button', async ({ page }) => {
    const sidebar = page.locator('aside.sidebar');
    await expect(sidebar).toBeVisible();

    // Hamburger button should be hidden on desktop
    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await expect(hamburger).not.toBeVisible();
  });

  test('sidebar overlay is not present on desktop', async ({ page }) => {
    const overlay = page.locator('.sidebar-overlay');
    // Overlay should have display: none on desktop
    await expect(overlay).toHaveCSS('display', 'none');
  });

  test('header subtitle is visible on desktop', async ({ page }) => {
    await expect(page.locator('.header-subtitle')).toBeVisible();
    await expect(page.locator('.header-subtitle')).toContainText('Charles Petzold Companion');
  });

  test('workspace uses side-by-side layout on desktop', async ({ page }) => {
    const workspace = page.locator('.workspace');
    const flexDir = await workspace.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });
});

test.describe('Responsive: Sidebar collapse (≤ 900px)', () => {
  test.use({ viewport: SMALL_DESKTOP_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sidebar is hidden by default, hamburger button is visible', async ({ page }) => {
    const sidebar = page.locator('aside.sidebar');
    // Sidebar is off-screen via transform
    await expect(sidebar).toHaveCSS('transform', /matrix/);

    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await expect(hamburger).toBeVisible();
  });

  test('clicking hamburger opens sidebar with overlay', async ({ page }) => {
    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await hamburger.click();

    // Sidebar should now have .open class
    const sidebar = page.locator('aside.sidebar.open');
    await expect(sidebar).toBeVisible();

    // Overlay should be visible
    const overlay = page.locator('.sidebar-overlay.visible');
    await expect(overlay).toBeVisible();
  });

  test('clicking overlay closes sidebar', async ({ page }) => {
    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await hamburger.click();
    await expect(page.locator('aside.sidebar.open')).toBeVisible();

    // Click the overlay
    const overlay = page.locator('.sidebar-overlay.visible');
    await overlay.click({ position: { x: 10, y: 10 }, force: true });

    // Sidebar should close
    await expect(page.locator('aside.sidebar.open')).not.toBeAttached();
  });

  test('clicking close button inside sidebar closes it', async ({ page }) => {
    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await hamburger.click();
    await expect(page.locator('aside.sidebar.open')).toBeVisible();

    // Click the X button inside sidebar
    const closeBtn = page.locator('button.sidebar-toggle[aria-label="Close sidebar"]');
    await closeBtn.click();

    await expect(page.locator('aside.sidebar.open')).not.toBeAttached();
  });

  test('selecting a chapter closes sidebar on mobile', async ({ page }) => {
    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await hamburger.click();
    await expect(page.locator('aside.sidebar.open')).toBeVisible();

    // Click Chapter 3
    const chapter3Btn = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 3$/ }),
    });
    await chapter3Btn.click();

    // Sidebar should auto-close
    await expect(page.locator('aside.sidebar.open')).not.toBeAttached();

    // Content should update
    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 3');
    await expect(page.locator('.header-chapter-title')).toHaveText('Braille and Binary Codes');
  });

  test('full navigation flow: open sidebar, navigate, interact', async ({ page }) => {
    // Open sidebar
    await page.locator('button.sidebar-toggle[aria-label="Open sidebar"]').click();
    await expect(page.locator('aside.sidebar.open')).toBeVisible();

    // Navigate to Chapter 2
    const chapter2Btn = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 2$/ }),
    });
    await chapter2Btn.click();

    // Sidebar closed, content updated
    await expect(page.locator('aside.sidebar.open')).not.toBeAttached();
    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 2');

    // Verify the lab simulator loaded
    await expect(page.locator('.lab-container')).toBeVisible();
  });
});

test.describe('Responsive: Tablet (768px)', () => {
  test.use({ viewport: TABLET_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header subtitle is hidden on tablet', async ({ page }) => {
    await expect(page.locator('.header-subtitle')).not.toBeVisible();
  });

  test('workspace stacks panels vertically', async ({ page }) => {
    const workspace = page.locator('.workspace');
    const flexDir = await workspace.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  test('grids collapse to single column', async ({ page }) => {
    // Navigate to a chapter that uses grid-2 (Chapter 15 has grid-2)
    await page.locator('button.sidebar-toggle[aria-label="Open sidebar"]').click();
    const chapter15Btn = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 15$/ }),
    });
    await chapter15Btn.click();

    // Check a grid-2 element has 1 column
    const grid2 = page.locator('.grid-2').first();
    if (await grid2.isVisible()) {
      const cols = await grid2.evaluate(el => getComputedStyle(el).gridTemplateColumns);
      // Should be a single column value (one value, not two)
      const colCount = cols.split(/\s+/).filter(c => c && c !== 'none').length;
      expect(colCount).toBe(1);
    }
  });
});

test.describe('Responsive: Mobile (390px)', () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hamburger is visible and clickable', async ({ page }) => {
    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await expect(page.locator('aside.sidebar.open')).toBeVisible();
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('chapter content is accessible on mobile', async ({ page }) => {
    // Verify default chapter content is visible
    await expect(page.locator('.header-chapter-num')).toHaveText('CHAPTER 1');
    await expect(page.locator('.summary-text')).toBeVisible();
    await expect(page.locator('.lab-container')).toBeVisible();
  });

  test('challenge hint works on mobile', async ({ page }) => {
    const hintBtn = page.getByTestId('hint-toggle-btn');
    await expect(hintBtn).toBeVisible();

    await hintBtn.click();
    await expect(page.getByTestId('hint-text')).toBeVisible();

    await hintBtn.click();
    await expect(page.getByTestId('hint-text')).not.toBeVisible();
  });

  test('SVGs scale down without overflow', async ({ page }) => {
    // Navigate to Chapter 6 which has an SVG circuit diagram
    await page.locator('button.sidebar-toggle[aria-label="Open sidebar"]').click();
    const ch6Btn = page.locator('button.chapter-btn').filter({
      has: page.locator('.chapter-num', { hasText: /^Chapter 6$/ }),
    });
    await ch6Btn.click();

    // Wait for lab to load
    await expect(page.locator('.lab-container')).toBeVisible();

    // Check the SVG fits within the viewport
    const svg = page.locator('.lab-container svg').first();
    if (await svg.isVisible()) {
      const box = await svg.boundingBox();
      expect(box.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
    }
  });

  test('chapter 1 flashlight button is usable on mobile', async ({ page }) => {
    const flashlightBtn = page.getByTestId('ch1-flashlight-btn');
    await expect(flashlightBtn).toBeVisible();

    // Verify the button has a reasonable tap target size
    const box = await flashlightBtn.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Responsive: Viewport resize', () => {
  test('sidebar auto-resets when resizing from mobile to desktop', async ({ page }) => {
    // Start at mobile size
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');

    // Open sidebar
    await page.locator('button.sidebar-toggle[aria-label="Open sidebar"]').click();
    await expect(page.locator('aside.sidebar.open')).toBeVisible();

    // Resize to desktop
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Sidebar should be visible as a normal sidebar (not overlay)
    const sidebar = page.locator('aside.sidebar');
    await expect(sidebar).toBeVisible();

    // Hamburger should be hidden on desktop
    const hamburger = page.locator('button.sidebar-toggle[aria-label="Open sidebar"]');
    await expect(hamburger).not.toBeVisible();
  });
});
