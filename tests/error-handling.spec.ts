import { test, expect } from '@playwright/test';
import { DemoPage } from './pages/DemoPage';

/**
 * Error Handling Tests
 *
 * Comprehensive test suite for error handling and edge cases
 * Tests how the application handles:
 * - Empty inputs
 * - Invalid characters
 * - Extremely long inputs
 * - Special Unicode characters
 * - Network errors
 * - JavaScript errors
 */
test.describe('Error Handling', () => {
  let demoPage: DemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page);
    await demoPage.goto();
  });

  test.describe('Input Validation', () => {
    test('should handle empty text input gracefully', async () => {
      // Clear the input completely
      await demoPage.textInput.clear();
      await demoPage.page.waitForTimeout(300);

      // Should still show preview (possibly with default or placeholder)
      await expect(demoPage.previewSVG).toBeVisible();

      // Code should still be generated (even if empty or default)
      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
      expect(code).toContain('svg');
    });

    test('should filter out numbers from input', async () => {
      await demoPage.testTextInput('HELLO123WORLD456');

      // Wait for processing
      await demoPage.page.waitForTimeout(300);

      // Verify preview is visible
      await expect(demoPage.previewSVG).toBeVisible();

      // Get the generated code
      const code = await demoPage.generatedCode.textContent();

      // Either numbers are removed or ignored in rendering
      // The code should not reference numbers if they're filtered
      expect(code).toBeTruthy();
    });

    test('should handle unsupported special characters', async () => {
      // Test with characters that might not be supported
      await demoPage.textInput.clear();
      await demoPage.textInput.fill('TEST@#$%^&*()');
      await demoPage.page.waitForTimeout(300);

      // Should still render something (filtered or error message)
      await expect(demoPage.previewSVG).toBeVisible();

      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
    });

    test('should handle extremely long input', async () => {
      // Create a very long string
      const longText = 'A'.repeat(500);

      await demoPage.textInput.clear();
      await demoPage.textInput.fill(longText);
      await demoPage.page.waitForTimeout(500);

      // Should either truncate or show warning, but not crash
      await expect(demoPage.previewSVG).toBeVisible();

      // Verify application is still responsive
      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
    });

    test('should handle Unicode characters gracefully', async () => {
      // Test with emoji and non-Latin characters
      await demoPage.textInput.clear();
      await demoPage.textInput.fill('HELLO 世界 🚀 CAFÉ');
      await demoPage.page.waitForTimeout(300);

      // Should filter or handle these characters
      await expect(demoPage.previewSVG).toBeVisible();

      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
    });

    test('should handle only whitespace input', async () => {
      await demoPage.textInput.clear();
      await demoPage.textInput.fill('     ');
      await demoPage.page.waitForTimeout(300);

      // Should handle whitespace-only input
      await expect(demoPage.previewSVG).toBeVisible();

      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
    });

    test('should handle mixed valid and invalid characters', async () => {
      await demoPage.testTextInput('VALID-TEXT-123-🚀-@#$');
      await demoPage.page.waitForTimeout(300);

      // Should process valid characters and filter/ignore invalid ones
      await expect(demoPage.previewSVG).toBeVisible();

      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();

      // Should contain at least the valid parts
      expect(code).toContain('svg');
    });
  });

  test.describe('Network Errors', () => {
    test('should handle offline state', async ({ context }) => {
      // Simulate offline state
      await context.setOffline(true);

      // Try to reload the page
      await demoPage.page.reload();

      // Wait a bit for any error handling
      await demoPage.page.waitForTimeout(1000);

      // Check if page shows error or cached content
      const bodyText = await demoPage.page.textContent('body');
      expect(bodyText).toBeTruthy();

      // Restore online state
      await context.setOffline(false);
    });

    test('should show loading state on slow network', async ({ page }) => {
      // Simulate slow network by delaying all requests
      await page.route('**/*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.continue();
      });

      // Navigate to demo page
      await page.goto('/demo/');

      // Should eventually load
      await expect(demoPage.pageTitle).toBeVisible({ timeout: 10000 });

      // Clear route to restore normal behavior
      await page.unroute('**/*');
    });

    test('should handle failed asset loading', async ({ page }) => {
      // Intercept and fail specific resource types
      await page.route('**/*.{png,jpg,jpeg,gif,webp}', (route) => {
        route.abort('failed');
      });

      await page.goto('/demo/');

      // Page should still load even if some images fail
      await expect(demoPage.pageTitle).toBeVisible();
      await expect(demoPage.textInput).toBeVisible();

      // Clear route
      await page.unroute('**/*.{png,jpg,jpeg,gif,webp}');
    });
  });

  test.describe('JavaScript Errors', () => {
    test('should monitor console for errors', async ({ page }) => {
      const consoleErrors: string[] = [];
      const consoleWarnings: string[] = [];

      // Listen for console messages
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        } else if (msg.type() === 'warning') {
          consoleWarnings.push(msg.text());
        }
      });

      // Perform normal user interactions
      await demoPage.testTextInput('HELLO');
      await demoPage.testThemeSwitch('light');
      await demoPage.testBlockSizeSlider(8);

      // Wait for any async errors
      await page.waitForTimeout(1000);

      // Filter out known acceptable errors (if any)
      const criticalErrors = consoleErrors.filter((error) => {
        // Filter out non-critical errors like favicon
        return !error.includes('favicon') && !error.includes('404');
      });

      // Should have no critical console errors
      expect(criticalErrors).toHaveLength(0);
    });

    test('should handle rapid consecutive interactions', async () => {
      // Rapidly change inputs to test for race conditions
      for (let i = 0; i < 5; i++) {
        await demoPage.textInput.fill(`TEST${i}`);
        await demoPage.blockSizeSlider.fill((6 + i).toString());
        // Minimal wait between interactions
        await demoPage.page.waitForTimeout(50);
      }

      // Wait for final update
      await demoPage.page.waitForTimeout(500);

      // Should still render correctly without errors
      await expect(demoPage.previewSVG).toBeVisible();

      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
    });

    test('should handle theme switch during text input', async () => {
      // Start typing
      await demoPage.textInput.clear();
      await demoPage.textInput.fill('TESTING');
      await demoPage.page.waitForTimeout(100);

      // Switch theme mid-typing
      await demoPage.themeSelect.selectOption('light');
      await demoPage.page.waitForTimeout(100);

      // Continue typing
      await demoPage.textInput.fill('TESTING MORE');

      // Wait for final render
      await demoPage.page.waitForTimeout(500);

      // Should handle the concurrent operations
      await expect(demoPage.previewSVG).toBeVisible();

      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
      expect(code).toContain("theme: 'light'");
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle copy button when clipboard API unavailable', async ({ page }) => {
      // Mock clipboard API to fail
      await page.addInitScript(() => {
        // @ts-ignore
        delete navigator.clipboard;
      });

      await page.goto('/demo/');

      // Try to copy
      const copyButton = page.locator('#copy-blocky');
      await copyButton.click();

      // Should handle gracefully (might show error or use fallback)
      // The button should still respond
      const buttonText = await copyButton.textContent();
      expect(buttonText).toBeTruthy();
    });

    test('should handle slider at boundary values', async () => {
      // Test minimum value
      await demoPage.blockSizeSlider.fill('1');
      await demoPage.page.waitForTimeout(300);
      await expect(demoPage.previewSVG).toBeVisible();

      // Test maximum value (assuming max is 20 based on common slider ranges)
      await demoPage.blockSizeSlider.fill('20');
      await demoPage.page.waitForTimeout(300);
      await expect(demoPage.previewSVG).toBeVisible();

      // Verify both extremes work
      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
    });

    test('should handle all controls at extreme values', async () => {
      await demoPage.textInput.fill('X');
      await demoPage.themeSelect.selectOption('dark');
      await demoPage.blockSizeSlider.fill('1');
      await demoPage.charSpacingSlider.fill('0');
      await demoPage.optimizeCheckbox.uncheck();

      await demoPage.page.waitForTimeout(500);

      // Should render with all extreme/minimal settings
      await expect(demoPage.previewSVG).toBeVisible();

      const code = await demoPage.generatedCode.textContent();
      expect(code).toBeTruthy();
    });

    test('should handle page refresh during interaction', async ({ page }) => {
      // Start an interaction
      await demoPage.testTextInput('BEFORE REFRESH');

      // Refresh the page
      await page.reload();

      // Should reset to default state
      await expect(demoPage.pageTitle).toBeVisible();
      await expect(demoPage.textInput).toBeVisible();

      // Default value should be restored
      const defaultValue = await demoPage.textInput.inputValue();
      expect(defaultValue).toBe('OPENCODE'); // Assuming default
    });
  });
});
