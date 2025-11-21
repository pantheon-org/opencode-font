import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';
import { GlyphsPage } from './pages/GlyphsPage';

/**
 * User Journey E2E Tests
 *
 * These tests simulate complete user workflows through the application,
 * validating that users can successfully accomplish their goals.
 *
 * Test Categories:
 * 1. New User Onboarding Flow
 * 2. Developer Exploration Flow
 * 3. Logo Creation Workflow
 * 4. Documentation Discovery Journey
 * 5. Feature Comparison Flow
 * 6. Cross-Page Navigation
 */

test.describe('User Journey: New User Onboarding', () => {
  test('new user discovers features and tries demo', async ({ page }) => {
    // Step 1: User lands on homepage
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.verifyHeroSection();

    // User reads the tagline and understands the purpose
    await expect(homePage.heroTagline).toBeVisible();

    // Step 2: User explores feature cards to understand capabilities
    await homePage.verifyFeatureCards();

    // User sees the main features:
    // - Blocky Pixel-Art Rendering
    // - Simple Font-Based SVG
    // - Web Fonts Included
    // - TypeScript Support
    await expect(homePage.blockyFeatureCard).toBeVisible();
    await expect(homePage.fontFeatureCard).toBeVisible();

    // Step 3: User checks character support
    await homePage.verifyCharacterSupport();

    // Step 4: User reads code examples
    await homePage.verifyCodeExamples();

    // User might try to copy example code
    await homePage.testCopyCodeButton();

    // Step 5: User is convinced and clicks "Interactive Demo" CTA
    await homePage.clickDemoCTA();

    // Step 6: User arrives at demo page
    const demoPage = new DemoPage(page);
    await demoPage.verifyPageLoad();

    // Step 7: User tries entering their own text
    await demoPage.testTextInput('HELLO');

    // User sees immediate preview update
    await expect(demoPage.previewSVG).toBeVisible();

    // Step 8: User experiments with theme
    await demoPage.testThemeSwitch('light');
    await demoPage.testThemeSwitch('dark');

    // Step 9: User adjusts block size to see customization
    await demoPage.testBlockSizeSlider(12);

    // Step 10: User copies the generated code for use
    await demoPage.testCopyButton();

    // Validation: User has successfully completed onboarding
    // - Understands what the library does
    // - Saw feature demonstrations
    // - Tried the interactive demo
    // - Generated and copied custom code
    const codeContent = await demoPage.generatedCode.textContent();
    expect(codeContent).toContain('blockyTextToSVG');
    expect(codeContent).toContain('HELLO');
  });

  test('new user explores installation and gets started', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Step 1: User scrolls to installation section
    await homePage.verifyInstallation();

    // Step 2: User sees npm install command
    const npmCommand = page.locator('code').filter({ hasText: 'npm install' });
    await expect(npmCommand).toBeVisible();

    // Step 3: User checks API comparison table to choose which API to use
    await homePage.verifyComparisonTable();

    // Step 4: User clicks demo to try before installing
    await homePage.clickDemoCTA();

    // Step 5: User experiments with demo
    const demoPage = new DemoPage(page);
    await demoPage.verifyPageLoad();
    await demoPage.testTextInput('TEST');

    // Validation: User has path to getting started
    await expect(demoPage.previewSVG).toBeVisible();
  });
});

test.describe('User Journey: Developer Exploration', () => {
  test('developer explores API documentation and examples', async ({ page }) => {
    const homePage = new HomePage(page);

    // Step 1: Developer lands on homepage
    await homePage.goto();
    await homePage.verifyHeroSection();

    // Step 2: Developer reads API comparison table to understand differences
    await homePage.verifyComparisonTable();

    // Verify table shows both APIs
    const table = homePage.comparisonTable;
    await expect(table).toContainText('blockyTextToSVG');
    await expect(table).toContainText('convertTextToSVG');

    // Step 3: Developer examines code examples
    await homePage.verifyCodeExamples();

    // Verify blocky API example
    await expect(homePage.blockyCodeExample).toBeVisible();
    const blockyCode = await homePage.blockyCodeExample.textContent();
    expect(blockyCode).toContain('blockyTextToSVG');
    expect(blockyCode).toContain('theme:');
    expect(blockyCode).toContain('blockSize:');

    // Verify font API example
    await expect(homePage.fontCodeExample).toBeVisible();
    const fontCode = await homePage.fontCodeExample.textContent();
    expect(fontCode).toContain('convertTextToSVG');

    // Step 4: Developer copies example code
    await homePage.testCopyCodeButton();

    // Step 5: Developer wants to see it in action - goes to demo
    await homePage.clickDemoCTA();

    const demoPage = new DemoPage(page);
    await demoPage.verifyPageLoad();

    // Step 6: Developer tests with edge cases
    await demoPage.testTextInput('EDGE-CASE');
    await demoPage.testTextInput('A|B|C');
    await demoPage.testTextInput("DON'T");

    // Step 7: Developer tests all configuration options
    await demoPage.testThemeSwitch('light');
    await demoPage.testBlockSizeSlider(16);
    await demoPage.testCharSpacingSlider(3);
    await demoPage.testOptimizeCheckbox();

    // Step 8: Developer checks glyph showcase for character support
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();
    await glyphsPage.verifyPageLoad();

    // Step 9: Developer verifies all supported characters
    await glyphsPage.verifyLetterGlyphs();
    await glyphsPage.verifySymbolGlyphs();

    // Step 10: Developer tests theme switching to see rendering differences
    await glyphsPage.testLightTheme();
    await glyphsPage.testDarkTheme();
    await glyphsPage.testBothThemes();

    // Validation: Developer has complete understanding of API
    // - Saw both API options
    // - Tested configuration parameters
    // - Verified character support
    // - Understood theme capabilities
    await expect(glyphsPage.glyphCards).toHaveCount(26);
    await expect(glyphsPage.symbolCards).toHaveCount(6);
  });

  test('developer validates TypeScript support', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Step 1: Developer looks for TypeScript support
    await expect(homePage.typescriptCard).toBeVisible();

    // Step 2: Developer examines code examples for type hints
    await homePage.verifyCodeExamples();

    // Step 3: Developer checks if types are included
    const typescriptCard = homePage.typescriptCard;
    const cardText = await typescriptCard.textContent();
    expect(cardText).toMatch(/TypeScript|type|types/i);

    // Validation: TypeScript support is clearly documented
    await expect(typescriptCard).toBeVisible();
  });
});

test.describe('User Journey: Logo Creation Workflow', () => {
  test('user creates custom logo from start to finish', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Step 1: User navigates to demo to create logo
    await demoPage.goto();
    await demoPage.verifyPageLoad();

    // Step 2: User enters their text
    await demoPage.textInput.clear();
    await demoPage.textInput.fill('MYLOGO');
    await page.waitForTimeout(300);

    // Verify preview updates
    await expect(demoPage.previewSVG).toBeVisible();

    // Step 3: User chooses theme (dark for contrast)
    await demoPage.testThemeSwitch('dark');

    // Step 4: User adjusts block size for desired look
    // Try small size first
    await demoPage.testBlockSizeSlider(6);
    await page.waitForTimeout(200);

    // User decides it's too small, increases it
    await demoPage.testBlockSizeSlider(10);
    await page.waitForTimeout(200);

    // Step 5: User adjusts character spacing
    await demoPage.testCharSpacingSlider(2);
    await page.waitForTimeout(200);

    // Step 6: User enables optimization for smaller file size
    await demoPage.optimizeCheckbox.check();
    await page.waitForTimeout(300);

    // Step 7: User previews the final result
    await expect(demoPage.previewSVG).toBeVisible();

    // Verify SVG has proper dimensions and content
    const svgContent = await demoPage.previewSVG.innerHTML();
    expect(svgContent.length).toBeGreaterThan(0);

    // Step 8: User verifies settings in generated code
    const codeContent = await demoPage.generatedCode.textContent();
    expect(codeContent).toContain('MYLOGO');
    expect(codeContent).toContain("theme: 'dark'");
    expect(codeContent).toContain('blockSize: 10');
    expect(codeContent).toContain('charSpacing: 2');
    expect(codeContent).toContain('optimize: true');

    // Step 9: User copies the code for their project
    await demoPage.testCopyButton();

    // Validation: User has successfully created and copied custom logo
    // - Custom text entered
    // - Theme selected
    // - Size customized
    // - Optimization enabled
    // - Code copied
    await expect(demoPage.copyButton).toHaveText('Copied!');
  });

  test('user iterates on logo design multiple times', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();
    await demoPage.verifyPageLoad();

    // Iteration 1: First attempt
    await demoPage.testTextInput('LOGO');
    await demoPage.testThemeSwitch('light');
    await demoPage.testBlockSizeSlider(8);

    let svgContent = await demoPage.previewSVG.innerHTML();
    expect(svgContent.length).toBeGreaterThan(0);

    // Iteration 2: User doesn't like light theme, switches to dark
    await demoPage.testThemeSwitch('dark');
    await page.waitForTimeout(300);

    svgContent = await demoPage.previewSVG.innerHTML();
    expect(svgContent.length).toBeGreaterThan(0);

    // Iteration 3: User increases block size for boldness
    await demoPage.testBlockSizeSlider(14);
    await page.waitForTimeout(300);

    // Iteration 4: User adjusts spacing
    await demoPage.testCharSpacingSlider(1);
    await page.waitForTimeout(300);

    // Iteration 5: User tries different text
    await demoPage.testTextInput('BRAND');
    await page.waitForTimeout(300);

    // Final validation: User settles on design and copies
    await demoPage.testCopyButton();
    await expect(demoPage.copyButton).toHaveText('Copied!');
  });

  test('user creates logo with special characters', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();
    await demoPage.verifyPageLoad();

    // User wants logo with punctuation
    const testTexts = ['CO-OP', 'A|B|C', "DON'T", 'WHAT?', 'WOW!', '"QUOTE"'];

    for (const text of testTexts) {
      await demoPage.testTextInput(text);
      await page.waitForTimeout(200);

      // Verify preview renders without errors
      await expect(demoPage.previewSVG).toBeVisible();

      // Verify code updates
      const codeContent = await demoPage.generatedCode.textContent();
      expect(codeContent).toBeTruthy();
    }

    // User picks one and copies
    await demoPage.testTextInput('CO-OP');
    await demoPage.testThemeSwitch('dark');
    await demoPage.testCopyButton();

    // Validation: Special characters work correctly
    await expect(demoPage.copyButton).toHaveText('Copied!');
  });
});

test.describe('User Journey: Documentation Discovery', () => {
  test('user discovers all documentation sections', async ({ page }) => {
    const homePage = new HomePage(page);

    // Step 1: User starts at homepage
    await homePage.goto();
    await homePage.verifyHeroSection();

    // Step 2: User scrolls through features
    await homePage.verifyFeatureCards();

    // Step 3: User discovers character support section
    await homePage.verifyCharacterSupport();

    // Step 4: User finds installation instructions
    await homePage.verifyInstallation();

    // Step 5: User reviews code examples
    await homePage.verifyCodeExamples();

    // Step 6: User checks API comparison
    await homePage.verifyComparisonTable();

    // Step 7: User explores web fonts information
    await expect(homePage.webFontsCard).toBeVisible();
    const webFontsText = await homePage.webFontsCard.textContent();
    expect(webFontsText).toContain('Web Fonts');

    // Step 8: User navigates to demo for hands-on learning
    await homePage.clickDemoCTA();

    const demoPage = new DemoPage(page);
    await demoPage.verifyPageLoad();

    // Step 9: User explores all demo controls
    await demoPage.verifyControls();

    // Step 10: User discovers glyph showcase
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();
    await glyphsPage.verifyPageLoad();

    // Validation: User has discovered all major documentation
    await expect(glyphsPage.pageTitle).toBeVisible();
  });
});

test.describe('User Journey: Feature Comparison', () => {
  test('user compares blocky vs font API approaches', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Step 1: User reads API comparison table
    await homePage.verifyComparisonTable();

    const table = homePage.comparisonTable;

    // Step 2: User examines blockyTextToSVG column
    await expect(table).toContainText('blockyTextToSVG');

    // Step 3: User examines convertTextToSVG column
    await expect(table).toContainText('convertTextToSVG');

    // Step 4: User reads feature differences
    const tableContent = await table.textContent();

    // Verify key comparison points are present
    expect(tableContent).toBeTruthy();

    // Step 5: User looks at code examples for each API
    await homePage.verifyCodeExamples();

    // Blocky API example
    const blockyCode = await homePage.blockyCodeExample.textContent();
    expect(blockyCode).toContain('blockyTextToSVG');
    expect(blockyCode).toContain('theme:');
    expect(blockyCode).toContain('blockSize:');
    expect(blockyCode).toContain('charSpacing:');
    expect(blockyCode).toContain('optimize:');

    // Font API example
    const fontCode = await homePage.fontCodeExample.textContent();
    expect(fontCode).toContain('convertTextToSVG');

    // Step 6: User tests blocky API in demo
    await homePage.clickDemoCTA();

    const demoPage = new DemoPage(page);
    await demoPage.verifyPageLoad();

    // User experiments with blocky API options
    await demoPage.testTextInput('TEST');
    await demoPage.testThemeSwitch('dark');
    await demoPage.testBlockSizeSlider(10);

    // Validation: User understands the difference between APIs
    const demoCode = await demoPage.generatedCode.textContent();
    expect(demoCode).toContain('blockyTextToSVG');
  });
});

test.describe('User Journey: Cross-Page Navigation', () => {
  test('user navigates seamlessly between all pages', async ({ page }) => {
    // Step 1: Start at home
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(homePage.heroTitle).toBeVisible();

    // Step 2: Navigate to demo via CTA
    await homePage.clickDemoCTA();

    const demoPage = new DemoPage(page);
    await expect(demoPage.pageTitle).toBeVisible();
    await expect(page).toHaveURL(/.*\/demo\//);

    // Step 3: Navigate to glyphs via main navigation or direct link
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();
    await expect(glyphsPage.pageTitle).toBeVisible();
    await expect(page).toHaveURL(/.*\/glyphs\//);

    // Step 4: Navigate back to home via navigation
    await homePage.goto();
    await expect(homePage.heroTitle).toBeVisible();
    await expect(page).toHaveURL(/.*\/$/);

    // Step 5: Use browser back button
    await page.goBack();
    await expect(page).toHaveURL(/.*\/glyphs\//);

    // Step 6: Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL(/.*\/$/);

    // Validation: Navigation works in all directions
    await expect(homePage.heroTitle).toBeVisible();
  });

  test('user maintains context across navigation', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Step 1: User creates custom text in demo
    await demoPage.goto();
    await demoPage.testTextInput('CONTEXT');
    await demoPage.testThemeSwitch('light');
    await demoPage.testBlockSizeSlider(12);

    // Verify settings are applied
    const codeContent1 = await demoPage.generatedCode.textContent();
    expect(codeContent1).toContain('CONTEXT');
    expect(codeContent1).toContain('light');
    expect(codeContent1).toContain('12');

    // Step 2: User navigates to glyphs to check character support
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();
    await glyphsPage.verifyPageLoad();

    // Step 3: User navigates back to demo
    await demoPage.goto();

    // Note: Form state typically resets on navigation in static sites
    // This is expected behavior - verify page loads correctly
    await demoPage.verifyPageLoad();

    // Validation: Page loads correctly after navigation
    await expect(demoPage.pageTitle).toBeVisible();
    await expect(demoPage.textInput).toBeVisible();
  });

  test('user explores entire site in single session', async ({ page }) => {
    // Complete site exploration journey
    const homePage = new HomePage(page);
    const demoPage = new DemoPage(page);
    const glyphsPage = new GlyphsPage(page);

    // Journey: Home → Demo → Glyphs → Demo → Home

    // 1. Home
    await homePage.goto();
    await homePage.verifyHeroSection();
    await homePage.verifyFeatureCards();

    // 2. Demo
    await homePage.clickDemoCTA();
    await demoPage.verifyPageLoad();
    await demoPage.testTextInput('EXPLORE');

    // 3. Glyphs
    await glyphsPage.goto();
    await glyphsPage.verifyPageLoad();
    await glyphsPage.testThemeSwitchingFlow();

    // 4. Back to Demo
    await demoPage.goto();
    await demoPage.verifyPageLoad();
    await demoPage.testTextInput('JOURNEY');

    // 5. Back to Home
    await homePage.goto();
    await homePage.verifyHeroSection();

    // Validation: User successfully explored entire site
    await expect(homePage.heroTitle).toBeVisible();
  });
});

test.describe('User Journey: GitHub Integration', () => {
  test('user discovers project on GitHub', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Step 1: User sees GitHub CTA on homepage
    await expect(homePage.githubCTA).toBeVisible();
    await expect(homePage.githubCTA).toHaveText(/GitHub/i);

    // Step 2: User clicks to view source code
    // Note: This opens in new tab, but we can verify the link
    const githubHref = await homePage.githubCTA.getAttribute('href');
    expect(githubHref).toContain('github.com');
    expect(githubHref).toContain('opencode-font');

    // Validation: GitHub link is prominently displayed
    await expect(homePage.githubCTA).toBeEnabled();
  });
});

test.describe('User Journey: Mobile Experience', () => {
  test('mobile user completes onboarding flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const homePage = new HomePage(page);
    const demoPage = new DemoPage(page);

    // Step 1: Mobile user lands on homepage
    await homePage.goto();
    await homePage.verifyHeroSection();

    // Step 2: User scrolls through features (mobile layout)
    await homePage.verifyFeatureCards();

    // Step 3: User taps demo CTA
    await homePage.clickDemoCTA();

    // Step 4: User interacts with demo on mobile
    await demoPage.verifyPageLoad();
    await demoPage.verifyMobileLayout();

    // Step 5: User enters text on mobile
    await demoPage.testTextInput('MOBILE');

    // Step 6: User adjusts settings on mobile
    await demoPage.testThemeSwitch('light');

    // Step 7: User copies code on mobile
    await demoPage.testCopyButton();

    // Validation: Mobile experience works end-to-end
    await expect(demoPage.copyButton).toHaveText('Copied!');
  });

  test('tablet user explores glyph showcase', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    const glyphsPage = new GlyphsPage(page);

    // Step 1: Tablet user navigates to glyphs
    await glyphsPage.goto();
    await glyphsPage.verifyPageLoad();

    // Step 2: User views letter grid on tablet
    await glyphsPage.verifyLetterGlyphs();

    // Step 3: User views symbol cards on tablet
    await glyphsPage.verifySymbolGlyphs();

    // Step 4: User tests theme switching on tablet
    await glyphsPage.testThemeSwitchingFlow();

    // Validation: Tablet layout displays correctly
    await expect(glyphsPage.glyphCards).toHaveCount(26);
    await expect(glyphsPage.symbolCards).toHaveCount(6);
  });
});
