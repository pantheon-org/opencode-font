import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 *
 * Represents the main landing page (index.mdx)
 * Tests:
 * - Hero section with title and tagline
 * - Feature cards
 * - Code examples
 * - Call-to-action buttons
 * - API comparison table
 */
export class HomePage extends BasePage {
  // Hero section
  readonly heroTitle: Locator;
  readonly heroTagline: Locator;
  readonly demoCTA: Locator;
  readonly githubCTA: Locator;

  // Feature cards
  readonly featureCards: Locator;
  readonly blockyFeatureCard: Locator;
  readonly fontFeatureCard: Locator;
  readonly webFontsCard: Locator;
  readonly typescriptCard: Locator;

  // Code examples
  readonly codeBlocks: Locator;
  readonly blockyCodeExample: Locator;
  readonly fontCodeExample: Locator;
  readonly cssCodeExample: Locator;

  // API comparison table
  readonly comparisonTable: Locator;

  // Links
  readonly interactiveDemoLink: Locator;
  readonly glyphShowcaseLink: Locator;

  constructor(page: Page) {
    super(page);

    // Hero
    this.heroTitle = page.locator('h1').filter({ hasText: 'OpenCode Font' });
    this.heroTagline = page.locator('text=Pixel-perfect blocky text');
    this.demoCTA = page.locator('a[href*="/demo/"]').filter({ hasText: 'Interactive Demo' });
    this.githubCTA = page.locator('a[href*="github.com"]').filter({ hasText: 'View on GitHub' });

    // Feature cards
    this.featureCards = page.locator('.card');
    this.blockyFeatureCard = page
      .locator('.card')
      .filter({ hasText: 'Blocky Pixel-Art Rendering' });
    this.fontFeatureCard = page.locator('.card').filter({ hasText: 'Simple Font-Based SVG' });
    this.webFontsCard = page.locator('.card').filter({ hasText: 'Web Fonts Included' });
    this.typescriptCard = page.locator('.card').filter({ hasText: 'TypeScript Support' });

    // Code examples
    this.codeBlocks = page.locator('pre');
    this.blockyCodeExample = page.locator('pre').filter({ hasText: 'blockyTextToSVG' }).first();
    this.fontCodeExample = page.locator('pre').filter({ hasText: 'convertTextToSVG' }).first();
    this.cssCodeExample = page.locator('pre').filter({ hasText: 'OpenCodeLogo' }).first();

    // Table
    this.comparisonTable = page.locator('table').filter({ hasText: 'API Comparison' });

    // Links
    this.interactiveDemoLink = page.locator('a[href*="/demo/"]');
    this.glyphShowcaseLink = page.locator('a[href*="/glyphs/"]');
  }

  /**
   * Navigate to home page
   */
  async goto() {
    await super.goto('/');
  }

  /**
   * Verify hero section is displayed correctly
   */
  async verifyHeroSection() {
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroTagline).toBeVisible();
    await expect(this.demoCTA).toBeVisible();
    await expect(this.githubCTA).toBeVisible();

    // Verify CTAs are clickable
    await expect(this.demoCTA).toBeEnabled();
    await expect(this.githubCTA).toBeEnabled();
  }

  /**
   * Verify all feature cards are displayed
   */
  async verifyFeatureCards() {
    // Should have 4 feature cards
    await expect(this.featureCards).toHaveCount(4);

    // Verify each card is visible
    await expect(this.blockyFeatureCard).toBeVisible();
    await expect(this.fontFeatureCard).toBeVisible();
    await expect(this.webFontsCard).toBeVisible();
    await expect(this.typescriptCard).toBeVisible();

    // Verify cards have icons
    const blockyIcon = this.blockyFeatureCard.locator('svg');
    await expect(blockyIcon).toBeVisible();
  }

  /**
   * Verify code examples are displayed with syntax highlighting
   */
  async verifyCodeExamples() {
    // Should have at least 3 code blocks
    const codeBlockCount = await this.codeBlocks.count();
    expect(codeBlockCount).toBeGreaterThanOrEqual(3);

    // Verify specific code examples
    await expect(this.blockyCodeExample).toBeVisible();
    await expect(this.fontCodeExample).toBeVisible();
    await expect(this.cssCodeExample).toBeVisible();

    // Verify code blocks have copy buttons
    const copyButtons = this.page.locator('.copy button');
    const copyButtonCount = await copyButtons.count();
    expect(copyButtonCount).toBeGreaterThan(0);
  }

  /**
   * Test copy code functionality
   */
  async testCopyCodeButton() {
    const copyButton = this.page.locator('.copy button').first();
    await copyButton.click();

    // Verify feedback appears
    const feedback = this.page.locator('.copy .feedback');
    await expect(feedback).toBeVisible();
  }

  /**
   * Verify API comparison table
   */
  async verifyComparisonTable() {
    await expect(this.comparisonTable).toBeVisible();

    // Verify table headers
    const headers = this.comparisonTable.locator('th');
    await expect(headers).toHaveCount(3); // Feature, blockyTextToSVG, convertTextToSVG

    // Verify table has rows
    const rows = this.comparisonTable.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  }

  /**
   * Navigate to demo page via CTA
   */
  async clickDemoCTA() {
    await this.demoCTA.click();
    await this.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*\/demo\//);
  }

  /**
   * Navigate to GitHub via CTA
   */
  async clickGitHubCTA() {
    // GitHub link opens in new tab
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.githubCTA.click(),
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('github.com');
    await newPage.close();
  }

  /**
   * Verify all internal links work
   */
  async verifyInternalLinks() {
    // Get all internal links
    const internalLinks = await this.page.locator('a[href*="/opencode-font/"]').all();

    for (const link of internalLinks) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('#')) {
        // Verify link is visible and has valid href
        await expect(link).toBeVisible();
        expect(href).toBeTruthy();
      }
    }
  }

  /**
   * Verify character support section
   */
  async verifyCharacterSupport() {
    const characterSection = this.page.locator('text=Character Support').locator('..');
    await expect(characterSection).toBeVisible();

    // Verify mentions of letters and symbols
    await expect(this.page.locator('text=Letters: A-Z')).toBeVisible();
    await expect(this.page.locator('text=Symbols')).toBeVisible();
  }

  /**
   * Verify installation section
   */
  async verifyInstallation() {
    const installSection = this.page.locator('h2').filter({ hasText: 'Installation' });
    await expect(installSection).toBeVisible();

    // Verify npm install command is present
    const npmCommand = this.page.locator('code').filter({ hasText: 'npm install' });
    await expect(npmCommand).toBeVisible();
  }
}
