import { test, expect } from '@playwright/test';
import { DemoPage } from './pages/DemoPage';

/**
 * Demo Page Tests
 *
 * Comprehensive test suite for the interactive demo page
 * Tests all interactive controls, live preview, and code generation
 */
test.describe('Demo Page', () => {
  let demoPage: DemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page);
    await demoPage.goto();
  });

  test.describe('Page Load and Structure', () => {
    test('should load successfully', async () => {
      await expect(demoPage.page).toHaveURL(/.*\/demo\//);
      await expect(demoPage.page).toHaveTitle(/Interactive Demo/);
    });

    test('should display all page elements', async () => {
      await demoPage.verifyPageLoad();
    });

    test('should have proper heading hierarchy', async () => {
      await demoPage.verifyHeadingHierarchy();
    });
  });

  test.describe('Interactive Controls', () => {
    test('should display all controls', async () => {
      await demoPage.verifyControls();
    });

    test('should have text input with default value', async () => {
      const value = await demoPage.textInput.inputValue();
      expect(value).toBe('OPENCODE');
    });

    test('should have theme select with default dark', async () => {
      const value = await demoPage.themeSelect.inputValue();
      expect(value).toBe('dark');
    });

    test('should have block size slider with default value', async () => {
      const value = await demoPage.blockSizeSlider.inputValue();
      expect(value).toBe('6');
    });

    test('should have character spacing slider with default value', async () => {
      const value = await demoPage.charSpacingSlider.inputValue();
      expect(value).toBe('1');
    });

    test('should have optimize checkbox checked by default', async () => {
      const isChecked = await demoPage.optimizeCheckbox.isChecked();
      expect(isChecked).toBe(true);
    });
  });

  test.describe('Initial Preview', () => {
    test('should display initial preview', async () => {
      await demoPage.verifyInitialPreview();
    });

    test('should show SVG in preview area', async () => {
      await expect(demoPage.previewSVG).toBeVisible();

      // Verify SVG has viewBox attribute
      const viewBox = await demoPage.previewSVG.getAttribute('viewBox');
      expect(viewBox).toBeTruthy();
    });

    test('should display generated code', async () => {
      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
      expect(code).toContain('<svg');
      expect(code).toContain('</svg>');
    });
  });

  test.describe('Text Input Functionality', () => {
    test('should update preview when text changes', async () => {
      await demoPage.testTextInput('HELLO');
    });

    test('should handle uppercase letters', async () => {
      await demoPage.testTextInput('ABCDEFG');
    });

    test('should handle symbols', async () => {
      await demoPage.testTextInput('HELLO-WORLD');
    });

    test('should handle multiple words', async () => {
      await demoPage.testTextInput('HELLO WORLD');
    });

    test('should handle special characters', async () => {
      await demoPage.testTextInput("DON'T STOP!");
    });
  });

  test.describe('Theme Switching', () => {
    test('should switch to light theme', async () => {
      await demoPage.testThemeSwitch('light');
    });

    test('should switch to dark theme', async () => {
      await demoPage.testThemeSwitch('dark');
    });

    test('should update code when theme changes', async () => {
      await demoPage.testThemeSwitch('light');
      const code = await demoPage.generatedCode.textContent();
      expect(code).toContain("theme: 'light'");

      await demoPage.testThemeSwitch('dark');
      const codeAfter = await demoPage.generatedCode.textContent();
      expect(codeAfter).toContain("theme: 'dark'");
    });
  });

  test.describe('Block Size Slider', () => {
    test('should adjust block size to minimum', async () => {
      await demoPage.testBlockSizeSlider(3);
    });

    test('should adjust block size to maximum', async () => {
      await demoPage.testBlockSizeSlider(12);
    });

    test('should adjust block size to middle value', async () => {
      await demoPage.testBlockSizeSlider(8);
    });

    test('should update value display', async () => {
      await demoPage.testBlockSizeSlider(10);
      const displayValue = await demoPage.blockSizeValue.textContent();
      expect(displayValue).toBe('10');
    });
  });

  test.describe('Character Spacing Slider', () => {
    test('should adjust spacing to minimum', async () => {
      await demoPage.testCharSpacingSlider(0);
    });

    test('should adjust spacing to maximum', async () => {
      await demoPage.testCharSpacingSlider(3);
    });

    test('should update value display', async () => {
      await demoPage.testCharSpacingSlider(2);
      const displayValue = await demoPage.charSpacingValue.textContent();
      expect(displayValue).toBe('2');
    });
  });

  test.describe('Optimize Checkbox', () => {
    test('should toggle optimize setting', async () => {
      await demoPage.testOptimizeCheckbox();
    });

    test('should update code when toggled', async () => {
      // Get initial state
      const initialChecked = await demoPage.optimizeCheckbox.isChecked();

      // Toggle
      await demoPage.optimizeCheckbox.click();
      await demoPage.page.waitForTimeout(300);

      // Verify code updated
      const code = await demoPage.generatedCode.textContent();
      expect(code).toContain(`optimize: ${!initialChecked}`);
    });
  });

  test.describe('Copy Functionality', () => {
    test('should copy code to clipboard', async () => {
      await demoPage.testCopyButton();
    });

    test('should show feedback after copying', async () => {
      await demoPage.copyButton.click();
      await expect(demoPage.copyButton).toHaveText('Copied!');
    });

    test('should reset button text after delay', async () => {
      await demoPage.copyButton.click();
      await demoPage.page.waitForTimeout(2500);
      await expect(demoPage.copyButton).toHaveText('Copy');
    });
  });

  test.describe('Complete User Flows', () => {
    test('should handle complete customization flow', async () => {
      await demoPage.testCompleteUserFlow();
    });

    test('should handle rapid input changes', async () => {
      await demoPage.testTextInput('A');
      await demoPage.testTextInput('AB');
      await demoPage.testTextInput('ABC');
      await demoPage.testTextInput('ABCD');
    });

    test('should handle various character inputs', async () => {
      await demoPage.testVariousInputs();
    });
  });

  test.describe('Preview Updates', () => {
    test('should update preview in real-time', async () => {
      // Type slowly and verify preview updates
      await demoPage.textInput.clear();
      await demoPage.textInput.type('TEST', { delay: 100 });

      // Preview should be visible throughout
      await expect(demoPage.previewSVG).toBeVisible();
    });

    test('should maintain preview visibility during changes', async () => {
      await demoPage.themeSelect.selectOption('light');
      await expect(demoPage.previewSVG).toBeVisible();

      await demoPage.blockSizeSlider.fill('10');
      await expect(demoPage.previewSVG).toBeVisible();

      await demoPage.charSpacingSlider.fill('2');
      await expect(demoPage.previewSVG).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have labels for all inputs', async () => {
      const textLabel = demoPage.page.locator('label[for="blocky-text"]');
      await expect(textLabel).toBeVisible();

      const themeLabel = demoPage.page.locator('label[for="theme"]');
      await expect(themeLabel).toBeVisible();
    });

    test('should support keyboard navigation', async () => {
      await demoPage.verifyKeyboardNavigation();
    });

    test('should have proper form structure', async () => {
      // Verify inputs are properly associated with labels
      const textInputId = await demoPage.textInput.getAttribute('id');
      expect(textInputId).toBe('blocky-text');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async () => {
      await demoPage.checkResponsiveLayout({ width: 375, height: 667 });
      await demoPage.verifyMobileLayout();
    });

    test('should display correctly on tablet', async () => {
      await demoPage.checkResponsiveLayout({ width: 768, height: 1024 });
      await expect(demoPage.previewArea).toBeVisible();
    });

    test('should display correctly on desktop', async () => {
      await demoPage.checkResponsiveLayout({ width: 1920, height: 1080 });
      await expect(demoPage.previewArea).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should update preview quickly', async ({ page }) => {
      const startTime = Date.now();
      await demoPage.testTextInput('PERFORMANCE');
      const endTime = Date.now();

      // Update should be nearly instant (< 500ms)
      expect(endTime - startTime).toBeLessThan(500);
    });

    test('should handle rapid slider changes', async () => {
      for (let i = 3; i <= 12; i++) {
        await demoPage.blockSizeSlider.fill(i.toString());
      }

      // Preview should still be visible
      await expect(demoPage.previewSVG).toBeVisible();
    });
  });
});
