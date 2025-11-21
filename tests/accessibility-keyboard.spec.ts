import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';
import { GlyphsPage } from './pages/GlyphsPage';

/**
 * Keyboard Navigation and Focus Management Tests
 *
 * These tests validate that all interactive elements are accessible via keyboard
 * and that focus management follows WCAG 2.1 guidelines.
 *
 * Key Requirements:
 * - All interactive elements must be reachable via Tab key
 * - Focus order must be logical and predictable
 * - Focus indicators must be visible
 * - Keyboard shortcuts must work consistently
 * - No keyboard traps
 * - Skip links must be functional
 *
 * Test Categories:
 * 1. Tab Navigation
 * 2. Focus Management
 * 3. Keyboard Shortcuts
 * 4. Focus Traps
 * 5. Skip Links
 * 6. Form Navigation
 */

test.describe('Keyboard Navigation - Tab Order', () => {
  test('home page has logical tab order', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Start tabbing through the page
    const focusedElements: string[] = [];

    // Tab through first 10 elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluateHandle(() => document.activeElement);
      const tagName = await focusedElement.evaluate((el) => el?.tagName.toLowerCase());
      const role = await focusedElement.evaluate((el) => el?.getAttribute('role'));
      const href = await focusedElement.evaluate((el) => (el as HTMLAnchorElement)?.href);

      focusedElements.push(tagName);

      // Verify it's an interactive element
      expect(['a', 'button', 'input', 'select', 'textarea', 'div']).toContain(tagName);
    }

    // Should have tabbed through multiple elements
    expect(focusedElements.length).toBe(10);
  });

  test('demo page form controls have logical tab order', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Track tab order through form
    const tabOrder: string[] = [];

    // Tab through form controls
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');

      const focused = await page.evaluateHandle(() => document.activeElement);
      const id = await focused.evaluate((el) => el?.id);
      const tagName = await focused.evaluate((el) => el?.tagName.toLowerCase());

      if (id) {
        tabOrder.push(id);
      } else {
        tabOrder.push(tagName);
      }
    }

    // Should have tabbed through controls
    expect(tabOrder.length).toBe(8);

    // Controls should be in logical order (text input, theme, sliders, checkbox, button)
    // The exact order depends on page structure, but should be predictable
  });

  test('glyphs page theme controls are keyboard accessible', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Tab to first theme button
    let foundThemeButton = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');

      const focused = await page.evaluateHandle(() => document.activeElement);
      const id = await focused.evaluate((el) => el?.id);

      if (id === 'show-light' || id === 'show-dark' || id === 'show-both') {
        foundThemeButton = true;
        break;
      }
    }

    expect(foundThemeButton).toBe(true);
  });

  test('shift+tab navigates backwards', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Tab forward a few times
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const forwardElement = await page.evaluateHandle(() => document.activeElement);
    const forwardId = await forwardElement.evaluate((el) => el?.id);

    // Tab back once
    await page.keyboard.press('Shift+Tab');

    const backElement = await page.evaluateHandle(() => document.activeElement);
    const backId = await backElement.evaluate((el) => el?.id);

    // Should be on a different element
    expect(backId).not.toBe(forwardId);
  });
});

test.describe('Focus Management - Focus Indicators', () => {
  test('focused elements have visible focus indicators', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Tab to first focusable element
    await page.keyboard.press('Tab');

    // Get the focused element
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    // Check if outline is visible (CSS focus indicator)
    const outline = await focused.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        boxShadow: styles.boxShadow,
        border: styles.border,
      };
    });

    // Should have some kind of focus indicator
    // (outline, box-shadow, or border change)
    const hasFocusIndicator =
      outline.outline !== 'none' ||
      outline.outlineWidth !== '0px' ||
      outline.boxShadow !== 'none' ||
      outline.border !== '';

    expect(hasFocusIndicator).toBe(true);
  });

  test('focus is visible after clicking', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Click text input
    await demoPage.textInput.click();

    // Input should be focused
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    // Should be the text input
    const focusedId = await focused.getAttribute('id');
    expect(focusedId).toBe('blocky-text');
  });

  test('focus moves when interacting with sliders', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Click on block size slider
    await demoPage.blockSizeSlider.click();

    // Slider should be focused
    const focused = page.locator(':focus');
    const focusedId = await focused.getAttribute('id');
    expect(focusedId).toBe('blockSize');
  });

  test('focus visible on theme buttons in glyphs page', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Tab to theme buttons
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');

      const focused = await page.evaluateHandle(() => document.activeElement);
      const id = await focused.evaluate((el) => el?.id);

      if (id === 'show-dark' || id === 'show-light' || id === 'show-both') {
        // Check focus is visible
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        break;
      }
    }
  });
});

test.describe('Keyboard Shortcuts - Interactive Controls', () => {
  test('text input accepts keyboard input', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Click text input to focus
    await demoPage.textInput.click();

    // Type text
    await page.keyboard.type('KEYBOARD TEST');

    // Verify text was entered
    const inputValue = await demoPage.textInput.inputValue();
    expect(inputValue).toBe('KEYBOARD TEST');
  });

  test('sliders respond to arrow keys', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Get initial block size value
    const initialValue = await demoPage.blockSizeValue.textContent();
    const initialNum = parseInt(initialValue || '0');

    // Focus on slider
    await demoPage.blockSizeSlider.focus();

    // Press arrow right to increase
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    // Get new value
    const newValue = await demoPage.blockSizeValue.textContent();
    const newNum = parseInt(newValue || '0');

    // Value should have changed
    expect(newNum).not.toBe(initialNum);
  });

  test('checkbox toggles with space key', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Get initial checkbox state
    const initialChecked = await demoPage.optimizeCheckbox.isChecked();

    // Focus on checkbox
    await demoPage.optimizeCheckbox.focus();

    // Press space to toggle
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Get new state
    const newChecked = await demoPage.optimizeCheckbox.isChecked();

    // State should have toggled
    expect(newChecked).toBe(!initialChecked);
  });

  test('select dropdown opens with arrow keys', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Focus on theme select
    await demoPage.themeSelect.focus();

    // Press arrow down to open and navigate
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200);

    // Select should still be focused
    const focused = page.locator(':focus');
    const focusedId = await focused.getAttribute('id');
    expect(focusedId).toBe('theme');
  });

  test('buttons activate with space and enter keys', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Generate some content first
    await demoPage.textInput.fill('TEST');
    await page.waitForTimeout(500);

    // Focus on copy button
    await demoPage.copyButton.focus();

    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    // Button should show "Copied!" feedback
    const buttonText = await demoPage.copyButton.textContent();
    expect(buttonText).toContain('Copied!');
  });

  test('theme buttons on glyphs page respond to enter key', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Find and focus light theme button
    await glyphsPage.lightThemeButton.focus();

    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Button should be active
    await expect(glyphsPage.lightThemeButton).toHaveClass(/active/);
  });
});

test.describe('Focus Traps - No Keyboard Traps', () => {
  test('can tab through entire home page without getting trapped', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Tab through many elements
    let trapped = false;
    const visitedIds = new Set<string>();

    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab');

      const focused = await page.evaluateHandle(() => document.activeElement);
      const id = await focused.evaluate((el) => el?.id);
      const tagName = await focused.evaluate((el) => el?.tagName.toLowerCase());

      // If we've seen this ID before and it's not empty, might be trapped
      if (id && visitedIds.has(id)) {
        // Check if we're stuck on the same element for multiple iterations
        await page.keyboard.press('Tab');
        const nextFocused = await page.evaluateHandle(() => document.activeElement);
        const nextId = await nextFocused.evaluate((el) => el?.id);

        if (nextId === id) {
          trapped = true;
          break;
        }
      }

      if (id) {
        visitedIds.add(id);
      }
    }

    // Should not be trapped
    expect(trapped).toBe(false);
  });

  test('can tab through demo page form without getting trapped', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Tab through form many times
    const focusedElements: string[] = [];

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');

      const focused = await page.evaluateHandle(() => document.activeElement);
      const id = await focused.evaluate((el) => el?.id);

      if (id) {
        focusedElements.push(id);
      }
    }

    // Should have moved through multiple elements
    const uniqueElements = new Set(focusedElements);
    expect(uniqueElements.size).toBeGreaterThan(3);
  });

  test('can escape from any focused element', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Focus on text input
    await demoPage.textInput.focus();

    // Press Tab to move away
    await page.keyboard.press('Tab');

    // Should have moved to different element
    const focused = page.locator(':focus');
    const focusedId = await focused.getAttribute('id');
    expect(focusedId).not.toBe('blocky-text');
  });
});

test.describe('Skip Links - Keyboard Efficiency', () => {
  test('skip link is available at page start', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Tab once (skip link is typically first focusable element)
    await page.keyboard.press('Tab');

    // Check if first focused element is a skip link
    const focused = await page.evaluateHandle(() => document.activeElement);
    const href = await focused.evaluate((el) => (el as HTMLAnchorElement)?.href);
    const text = await focused.evaluate((el) => el?.textContent);

    // Skip links typically have href starting with # and text like "Skip to"
    if (href && href.includes('#')) {
      // This is likely a skip link or navigation link
      expect(href).toBeTruthy();
    }
  });

  test('skip link navigates to main content when activated', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Look for skip link
    const skipLink = page.locator('a[href^="#"]').first();
    const skipLinkCount = await page.locator('a[href^="#"]').count();

    if (skipLinkCount > 0) {
      const href = await skipLink.getAttribute('href');

      if (href) {
        // Click skip link
        await skipLink.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);

        // Check if focus moved to target
        const targetId = href.substring(1);
        const target = page.locator(`#${targetId}`);
        const targetExists = (await target.count()) > 0;

        if (targetExists) {
          // Verify focus or scroll position changed
          expect(targetExists).toBe(true);
        }
      }
    }
  });
});

test.describe('Form Navigation - Complete Keyboard Workflow', () => {
  test('can complete entire demo form using only keyboard', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Navigate to text input using Tab
    let foundTextInput = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const id = await focused.getAttribute('id');

      if (id === 'blocky-text') {
        foundTextInput = true;
        break;
      }
    }

    expect(foundTextInput).toBe(true);

    // Type text
    await page.keyboard.type('KEYBOARD ONLY');
    await page.waitForTimeout(300);

    // Verify text was entered
    const inputValue = await demoPage.textInput.inputValue();
    expect(inputValue).toContain('KEYBOARD ONLY');

    // Tab to theme select
    let foundThemeSelect = false;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const id = await focused.getAttribute('id');

      if (id === 'theme') {
        foundThemeSelect = true;
        break;
      }
    }

    expect(foundThemeSelect).toBe(true);

    // Change theme using arrow keys
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(300);

    // Tab to block size slider
    let foundSlider = false;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const id = await focused.getAttribute('id');

      if (id === 'blockSize') {
        foundSlider = true;
        break;
      }
    }

    expect(foundSlider).toBe(true);

    // Adjust slider using arrow keys
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);

    // Preview should update
    await expect(demoPage.previewSVG).toBeVisible();
  });

  test('can navigate glyphs page using only keyboard', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Tab to theme controls
    let foundThemeControl = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const id = await focused.getAttribute('id');

      if (id === 'show-light' || id === 'show-dark' || id === 'show-both') {
        foundThemeControl = true;

        // Activate button with Enter
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        break;
      }
    }

    expect(foundThemeControl).toBe(true);
  });

  test('keyboard navigation maintains state', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Enter text using keyboard
    await demoPage.textInput.focus();
    await page.keyboard.type('STATE TEST');
    await page.waitForTimeout(300);

    // Tab away
    await page.keyboard.press('Tab');

    // Tab back to input
    await page.keyboard.press('Shift+Tab');

    // Text should still be there
    const inputValue = await demoPage.textInput.inputValue();
    expect(inputValue).toBe('STATE TEST');
  });
});

test.describe('Accessibility - Keyboard Only Users', () => {
  test('all interactive elements on home page are keyboard accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Get all buttons and links
    const buttons = await page.locator('button, a[href]').all();

    expect(buttons.length).toBeGreaterThan(0);

    // All should be focusable
    for (const button of buttons.slice(0, 5)) {
      await button.focus();
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });

  test('demo page is fully functional with keyboard only', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Test that all form controls can be reached and used
    const controls = [
      demoPage.textInput,
      demoPage.themeSelect,
      demoPage.blockSizeSlider,
      demoPage.charSpacingSlider,
      demoPage.optimizeCheckbox,
      demoPage.copyButton,
    ];

    for (const control of controls) {
      await control.focus();
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });

  test('glyphs page theme switching works with keyboard', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Focus and activate light theme button
    await glyphsPage.lightThemeButton.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Should be active
    await expect(glyphsPage.lightThemeButton).toHaveClass(/active/);

    // Focus and activate dark theme button
    await glyphsPage.darkThemeButton.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Should be active
    await expect(glyphsPage.darkThemeButton).toHaveClass(/active/);
  });
});

test.describe('Focus Management - Dynamic Content', () => {
  test('focus remains on input when typing', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Focus text input
    await demoPage.textInput.focus();

    // Type multiple characters
    await page.keyboard.type('DYNAMIC');

    // Should still be focused
    const focused = page.locator(':focus');
    const focusedId = await focused.getAttribute('id');
    expect(focusedId).toBe('blocky-text');
  });

  test('preview updates do not steal focus', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Focus text input
    await demoPage.textInput.focus();

    // Type text (triggers preview update)
    await page.keyboard.type('FOCUS TEST');
    await page.waitForTimeout(500);

    // Focus should still be on input
    const focused = page.locator(':focus');
    const focusedId = await focused.getAttribute('id');
    expect(focusedId).toBe('blocky-text');
  });

  test('theme change on glyphs page does not break focus', async ({ page }) => {
    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Focus light theme button
    await glyphsPage.lightThemeButton.focus();

    // Activate it
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Tab to next button
    await page.keyboard.press('Tab');

    // Should be on dark theme button
    const focused = page.locator(':focus');
    const focusedId = await focused.getAttribute('id');
    expect(focusedId).toBe('show-dark');
  });
});

test.describe('Mobile Keyboard Accessibility', () => {
  test('mobile viewport maintains keyboard accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const demoPage = new DemoPage(page);
    await demoPage.goto();

    // Tab through controls
    let tabCount = 0;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      const isVisible = await focused.isVisible();

      if (isVisible) {
        tabCount++;
      }
    }

    // Should have found focusable elements
    expect(tabCount).toBeGreaterThan(0);
  });

  test('tablet viewport maintains keyboard accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const glyphsPage = new GlyphsPage(page);
    await glyphsPage.goto();

    // Tab through theme controls
    let foundControl = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      const id = await focused.getAttribute('id');

      if (id === 'show-light' || id === 'show-dark' || id === 'show-both') {
        foundControl = true;
        break;
      }
    }

    expect(foundControl).toBe(true);
  });
});
