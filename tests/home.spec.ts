import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

/**
 * Home Page Tests
 *
 * Comprehensive test suite for the main landing page
 * Tests hero section, feature cards, code examples, and navigation
 */
test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe('Page Load and Structure', () => {
    test('should load successfully', async () => {
      await expect(homePage.page).toHaveURL(/.*\/opencode-font\/?$/);
      await expect(homePage.page).toHaveTitle(/OpenCode Font/);
    });

    test('should have proper heading hierarchy', async () => {
      await homePage.verifyHeadingHierarchy();
    });

    test('should have no console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(2000);

      // Filter out non-critical errors
      const criticalErrors = errors.filter(
        (error) => !error.includes('favicon') && !error.includes('404'),
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Header and Navigation', () => {
    test('should display header with logo', async () => {
      await homePage.verifyHeader();
    });

    test('should display sidebar navigation', async () => {
      await homePage.verifySidebar();
    });

    test('should have functional search button', async () => {
      const searchDialog = await homePage.openSearch();
      await expect(searchDialog).toBeVisible();
    });
  });

  test.describe('Hero Section', () => {
    test('should display hero section with all elements', async () => {
      await homePage.verifyHeroSection();
    });

    test('should navigate to demo page via CTA', async () => {
      await homePage.clickDemoCTA();
    });

    test('should open GitHub in new tab via CTA', async () => {
      await homePage.clickGitHubCTA();
    });
  });

  test.describe('Feature Cards', () => {
    test('should display all 4 feature cards', async () => {
      await homePage.verifyFeatureCards();
    });

    test('should have icons in feature cards', async () => {
      const blockyIcon = homePage.blockyFeatureCard.locator('svg');
      await expect(blockyIcon).toBeVisible();

      const fontIcon = homePage.fontFeatureCard.locator('svg');
      await expect(fontIcon).toBeVisible();
    });
  });

  test.describe('Code Examples', () => {
    test('should display code examples with syntax highlighting', async () => {
      await homePage.verifyCodeExamples();
    });

    test('should have functional copy buttons', async () => {
      await homePage.testCopyCodeButton();
    });

    test('should display blocky text example', async () => {
      await expect(homePage.blockyCodeExample).toBeVisible();
      const code = await homePage.blockyCodeExample.textContent();
      expect(code).toContain('blockyTextToSVG');
    });

    test('should display font-based example', async () => {
      await expect(homePage.fontCodeExample).toBeVisible();
      const code = await homePage.fontCodeExample.textContent();
      expect(code).toContain('convertTextToSVG');
    });

    test('should display CSS integration example', async () => {
      await expect(homePage.cssCodeExample).toBeVisible();
      const code = await homePage.cssCodeExample.textContent();
      expect(code).toContain('OpenCodeLogo');
    });
  });

  test.describe('Content Sections', () => {
    test('should display installation section', async () => {
      await homePage.verifyInstallation();
    });

    test('should display character support section', async () => {
      await homePage.verifyCharacterSupport();
    });

    test('should display API comparison table', async () => {
      await homePage.verifyComparisonTable();
    });
  });

  test.describe('Links and Navigation', () => {
    test('should have working internal links', async () => {
      await homePage.verifyInternalLinks();
    });

    test('should navigate to demo page', async () => {
      await homePage.navigateToDemo();
      await expect(homePage.page).toHaveURL(/.*\/demo\//);
    });

    test('should navigate to glyphs page', async () => {
      await homePage.navigateToGlyphs();
      await expect(homePage.page).toHaveURL(/.*\/glyphs\//);
    });
  });

  test.describe('Accessibility', () => {
    test('should have alt text on all images', async () => {
      await homePage.verifyImageAltText();
    });

    test('should support keyboard navigation', async () => {
      await homePage.verifyKeyboardNavigation();
    });

    test('should have proper ARIA labels', async () => {
      // Check search button has aria-label
      const searchButton = homePage.searchButton;
      const ariaLabel = await searchButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });

  test.describe('Font Loading', () => {
    test('should load OpenCodeLogo font', async () => {
      await homePage.verifyFontLoading();
    });

    test('should render logo with custom font', async () => {
      const logoSVG = homePage.logo.locator('svg');
      await expect(logoSVG).toBeVisible();

      // Verify SVG has content
      const svgContent = await logoSVG.innerHTML();
      expect(svgContent.length).toBeGreaterThan(0);
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async () => {
      const metrics = await homePage.measurePerformance();

      // Page should load in under 3 seconds
      expect(metrics.loadComplete).toBeLessThan(3000);

      // First contentful paint should be under 2 seconds
      expect(metrics.firstContentfulPaint).toBeLessThan(2000);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async () => {
      await homePage.checkResponsiveLayout({ width: 375, height: 667 });

      // Verify mobile menu button is visible
      await expect(homePage.mobileMenuButton).toBeVisible();
    });

    test('should display correctly on tablet', async () => {
      await homePage.checkResponsiveLayout({ width: 768, height: 1024 });
    });

    test('should display correctly on desktop', async () => {
      await homePage.checkResponsiveLayout({ width: 1920, height: 1080 });

      // Sidebar should be visible on desktop
      await expect(homePage.sidebar).toBeVisible();
    });
  });
});
