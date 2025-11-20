import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model
 *
 * Provides common functionality shared across all pages:
 * - Header navigation
 * - Sidebar navigation
 * - Theme switching
 * - Search functionality
 * - Accessibility helpers
 */
export class BasePage {
  readonly page: Page;

  // Header elements
  readonly header: Locator;
  readonly logo: Locator;
  readonly searchButton: Locator;
  readonly githubLink: Locator;
  readonly discordLink: Locator;

  // Sidebar elements
  readonly sidebar: Locator;
  readonly sidebarHomeLink: Locator;
  readonly sidebarDemoLink: Locator;
  readonly sidebarGlyphsLink: Locator;

  // Mobile elements
  readonly mobileMenuButton: Locator;
  readonly mobileTOC: Locator;

  // Main content
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.header = page.locator('header');
    this.logo = page.locator('.site-title');
    this.searchButton = page.locator('button[data-open-modal]');
    this.githubLink = page.locator('a[href*="github.com"]').first();
    this.discordLink = page.locator('a[href*="discord"]').first();

    // Sidebar
    this.sidebar = page.locator('nav.sidebar');
    this.sidebarHomeLink = page.locator('nav.sidebar a[href="/opencode-font/"]');
    this.sidebarDemoLink = page.locator('nav.sidebar a[href="/opencode-font/demo/"]');
    this.sidebarGlyphsLink = page.locator('nav.sidebar a[href="/opencode-font/glyphs/"]');

    // Mobile
    this.mobileMenuButton = page.locator('starlight-menu-button button');
    this.mobileTOC = page.locator('mobile-starlight-toc');

    // Main content
    this.mainContent = page.locator('main');
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if header is visible and contains expected elements
   */
  async verifyHeader() {
    await expect(this.header).toBeVisible();
    await expect(this.logo).toBeVisible();

    // Verify logo contains SVG (custom OpenCode font rendering)
    const logoSVG = this.logo.locator('svg');
    await expect(logoSVG).toBeVisible();
  }

  /**
   * Check if sidebar is visible (desktop only)
   */
  async verifySidebar() {
    const viewportSize = this.page.viewportSize();
    if (viewportSize && viewportSize.width >= 1024) {
      await expect(this.sidebar).toBeVisible();
      await expect(this.sidebarHomeLink).toBeVisible();
      await expect(this.sidebarDemoLink).toBeVisible();
      await expect(this.sidebarGlyphsLink).toBeVisible();
    }
  }

  /**
   * Navigate using sidebar links
   */
  async navigateToHome() {
    await this.sidebarHomeLink.click();
    await this.waitForPageLoad();
  }

  async navigateToDemo() {
    await this.sidebarDemoLink.click();
    await this.waitForPageLoad();
  }

  async navigateToGlyphs() {
    await this.sidebarGlyphsLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Open search dialog
   */
  async openSearch() {
    await this.searchButton.click();
    const searchDialog = this.page.locator('dialog[aria-label="Search"]');
    await expect(searchDialog).toBeVisible();
    return searchDialog;
  }

  /**
   * Check accessibility - heading hierarchy
   */
  async verifyHeadingHierarchy() {
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1

    // Verify h1 is visible
    const h1 = this.page.locator('h1').first();
    await expect(h1).toBeVisible();
  }

  /**
   * Check accessibility - images have alt text
   */
  async verifyImageAltText() {
    const images = this.page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Alt can be empty string for decorative images, but should exist
      expect(alt).not.toBeNull();
    }
  }

  /**
   * Check accessibility - keyboard navigation
   */
  async verifyKeyboardNavigation() {
    // Tab to first focusable element
    await this.page.keyboard.press('Tab');

    // Check that something is focused
    const focusedElement = await this.page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        role: el?.getAttribute('role'),
        ariaLabel: el?.getAttribute('aria-label'),
      };
    });

    expect(focusedElement.tagName).toBeTruthy();
  }

  /**
   * Verify custom font is loaded
   */
  async verifyFontLoading() {
    // Wait for fonts to load
    await this.page.waitForFunction(() => document.fonts.ready);

    // Check if OpenCodeLogo font is available
    const fontLoaded = await this.page.evaluate(() => {
      return document.fonts.check('1em OpenCodeLogo');
    });

    expect(fontLoaded).toBeTruthy();
  }

  /**
   * Check for console errors
   */
  async verifyNoConsoleErrors() {
    const errors: string[] = [];

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit for any async errors
    await this.page.waitForTimeout(1000);

    // Filter out known acceptable errors (if any)
    const criticalErrors = errors.filter((error) => {
      // Add filters for known non-critical errors
      return !error.includes('favicon'); // Example: ignore favicon errors
    });

    expect(criticalErrors).toHaveLength(0);
  }

  /**
   * Measure page load performance
   */
  async measurePerformance() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint:
          paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    return metrics;
  }

  /**
   * Take a full page screenshot
   */
  async takeFullPageScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Check responsive design at different viewports
   */
  async checkResponsiveLayout(viewport: { width: number; height: number }) {
    await this.page.setViewportSize(viewport);
    await this.waitForPageLoad();

    // Verify layout doesn't break
    const hasHorizontalScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // Horizontal scroll is acceptable, but check it's not excessive
    if (hasHorizontalScroll) {
      const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);

      // Allow small overflow (e.g., scrollbar)
      expect(scrollWidth - clientWidth).toBeLessThan(20);
    }
  }
}
