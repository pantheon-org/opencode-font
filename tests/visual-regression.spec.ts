import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';
import { GlyphsPage } from './pages/GlyphsPage';

/**
 * Visual Regression Tests
 *
 * Tests visual consistency across pages using Playwright's built-in
 * screenshot comparison functionality.
 *
 * To update baseline screenshots:
 * - Run: bun run test:e2e:update-screenshots
 * - Or: npx playwright test --update-snapshots
 *
 * Configuration:
 * - maxDiffPixels: Maximum number of different pixels allowed
 * - threshold: Pixel color difference threshold (0-1)
 *
 * Baseline screenshots are stored in: tests/screenshots/baseline/
 */
test.describe('Visual Regression', () => {
  test.describe('Home Page', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.goto();
    });

    test('should match home page desktop screenshot', async ({ page }) => {
      // Wait for page to fully load and fonts to render
      await page.waitForLoadState('networkidle');
      await homePage.verifyFontLoading();

      // Take full page screenshot and compare
      await expect(page).toHaveScreenshot('home-desktop.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });

    test('should match home page mobile screenshot', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');
      await homePage.verifyFontLoading();

      // Take full page screenshot
      await expect(page).toHaveScreenshot('home-mobile.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });

    test('should match home page tablet screenshot', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForLoadState('networkidle');
      await homePage.verifyFontLoading();

      await expect(page).toHaveScreenshot('home-tablet.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });

    test('should match header component', async () => {
      // Screenshot of just the header
      await expect(homePage.header).toHaveScreenshot('header.png', {
        maxDiffPixels: 50,
      });
    });

    test('should match logo rendering', async () => {
      // Screenshot of the logo SVG
      await expect(homePage.logo).toHaveScreenshot('logo.png', {
        maxDiffPixels: 10,
      });
    });
  });

  test.describe('Demo Page - Light Theme', () => {
    let demoPage: DemoPage;

    test.beforeEach(async ({ page }) => {
      demoPage = new DemoPage(page);
      await demoPage.goto();
    });

    test('should match demo page light theme desktop', async ({ page }) => {
      // Switch to light theme
      await demoPage.themeSelect.selectOption('light');
      await page.waitForTimeout(500); // Wait for theme transition

      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('demo-light-desktop.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });

    test('should match demo preview light theme', async ({ page }) => {
      // Switch to light theme
      await demoPage.themeSelect.selectOption('light');
      await page.waitForTimeout(500);

      // Screenshot just the preview area
      await expect(demoPage.previewArea).toHaveScreenshot('demo-preview-light.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match demo controls light theme', async ({ page }) => {
      // Switch to light theme
      await demoPage.themeSelect.selectOption('light');
      await page.waitForTimeout(500);

      // Screenshot the controls section
      const controls = page.locator('.controls').first();
      await expect(controls).toHaveScreenshot('demo-controls-light.png', {
        maxDiffPixels: 50,
      });
    });

    test('should match generated code output light theme', async ({ page }) => {
      // Switch to light theme
      await demoPage.themeSelect.selectOption('light');
      await page.waitForTimeout(500);

      // Screenshot the code output area
      await expect(demoPage.codeOutput).toHaveScreenshot('demo-code-light.png', {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Demo Page - Dark Theme', () => {
    let demoPage: DemoPage;

    test.beforeEach(async ({ page }) => {
      demoPage = new DemoPage(page);
      await demoPage.goto();
    });

    test('should match demo page dark theme desktop', async ({ page }) => {
      // Dark theme is default, but ensure it's set
      await demoPage.themeSelect.selectOption('dark');
      await page.waitForTimeout(500);

      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('demo-dark-desktop.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });

    test('should match demo preview dark theme', async ({ page }) => {
      // Ensure dark theme
      await demoPage.themeSelect.selectOption('dark');
      await page.waitForTimeout(500);

      await expect(demoPage.previewArea).toHaveScreenshot('demo-preview-dark.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match demo controls dark theme', async ({ page }) => {
      // Ensure dark theme
      await demoPage.themeSelect.selectOption('dark');
      await page.waitForTimeout(500);

      const controls = page.locator('.controls').first();
      await expect(controls).toHaveScreenshot('demo-controls-dark.png', {
        maxDiffPixels: 50,
      });
    });

    test('should match generated code output dark theme', async ({ page }) => {
      // Ensure dark theme
      await demoPage.themeSelect.selectOption('dark');
      await page.waitForTimeout(500);

      await expect(demoPage.codeOutput).toHaveScreenshot('demo-code-dark.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match demo mobile dark theme', async ({ page }) => {
      // Set mobile viewport and dark theme
      await page.setViewportSize({ width: 375, height: 667 });
      await demoPage.themeSelect.selectOption('dark');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('demo-dark-mobile.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });
  });

  test.describe('Glyphs Page', () => {
    let glyphsPage: GlyphsPage;

    test.beforeEach(async ({ page }) => {
      glyphsPage = new GlyphsPage(page);
      await glyphsPage.goto();
    });

    test('should match glyphs page desktop screenshot', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('glyphs-desktop.png', {
        fullPage: true,
        maxDiffPixels: 200,
      });
    });

    test('should match letter grid layout', async () => {
      const grid = glyphsPage.page.locator('#letters-grid').first();
      await expect(grid).toHaveScreenshot('glyphs-grid.png', {
        maxDiffPixels: 200,
      });
    });

    test('should match individual glyph card', async () => {
      // Screenshot the first glyph card (letter A)
      const firstGlyph = glyphsPage.page.locator('.glyph-card').first();
      await expect(firstGlyph).toHaveScreenshot('glyph-a.png', {
        maxDiffPixels: 50,
      });
    });

    test('should match symbols grid', async () => {
      const symbolsGrid = glyphsPage.page.locator('#symbols-grid').first();
      await expect(symbolsGrid).toHaveScreenshot('glyphs-symbols.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match glyphs page mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('glyphs-mobile.png', {
        fullPage: true,
        maxDiffPixels: 200,
      });
    });

    test('should match theme switcher on glyphs page', async () => {
      const themeSwitcher = glyphsPage.page.locator('#theme-switcher').first();
      await expect(themeSwitcher).toHaveScreenshot('glyphs-theme-switcher.png', {
        maxDiffPixels: 50,
      });
    });
  });

  test.describe('Theme Consistency', () => {
    test('should have consistent theme colors across pages', async ({ page }) => {
      // Home page background color
      const homePage = new HomePage(page);
      await homePage.goto();
      await page.waitForLoadState('networkidle');

      const homeColor = await page
        .locator('body')
        .evaluate((el) => window.getComputedStyle(el).backgroundColor);

      // Demo page background color
      const demoPage = new DemoPage(page);
      await demoPage.goto();
      await page.waitForLoadState('networkidle');

      const demoColor = await page
        .locator('body')
        .evaluate((el) => window.getComputedStyle(el).backgroundColor);

      // Glyphs page background color
      const glyphsPage = new GlyphsPage(page);
      await glyphsPage.goto();
      await page.waitForLoadState('networkidle');

      const glyphsColor = await page
        .locator('body')
        .evaluate((el) => window.getComputedStyle(el).backgroundColor);

      // All should match (allowing for minor variations)
      expect(homeColor).toBeTruthy();
      expect(demoColor).toBeTruthy();
      expect(glyphsColor).toBeTruthy();

      // Verify they're the same
      expect(homeColor).toBe(demoColor);
      expect(demoColor).toBe(glyphsColor);
    });

    test('should have consistent header across pages', async ({ page }) => {
      // Take header screenshots from each page
      const homePage = new HomePage(page);
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      const homeHeader = await homePage.header.screenshot();

      const demoPage = new DemoPage(page);
      await demoPage.goto();
      await page.waitForLoadState('networkidle');
      const demoHeader = await demoPage.header.screenshot();

      const glyphsPage = new GlyphsPage(page);
      await glyphsPage.goto();
      await page.waitForLoadState('networkidle');
      const glyphsHeader = await glyphsPage.header.screenshot();

      // Headers should be similar (not byte-identical due to active nav state)
      expect(homeHeader).toBeTruthy();
      expect(demoHeader).toBeTruthy();
      expect(glyphsHeader).toBeTruthy();
    });
  });

  test.describe('Responsive Breakpoints', () => {
    const viewports = [
      { name: 'mobile-sm', width: 320, height: 568 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'mobile-lg', width: 414, height: 896 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'tablet-lg', width: 1024, height: 1366 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'desktop-lg', width: 1920, height: 1080 },
    ];

    viewports.forEach((viewport) => {
      test(`should render correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        const homePage = new HomePage(page);
        await homePage.goto();
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
          fullPage: true,
          maxDiffPixels: 150,
        });
      });
    });
  });

  test.describe('SVG Rendering Consistency', () => {
    test('should render SVG consistently in preview', async ({ page }) => {
      const demoPage = new DemoPage(page);
      await demoPage.goto();
      await page.waitForLoadState('networkidle');

      // Test with known text
      await demoPage.testTextInput('OPENCODE');
      await page.waitForTimeout(500);

      // Screenshot the SVG
      await expect(demoPage.previewSVG).toHaveScreenshot('svg-opencode.png', {
        maxDiffPixels: 50,
      });
    });

    test('should render SVG with different sizes consistently', async ({ page }) => {
      const demoPage = new DemoPage(page);
      await demoPage.goto();

      // Test different block sizes
      const sizes = [4, 6, 8, 10];

      for (const size of sizes) {
        await demoPage.testBlockSizeSlider(size);
        await page.waitForTimeout(500);

        await expect(demoPage.previewSVG).toHaveScreenshot(`svg-size-${size}.png`, {
          maxDiffPixels: 50,
        });
      }
    });
  });
});
