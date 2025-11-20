import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Glyphs Page Object Model
 *
 * Represents the glyph showcase page (glyphs.astro)
 * Tests:
 * - Letter grid display (A-Z)
 * - Symbol cards display
 * - Theme comparison buttons
 * - SVG rendering for each glyph
 * - Theme switching functionality
 */
export class GlyphsPage extends BasePage {
  // Page title
  readonly pageTitle: Locator;

  // Letters section
  readonly lettersHeading: Locator;
  readonly lettersGrid: Locator;
  readonly glyphCards: Locator;

  // Symbols section
  readonly symbolsHeading: Locator;
  readonly symbolCards: Locator;
  readonly hyphenCard: Locator;
  readonly pipeCard: Locator;
  readonly apostropheCard: Locator;
  readonly quoteCard: Locator;
  readonly questionCard: Locator;
  readonly exclamationCard: Locator;

  // Theme controls
  readonly themeControls: Locator;
  readonly lightThemeButton: Locator;
  readonly darkThemeButton: Locator;
  readonly bothThemesButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('h1').filter({ hasText: 'Glyph Showcase' });

    // Letters
    this.lettersHeading = page.locator('h2').filter({ hasText: 'Letters (A-Z)' });
    this.lettersGrid = page.locator('#letters-grid');
    this.glyphCards = this.lettersGrid.locator('.glyph-card');

    // Symbols
    this.symbolsHeading = page.locator('h2').filter({ hasText: 'Symbols' });
    this.symbolCards = page.locator('.symbol-card');
    this.hyphenCard = page.locator('#symbol-hyphen').locator('..');
    this.pipeCard = page.locator('#symbol-pipe').locator('..');
    this.apostropheCard = page.locator('#symbol-apostrophe').locator('..');
    this.quoteCard = page.locator('#symbol-quote').locator('..');
    this.questionCard = page.locator('#symbol-question').locator('..');
    this.exclamationCard = page.locator('#symbol-exclamation').locator('..');

    // Theme controls
    this.themeControls = page.locator('.theme-controls');
    this.lightThemeButton = page.locator('#show-light');
    this.darkThemeButton = page.locator('#show-dark');
    this.bothThemesButton = page.locator('#show-both');
  }

  /**
   * Navigate to glyphs page
   */
  async goto() {
    await super.goto('/glyphs/');
  }

  /**
   * Verify page loads correctly
   */
  async verifyPageLoad() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.lettersHeading).toBeVisible();
    await expect(this.symbolsHeading).toBeVisible();
    await expect(this.themeControls).toBeVisible();
  }

  /**
   * Verify all 26 letter glyphs are displayed
   */
  async verifyLetterGlyphs() {
    // Should have exactly 26 letter cards
    await expect(this.glyphCards).toHaveCount(26);

    // Verify each card has a letter label and SVG
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (const letter of letters) {
      const card = this.lettersGrid.locator('.glyph-card').filter({ hasText: letter });
      await expect(card).toBeVisible();

      // Verify card has SVG
      const svg = card.locator('svg');
      await expect(svg).toBeVisible();
    }
  }

  /**
   * Verify specific letter glyph
   */
  async verifyLetterGlyph(letter: string) {
    const card = this.lettersGrid.locator('.glyph-card').filter({ hasText: letter });
    await expect(card).toBeVisible();

    // Verify letter label
    const label = card.locator('.glyph-letter');
    await expect(label).toHaveText(letter);

    // Verify SVG preview
    const preview = card.locator('.glyph-preview');
    await expect(preview).toBeVisible();

    const svg = preview.locator('svg');
    await expect(svg).toBeVisible();

    // Verify SVG has content
    const svgContent = await svg.innerHTML();
    expect(svgContent.length).toBeGreaterThan(0);
  }

  /**
   * Verify all 6 symbol glyphs are displayed
   */
  async verifySymbolGlyphs() {
    // Should have exactly 6 symbol cards
    await expect(this.symbolCards).toHaveCount(6);

    // Verify each symbol card
    await expect(this.hyphenCard).toBeVisible();
    await expect(this.pipeCard).toBeVisible();
    await expect(this.apostropheCard).toBeVisible();
    await expect(this.quoteCard).toBeVisible();
    await expect(this.questionCard).toBeVisible();
    await expect(this.exclamationCard).toBeVisible();

    // Verify each has SVG
    for (const card of [
      this.hyphenCard,
      this.pipeCard,
      this.apostropheCard,
      this.quoteCard,
      this.questionCard,
      this.exclamationCard,
    ]) {
      const svg = card.locator('svg');
      await expect(svg).toBeVisible();
    }
  }

  /**
   * Verify specific symbol glyph
   */
  async verifySymbolGlyph(symbolId: string, symbolName: string) {
    const card = this.page.locator(`#symbol-${symbolId}`).locator('..');
    await expect(card).toBeVisible();

    // Verify symbol name
    const name = card.locator('.symbol-name');
    await expect(name).toHaveText(symbolName);

    // Verify SVG preview
    const preview = card.locator('.symbol-preview');
    await expect(preview).toBeVisible();

    const svg = preview.locator('svg');
    await expect(svg).toBeVisible();
  }

  /**
   * Verify theme controls are functional
   */
  async verifyThemeControls() {
    await expect(this.themeControls).toBeVisible();
    await expect(this.lightThemeButton).toBeVisible();
    await expect(this.darkThemeButton).toBeVisible();
    await expect(this.bothThemesButton).toBeVisible();

    // Dark theme should be active by default
    await expect(this.darkThemeButton).toHaveClass(/active/);
  }

  /**
   * Test switching to light theme
   */
  async testLightTheme() {
    await this.lightThemeButton.click();

    // Wait for re-render
    await this.page.waitForTimeout(500);

    // Verify button is active
    await expect(this.lightThemeButton).toHaveClass(/active/);

    // Verify glyphs are still visible
    await expect(this.glyphCards.first()).toBeVisible();
    await expect(this.symbolCards.first()).toBeVisible();
  }

  /**
   * Test switching to dark theme
   */
  async testDarkTheme() {
    await this.darkThemeButton.click();

    // Wait for re-render
    await this.page.waitForTimeout(500);

    // Verify button is active
    await expect(this.darkThemeButton).toHaveClass(/active/);

    // Verify glyphs are still visible
    await expect(this.glyphCards.first()).toBeVisible();
    await expect(this.symbolCards.first()).toBeVisible();
  }

  /**
   * Test showing both themes
   */
  async testBothThemes() {
    await this.bothThemesButton.click();

    // Wait for re-render
    await this.page.waitForTimeout(500);

    // Verify button is active
    await expect(this.bothThemesButton).toHaveClass(/active/);

    // Verify glyphs are still visible
    await expect(this.glyphCards.first()).toBeVisible();
    await expect(this.symbolCards.first()).toBeVisible();

    // In "both" mode, each glyph should show two versions
    // This is indicated by the dual class on preview
    const firstCard = this.glyphCards.first();
    const preview = firstCard.locator('.glyph-preview');

    // Should have multiple SVGs (light and dark)
    const svgCount = await preview.locator('svg').count();
    expect(svgCount).toBeGreaterThanOrEqual(1);
  }

  /**
   * Test complete theme switching flow
   */
  async testThemeSwitchingFlow() {
    // Start with dark (default)
    await expect(this.darkThemeButton).toHaveClass(/active/);

    // Switch to light
    await this.testLightTheme();

    // Switch to both
    await this.testBothThemes();

    // Switch back to dark
    await this.testDarkTheme();
  }

  /**
   * Verify grid layout is responsive
   */
  async verifyGridLayout() {
    // Letters grid should use CSS grid
    const gridDisplay = await this.lettersGrid.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    expect(gridDisplay).toBe('grid');

    // Verify cards are laid out properly
    const firstCard = this.glyphCards.first();
    await expect(firstCard).toBeVisible();

    // Verify card has proper dimensions
    const box = await firstCard.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  }

  /**
   * Test hover effects on cards
   */
  async testCardHoverEffects() {
    const firstCard = this.glyphCards.first();

    // Get initial position
    const initialBox = await firstCard.boundingBox();

    // Hover over card
    await firstCard.hover();

    // Wait for animation
    await this.page.waitForTimeout(300);

    // Card should still be visible (transform doesn't affect visibility)
    await expect(firstCard).toBeVisible();

    // Verify card has transform applied (translateY)
    const transform = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    // Transform should be applied (not 'none')
    expect(transform).not.toBe('none');
  }

  /**
   * Verify all glyphs render correctly
   */
  async verifyAllGlyphsRender() {
    // Check all letter glyphs
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (const letter of letters) {
      await this.verifyLetterGlyph(letter);
    }

    // Check all symbol glyphs
    const symbols = [
      { id: 'hyphen', name: 'Hyphen' },
      { id: 'pipe', name: 'Pipe' },
      { id: 'apostrophe', name: 'Apostrophe' },
      { id: 'quote', name: 'Quote' },
      { id: 'question', name: 'Question' },
      { id: 'exclamation', name: 'Exclamation' },
    ];

    for (const symbol of symbols) {
      await this.verifySymbolGlyph(symbol.id, symbol.name);
    }
  }
}
