import { test, expect } from '@playwright/test';
import { GlyphsPage } from './pages/GlyphsPage';

/**
 * Glyphs Page Tests
 *
 * Comprehensive test suite for the glyph showcase page
 * Tests letter grid, symbol cards, theme switching, and SVG rendering
 */
test.describe('Glyphs Page', () => {
  let glyphsPage: GlyphsPage;

  test.beforeEach(async ({ page }) => {
    glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();
  });

  test.describe('Page Load and Structure', () => {
    test('should load successfully', async () => {
      await expect(glyphsPage.page).toHaveURL(/.*\/glyphs\//);
      await expect(glyphsPage.page).toHaveTitle(/Glyph Showcase/);
    });

    test('should display all page sections', async () => {
      await glyphsPage.verifyPageLoad();
    });

    test('should have proper heading hierarchy', async () => {
      await glyphsPage.verifyHeadingHierarchy();
    });
  });

  test.describe('Letter Glyphs', () => {
    test('should display all 26 letter glyphs', async () => {
      await glyphsPage.verifyLetterGlyphs();
    });

    test('should display letter A correctly', async () => {
      await glyphsPage.verifyLetterGlyph('A');
    });

    test('should display letter Z correctly', async () => {
      await glyphsPage.verifyLetterGlyph('Z');
    });

    test('should display middle letters correctly', async () => {
      await glyphsPage.verifyLetterGlyph('M');
      await glyphsPage.verifyLetterGlyph('N');
    });

    test('should render all letters with SVG', async () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      for (const letter of letters) {
        const card = glyphsPage.lettersGrid.locator('.glyph-card').filter({ hasText: letter });
        const svg = card.locator('svg');
        await expect(svg).toBeVisible();
      }
    });
  });

  test.describe('Symbol Glyphs', () => {
    test('should display all 6 symbol glyphs', async () => {
      await glyphsPage.verifySymbolGlyphs();
    });

    test('should display hyphen symbol', async () => {
      await glyphsPage.verifySymbolGlyph('hyphen', 'Hyphen');
    });

    test('should display pipe symbol', async () => {
      await glyphsPage.verifySymbolGlyph('pipe', 'Pipe');
    });

    test('should display apostrophe symbol', async () => {
      await glyphsPage.verifySymbolGlyph('apostrophe', 'Apostrophe');
    });

    test('should display quote symbol', async () => {
      await glyphsPage.verifySymbolGlyph('quote', 'Quote');
    });

    test('should display question symbol', async () => {
      await glyphsPage.verifySymbolGlyph('question', 'Question');
    });

    test('should display exclamation symbol', async () => {
      await glyphsPage.verifySymbolGlyph('exclamation', 'Exclamation');
    });
  });

  test.describe('Theme Controls', () => {
    test('should display theme control buttons', async () => {
      await glyphsPage.verifyThemeControls();
    });

    test('should have dark theme active by default', async () => {
      await expect(glyphsPage.darkThemeButton).toHaveClass(/active/);
    });

    test('should switch to light theme', async () => {
      await glyphsPage.testLightTheme();
    });

    test('should switch to dark theme', async () => {
      await glyphsPage.testDarkTheme();
    });

    test('should show both themes', async () => {
      await glyphsPage.testBothThemes();
    });

    test('should complete theme switching flow', async () => {
      await glyphsPage.testThemeSwitchingFlow();
    });
  });

  test.describe('Theme Switching Behavior', () => {
    test('should update all glyphs when switching themes', async () => {
      // Switch to light
      await glyphsPage.lightThemeButton.click();
      await glyphsPage.page.waitForTimeout(500);

      // Verify glyphs are still visible
      const firstCard = glyphsPage.glyphCards.first();
      await expect(firstCard).toBeVisible();

      const svg = firstCard.locator('svg');
      await expect(svg).toBeVisible();
    });

    test('should maintain glyph visibility during theme changes', async () => {
      // Rapidly switch themes
      await glyphsPage.lightThemeButton.click();
      await glyphsPage.page.waitForTimeout(200);
      await glyphsPage.darkThemeButton.click();
      await glyphsPage.page.waitForTimeout(200);
      await glyphsPage.bothThemesButton.click();
      await glyphsPage.page.waitForTimeout(200);

      // All glyphs should still be visible
      await expect(glyphsPage.glyphCards.first()).toBeVisible();
      await expect(glyphsPage.symbolCards.first()).toBeVisible();
    });
  });

  test.describe('Grid Layout', () => {
    test('should use CSS grid layout', async () => {
      await glyphsPage.verifyGridLayout();
    });

    test('should display cards in grid formation', async () => {
      const cardCount = await glyphsPage.glyphCards.count();
      expect(cardCount).toBe(26);

      // Verify cards are laid out in grid
      const firstCard = glyphsPage.glyphCards.first();
      const lastCard = glyphsPage.glyphCards.last();

      const firstBox = await firstCard.boundingBox();
      const lastBox = await lastCard.boundingBox();

      expect(firstBox).toBeTruthy();
      expect(lastBox).toBeTruthy();

      // Last card should be below first card
      expect(lastBox!.y).toBeGreaterThan(firstBox!.y);
    });
  });

  test.describe('Card Interactions', () => {
    test('should show hover effects on cards', async () => {
      await glyphsPage.testCardHoverEffects();
    });

    test('should maintain card structure on hover', async () => {
      const firstCard = glyphsPage.glyphCards.first();

      await firstCard.hover();
      await glyphsPage.page.waitForTimeout(300);

      // Card should still be visible and have content
      await expect(firstCard).toBeVisible();
      const svg = firstCard.locator('svg');
      await expect(svg).toBeVisible();
    });
  });

  test.describe('SVG Rendering', () => {
    test('should render all glyphs correctly', async () => {
      await glyphsPage.verifyAllGlyphsRender();
    });

    test('should have valid SVG attributes', async () => {
      const firstSVG = glyphsPage.glyphCards.first().locator('svg');

      // Verify SVG has viewBox
      const viewBox = await firstSVG.getAttribute('viewBox');
      expect(viewBox).toBeTruthy();

      // Verify SVG has content
      const innerHTML = await firstSVG.innerHTML();
      expect(innerHTML.length).toBeGreaterThan(0);
    });

    test('should render symbols with proper SVG', async () => {
      const symbolSVG = glyphsPage.hyphenCard.locator('svg');
      await expect(symbolSVG).toBeVisible();

      const viewBox = await symbolSVG.getAttribute('viewBox');
      expect(viewBox).toBeTruthy();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper card structure', async () => {
      const firstCard = glyphsPage.glyphCards.first();

      // Card should have label
      const label = firstCard.locator('.glyph-letter');
      await expect(label).toBeVisible();

      // Card should have preview
      const preview = firstCard.locator('.glyph-preview');
      await expect(preview).toBeVisible();
    });

    test('should support keyboard navigation', async () => {
      await glyphsPage.verifyKeyboardNavigation();
    });

    test('should have accessible button labels', async () => {
      const lightButton = await glyphsPage.lightThemeButton.textContent();
      expect(lightButton).toContain('Light');

      const darkButton = await glyphsPage.darkThemeButton.textContent();
      expect(darkButton).toContain('Dark');

      const bothButton = await glyphsPage.bothThemesButton.textContent();
      expect(bothButton).toContain('Both');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async () => {
      await glyphsPage.checkResponsiveLayout({ width: 375, height: 667 });

      // Grid should adapt to smaller viewport
      await expect(glyphsPage.lettersGrid).toBeVisible();
      await expect(glyphsPage.glyphCards.first()).toBeVisible();
    });

    test('should display correctly on tablet', async () => {
      await glyphsPage.checkResponsiveLayout({ width: 768, height: 1024 });

      // Verify grid layout works on tablet
      const cardCount = await glyphsPage.glyphCards.count();
      expect(cardCount).toBe(26);
    });

    test('should display correctly on desktop', async () => {
      await glyphsPage.checkResponsiveLayout({ width: 1920, height: 1080 });

      // All cards should be visible
      await expect(glyphsPage.glyphCards.first()).toBeVisible();
      await expect(glyphsPage.symbolCards.first()).toBeVisible();
    });

    test('should maintain grid on different viewports', async () => {
      const viewports = [
        { width: 375, height: 667 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1440, height: 900 }, // Laptop
        { width: 1920, height: 1080 }, // Desktop
      ];

      for (const viewport of viewports) {
        await glyphsPage.page.setViewportSize(viewport);
        await glyphsPage.page.waitForTimeout(300);

        // Grid should be visible at all sizes
        await expect(glyphsPage.lettersGrid).toBeVisible();

        const cardCount = await glyphsPage.glyphCards.count();
        expect(cardCount).toBe(26);
      }
    });
  });

  test.describe('Performance', () => {
    test('should render all glyphs quickly', async () => {
      const startTime = Date.now();
      await glyphsPage.goto();
      const endTime = Date.now();

      // Page should load in under 3 seconds
      expect(endTime - startTime).toBeLessThan(3000);
    });

    test('should switch themes quickly', async () => {
      const startTime = Date.now();
      await glyphsPage.lightThemeButton.click();
      await glyphsPage.page.waitForTimeout(500);
      const endTime = Date.now();

      // Theme switch should be fast (< 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  test.describe('Content Verification', () => {
    test('should have description text', async () => {
      const lettersDescription = glyphsPage.page.locator('text=Browse all 26 letter glyphs');
      await expect(lettersDescription).toBeVisible();

      const symbolsDescription = glyphsPage.page.locator(
        'text=The font includes 6 special symbol glyphs',
      );
      await expect(symbolsDescription).toBeVisible();
    });

    test('should have theme comparison section', async () => {
      const themeHeading = glyphsPage.page.locator('h2').filter({ hasText: 'Theme Comparison' });
      await expect(themeHeading).toBeVisible();

      const themeDescription = glyphsPage.page.locator(
        'text=See how glyphs look in both light and dark themes',
      );
      await expect(themeDescription).toBeVisible();
    });
  });
});
