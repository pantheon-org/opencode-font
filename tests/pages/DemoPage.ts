import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Demo Page Object Model
 *
 * Represents the interactive demo page (demo.astro)
 * Tests:
 * - Interactive text input
 * - Theme switching (light/dark)
 * - Block size slider
 * - Character spacing slider
 * - Optimize checkbox
 * - Live SVG preview
 * - Generated code display
 * - Copy functionality
 */
export class DemoPage extends BasePage {
  // Page title
  readonly pageTitle: Locator;

  // Input controls
  readonly textInput: Locator;
  readonly themeSelect: Locator;
  readonly blockSizeSlider: Locator;
  readonly blockSizeValue: Locator;
  readonly charSpacingSlider: Locator;
  readonly charSpacingValue: Locator;
  readonly optimizeCheckbox: Locator;

  // Preview area
  readonly previewArea: Locator;
  readonly previewSVG: Locator;

  // Code output
  readonly codeOutput: Locator;
  readonly generatedCode: Locator;
  readonly copyButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('h1').filter({ hasText: 'Interactive Demo' });

    // Controls
    this.textInput = page.locator('#blocky-text');
    this.themeSelect = page.locator('#theme');
    this.blockSizeSlider = page.locator('#blockSize');
    this.blockSizeValue = page.locator('#blockSize-value');
    this.charSpacingSlider = page.locator('#charSpacing');
    this.charSpacingValue = page.locator('#charSpacing-value');
    this.optimizeCheckbox = page.locator('#optimize');

    // Preview
    this.previewArea = page.locator('#blocky-preview');
    this.previewSVG = this.previewArea.locator('svg');

    // Code output
    this.codeOutput = page.locator('.code-output');
    this.generatedCode = page.locator('#blocky-code');
    this.copyButton = page.locator('#copy-blocky');
  }

  /**
   * Navigate to demo page
   */
  async goto() {
    await super.goto('/demo/');
  }

  /**
   * Verify page loads correctly
   */
  async verifyPageLoad() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.textInput).toBeVisible();
    await expect(this.previewArea).toBeVisible();
    await expect(this.codeOutput).toBeVisible();
  }

  /**
   * Verify all controls are present and functional
   */
  async verifyControls() {
    // Text input
    await expect(this.textInput).toBeVisible();
    await expect(this.textInput).toBeEnabled();

    // Theme select
    await expect(this.themeSelect).toBeVisible();
    await expect(this.themeSelect).toBeEnabled();

    // Block size slider
    await expect(this.blockSizeSlider).toBeVisible();
    await expect(this.blockSizeSlider).toBeEnabled();
    await expect(this.blockSizeValue).toBeVisible();

    // Character spacing slider
    await expect(this.charSpacingSlider).toBeVisible();
    await expect(this.charSpacingSlider).toBeEnabled();
    await expect(this.charSpacingValue).toBeVisible();

    // Optimize checkbox
    await expect(this.optimizeCheckbox).toBeVisible();
    await expect(this.optimizeCheckbox).toBeEnabled();
  }

  /**
   * Verify initial preview is displayed
   */
  async verifyInitialPreview() {
    // Should show default "OPENCODE" text
    await expect(this.previewSVG).toBeVisible();

    // Verify SVG has content
    const svgContent = await this.previewSVG.innerHTML();
    expect(svgContent.length).toBeGreaterThan(0);

    // Verify code is generated
    const codeContent = await this.generatedCode.textContent();
    expect(codeContent).toBeTruthy();
    expect(codeContent).toContain('svg');
  }

  /**
   * Test text input updates preview
   */
  async testTextInput(text: string) {
    await this.textInput.clear();
    await this.textInput.fill(text);

    // Wait for preview to update
    await this.page.waitForTimeout(300);

    // Verify preview updated
    await expect(this.previewSVG).toBeVisible();

    // Verify code updated
    const codeContent = await this.generatedCode.textContent();
    expect(codeContent).toBeTruthy();
  }

  /**
   * Test theme switching
   */
  async testThemeSwitch(theme: 'light' | 'dark') {
    await this.themeSelect.selectOption(theme);

    // Wait for preview to update
    await this.page.waitForTimeout(300);

    // Verify preview updated
    await expect(this.previewSVG).toBeVisible();

    // Verify theme is reflected in generated code
    const codeContent = await this.generatedCode.textContent();
    expect(codeContent).toContain(`theme: '${theme}'`);
  }

  /**
   * Test block size slider
   */
  async testBlockSizeSlider(value: number) {
    await this.blockSizeSlider.fill(value.toString());

    // Wait for preview to update
    await this.page.waitForTimeout(300);

    // Verify value display updated
    const displayedValue = await this.blockSizeValue.textContent();
    expect(displayedValue).toBe(value.toString());

    // Verify preview updated
    await expect(this.previewSVG).toBeVisible();
  }

  /**
   * Test character spacing slider
   */
  async testCharSpacingSlider(value: number) {
    await this.charSpacingSlider.fill(value.toString());

    // Wait for preview to update
    await this.page.waitForTimeout(300);

    // Verify value display updated
    const displayedValue = await this.charSpacingValue.textContent();
    expect(displayedValue).toBe(value.toString());

    // Verify preview updated
    await expect(this.previewSVG).toBeVisible();
  }

  /**
   * Test optimize checkbox
   */
  async testOptimizeCheckbox() {
    // Get initial state
    const initialChecked = await this.optimizeCheckbox.isChecked();

    // Toggle checkbox
    await this.optimizeCheckbox.click();

    // Wait for preview to update
    await this.page.waitForTimeout(300);

    // Verify state changed
    const newChecked = await this.optimizeCheckbox.isChecked();
    expect(newChecked).toBe(!initialChecked);

    // Verify code reflects optimization setting
    const codeContent = await this.generatedCode.textContent();
    expect(codeContent).toContain(`optimize: ${newChecked}`);
  }

  /**
   * Test copy button functionality
   */
  async testCopyButton() {
    await this.copyButton.click();

    // Verify button text changes to "Copied!"
    await expect(this.copyButton).toHaveText('Copied!');

    // Wait for button to reset
    await this.page.waitForTimeout(2500);

    // Verify button text resets to "Copy"
    await expect(this.copyButton).toHaveText('Copy');
  }

  /**
   * Test complete user flow: enter text, adjust settings, copy code
   */
  async testCompleteUserFlow() {
    // Enter custom text
    await this.testTextInput('HELLO');

    // Switch to light theme
    await this.testThemeSwitch('light');

    // Adjust block size
    await this.testBlockSizeSlider(8);

    // Adjust character spacing
    await this.testCharSpacingSlider(2);

    // Toggle optimize
    await this.testOptimizeCheckbox();

    // Copy the code
    await this.testCopyButton();

    // Verify final preview is visible
    await expect(this.previewSVG).toBeVisible();
  }

  /**
   * Test with various character inputs
   */
  async testVariousInputs() {
    const testCases = ['ABC', 'HELLO WORLD', 'TEST-123', 'A|B|C', "DON'T", 'WHAT?', 'WOW!'];

    for (const testCase of testCases) {
      await this.testTextInput(testCase);

      // Verify preview renders without errors
      await expect(this.previewSVG).toBeVisible();

      // Small delay between tests
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * Verify responsive layout on mobile
   */
  async verifyMobileLayout() {
    // Controls should stack vertically
    const controlsGrid = this.page.locator('.controls');
    await expect(controlsGrid).toBeVisible();

    // Preview should be visible
    await expect(this.previewArea).toBeVisible();

    // Code output should be visible
    await expect(this.codeOutput).toBeVisible();
  }
}
