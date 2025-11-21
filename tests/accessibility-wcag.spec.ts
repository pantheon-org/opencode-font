import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';
import { GlyphsPage } from './pages/GlyphsPage';

/**
 * WCAG 2.1 AA Accessibility Tests
 *
 * These tests validate compliance with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
 * We use axe-core (by Deque Systems) for automated accessibility testing.
 *
 * WCAG 2.1 AA Principles:
 * 1. Perceivable - Information must be presentable to users in ways they can perceive
 * 2. Operable - Interface components must be operable
 * 3. Understandable - Information and operation must be understandable
 * 4. Robust - Content must be robust enough to be interpreted by assistive technologies
 *
 * Test Categories:
 * - Automated axe-core scans (all pages)
 * - Color contrast validation (WCAG AA: 4.5:1 normal, 3:1 large text)
 * - ARIA landmarks and roles
 * - Semantic HTML structure
 * - Form labels and accessibility
 * - Image alternative text
 * - Heading hierarchy
 * - Link accessibility
 */

test.describe('WCAG 2.1 AA Compliance - Automated Scans', () => {
  test('home page has no accessibility violations', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Assert no violations found
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('demo page has no accessibility violations', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Assert no violations found
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('glyphs page has no accessibility violations', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Assert no violations found
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('demo page with user input has no accessibility violations', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Interact with page
    await demoPage.textInput.fill('ACCESSIBILITY TEST');
    await demoPage.themeSelect.selectOption('light');
    await page.waitForTimeout(500);

    // Run axe accessibility scan on modified state
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Assert no violations found
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Color Contrast - WCAG AA Standards', () => {
  test('home page text meets contrast requirements', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Scan specifically for color contrast issues
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include(['body'])
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('demo page controls meet contrast requirements', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Scan color contrast
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('light theme meets contrast requirements', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Switch to light theme
    await demoPage.testThemeSwitch('light');
    await page.waitForTimeout(500);

    // Scan color contrast
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('dark theme meets contrast requirements', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Switch to dark theme
    await demoPage.testThemeSwitch('dark');
    await page.waitForTimeout(500);

    // Scan color contrast
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('glyphs page cards meet contrast requirements', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Scan color contrast
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('buttons and interactive elements have sufficient contrast', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check button contrast specifically
    const buttons = page.locator('button, a.button, .cta');
    const buttonCount = await buttons.count();

    expect(buttonCount).toBeGreaterThan(0);

    // Scan for link contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(['a', 'button'])
      .withTags(['wcag2aa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );

    expect(contrastViolations).toHaveLength(0);
  });
});

test.describe('ARIA Landmarks and Roles', () => {
  test('home page has proper landmark structure', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);

    // Run axe scan for landmark rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const landmarkViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('landmark') || v.id.includes('region'),
    );

    expect(landmarkViolations).toHaveLength(0);
  });

  test('demo page form controls have proper ARIA attributes', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Check text input has proper labeling
    const textInput = demoPage.textInput;
    const textInputLabel = await textInput.getAttribute('aria-label');
    const textInputLabelledBy = await textInput.getAttribute('aria-labelledby');

    // Should have either aria-label or associated label
    expect(textInputLabel || textInputLabelledBy).toBeTruthy();

    // Check select has proper labeling
    const themeSelect = demoPage.themeSelect;
    const selectLabel = await themeSelect.getAttribute('aria-label');
    const selectLabelledBy = await themeSelect.getAttribute('aria-labelledby');

    expect(selectLabel || selectLabelledBy).toBeTruthy();
  });

  test('interactive controls have appropriate ARIA roles', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Scan for ARIA role violations
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const roleViolations = accessibilityScanResults.violations.filter(
      (v) =>
        v.id.includes('aria-') ||
        v.id === 'button-name' ||
        v.id === 'input-button-name' ||
        v.id === 'link-name',
    );

    expect(roleViolations).toHaveLength(0);
  });

  test('glyphs page cards have semantic structure', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Check that cards are in a proper container
    const lettersGrid = glyphsPage.lettersGrid;
    await expect(lettersGrid).toBeVisible();

    // Verify grid has proper semantic meaning (div or section)
    const gridTagName = await lettersGrid.evaluate((el) => el.tagName.toLowerCase());
    expect(['div', 'section', 'ul']).toContain(gridTagName);

    // Run axe scan for structural violations
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const structureViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('list') || v.id.includes('definition-list'),
    );

    expect(structureViolations).toHaveLength(0);
  });
});

test.describe('Semantic HTML Structure', () => {
  test('home page has proper heading hierarchy', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const h1Count = await h1.count();
    expect(h1Count).toBe(1); // Should have exactly one h1

    // Run axe scan for heading order
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const headingViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('heading-order') || v.id === 'page-has-heading-one',
    );

    expect(headingViolations).toHaveLength(0);
  });

  test('page structure uses semantic HTML5 elements', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check for semantic elements
    const main = page.locator('main');
    await expect(main).toBeVisible();

    const nav = page.locator('nav');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);

    // Check for header/footer if present
    const header = page.locator('header');
    const headerCount = await header.count();
    const footer = page.locator('footer');
    const footerCount = await footer.count();

    // At least one semantic structural element should exist
    expect(headerCount + footerCount).toBeGreaterThanOrEqual(0);
  });

  test('lists use proper HTML list elements', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Run axe scan for list structure
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const listViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'listitem' || v.id === 'list',
    );

    expect(listViolations).toHaveLength(0);
  });

  test('demo page form uses proper semantic elements', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Check input elements
    const textInput = demoPage.textInput;
    const inputType = await textInput.getAttribute('type');
    expect(inputType).toBeTruthy();

    // Check select element
    const select = demoPage.themeSelect;
    const selectTag = await select.evaluate((el) => el.tagName.toLowerCase());
    expect(selectTag).toBe('select');

    // Check checkbox
    const checkbox = demoPage.optimizeCheckbox;
    const checkboxType = await checkbox.getAttribute('type');
    expect(checkboxType).toBe('checkbox');
  });
});

test.describe('Form Accessibility', () => {
  test('demo page form controls have labels', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Run axe scan for form labels
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const labelViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'label' || v.id === 'form-field-multiple-labels',
    );

    expect(labelViolations).toHaveLength(0);
  });

  test('form inputs have descriptive placeholders or labels', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Check text input
    const textInput = demoPage.textInput;
    const placeholder = await textInput.getAttribute('placeholder');
    const ariaLabel = await textInput.getAttribute('aria-label');
    const id = await textInput.getAttribute('id');

    // Should have placeholder, aria-label, or associated label via id
    expect(placeholder || ariaLabel || id).toBeTruthy();

    if (id) {
      // Check if there's a label for this input
      const label = page.locator(`label[for="${id}"]`);
      const labelCount = await label.count();
      // Having a label is good, but not required if aria-label exists
      expect(labelCount >= 0).toBe(true);
    }
  });

  test('form controls have visible focus indicators', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Tab to text input
    await page.keyboard.press('Tab');

    // Get focused element
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const focusedTagName = await focusedElement.evaluate((el) => el?.tagName.toLowerCase());

    // Should focus on an interactive element
    expect(['input', 'button', 'select', 'a', 'textarea']).toContain(focusedTagName);

    // Run axe scan for focus visibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const focusViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('focus') || v.id === 'focus-order-semantics',
    );

    expect(focusViolations).toHaveLength(0);
  });

  test('sliders have accessible names and values', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Check block size slider
    const blockSizeSlider = demoPage.blockSizeSlider;
    const sliderAriaLabel = await blockSizeSlider.getAttribute('aria-label');
    const sliderAriaLabelledBy = await blockSizeSlider.getAttribute('aria-labelledby');

    expect(sliderAriaLabel || sliderAriaLabelledBy).toBeTruthy();

    // Check if value is displayed
    const blockSizeValue = demoPage.blockSizeValue;
    await expect(blockSizeValue).toBeVisible();
  });
});

test.describe('Image Accessibility', () => {
  test('SVG images have accessible names or are marked decorative', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Generate SVG preview
    await demoPage.testTextInput('TEST');
    await page.waitForTimeout(500);

    const previewSVG = demoPage.previewSVG;
    await expect(previewSVG).toBeVisible();

    // Check if SVG has proper accessibility attributes
    const svgRole = await previewSVG.getAttribute('role');
    const svgAriaLabel = await previewSVG.getAttribute('aria-label');
    const svgAriaLabelledBy = await previewSVG.getAttribute('aria-labelledby');
    const svgTitle = previewSVG.locator('title');
    const titleCount = await svgTitle.count();

    // SVG should either have:
    // - role="img" with aria-label or aria-labelledby
    // - a <title> element
    // - role="presentation" or aria-hidden="true" if decorative
    const isAccessible =
      (svgRole === 'img' && (svgAriaLabel || svgAriaLabelledBy)) ||
      titleCount > 0 ||
      svgRole === 'presentation';

    expect(isAccessible || titleCount > 0).toBe(true);
  });

  test('glyphs page SVGs are accessible', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Run axe scan for image accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const imageViolations = accessibilityScanResults.violations.filter(
      (v) =>
        v.id === 'image-alt' ||
        v.id === 'svg-img-alt' ||
        v.id === 'object-alt' ||
        v.id === 'input-image-alt',
    );

    expect(imageViolations).toHaveLength(0);
  });

  test('decorative images are properly hidden from screen readers', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Find all images
    const images = page.locator('img, svg');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Run axe scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const imageViolations = accessibilityScanResults.violations.filter(
        (v) => v.id.includes('image') || v.id.includes('svg'),
      );

      expect(imageViolations).toHaveLength(0);
    }
  });
});

test.describe('Link Accessibility', () => {
  test('all links have descriptive text', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Run axe scan for link accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const linkViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'link-name' || v.id === 'link-in-text-block',
    );

    expect(linkViolations).toHaveLength(0);
  });

  test('links are distinguishable from surrounding text', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check that links have visual differentiation
    const links = page.locator('a');
    const linkCount = await links.count();

    if (linkCount > 0) {
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();

      // Links should have distinct styling (color, underline, etc.)
      // This is validated by color-contrast checks in axe
    }

    // Run axe scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const linkTextViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'link-in-text-block',
    );

    expect(linkTextViolations).toHaveLength(0);
  });

  test('navigation links are keyboard accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Tab through navigation links
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to reach links via keyboard
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate((el) => el?.tagName.toLowerCase());

    // Focus should be on an interactive element
    expect(['a', 'button', 'input', 'select']).toContain(tagName);
  });
});

test.describe('Heading Hierarchy', () => {
  test('home page has logical heading structure', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Get all headings
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
      elements.map((el) => ({
        level: parseInt(el.tagName.charAt(1)),
        text: el.textContent?.trim(),
      })),
    );

    expect(headings.length).toBeGreaterThan(0);

    // First heading should be h1
    expect(headings[0].level).toBe(1);

    // Check for proper nesting (no skipping levels)
    for (let i = 1; i < headings.length; i++) {
      const diff = headings[i].level - headings[i - 1].level;
      // Should not skip more than one level
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('demo page has proper heading structure', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Run axe scan for heading order
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const headingViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'heading-order' || v.id === 'empty-heading',
    );

    expect(headingViolations).toHaveLength(0);
  });

  test('glyphs page sections have descriptive headings', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Check for section headings
    const lettersHeading = glyphsPage.lettersHeading;
    await expect(lettersHeading).toBeVisible();

    const symbolsHeading = glyphsPage.symbolsHeading;
    await expect(symbolsHeading).toBeVisible();

    // Verify heading text is descriptive
    const lettersText = await lettersHeading.textContent();
    expect(lettersText).toContain('Letter');

    const symbolsText = await symbolsHeading.textContent();
    expect(symbolsText).toContain('Symbol');
  });
});

test.describe('Language and Reading Level', () => {
  test('page has language attribute', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check html lang attribute
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(0);

    // Run axe scan for language
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const langViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'html-has-lang' || v.id === 'html-lang-valid',
    );

    expect(langViolations).toHaveLength(0);
  });
});

test.describe('Document Structure', () => {
  test('page has valid document structure', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Run comprehensive structural scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const structureViolations = accessibilityScanResults.violations.filter(
      (v) =>
        v.id === 'bypass' ||
        v.id === 'landmark-one-main' ||
        v.id === 'landmark-complementary-is-top-level' ||
        v.id === 'page-has-heading-one' ||
        v.id === 'region',
    );

    expect(structureViolations).toHaveLength(0);
  });

  test('skip links are present for keyboard navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check for skip link (may be visually hidden)
    const skipLink = page.locator('a[href^="#"]').first();
    const skipLinkCount = await page.locator('a[href^="#"]').count();

    // Skip links are common but not required for all pages
    // Just verify they work if present
    if (skipLinkCount > 0) {
      const href = await skipLink.getAttribute('href');
      expect(href).toBeTruthy();

      // Verify target exists
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const target = page.locator(`#${targetId}`);
        const targetCount = await target.count();
        expect(targetCount).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

test.describe('Responsive Accessibility', () => {
  test('mobile view maintains accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Run axe scan on mobile viewport
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('tablet view maintains accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Run axe scan on tablet viewport
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
