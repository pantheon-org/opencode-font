/**
 * Example test demonstrating code coverage collection with Playwright
 *
 * This test shows how to:
 * 1. Start coverage collection before navigation
 * 2. Perform test actions
 * 3. Stop coverage and generate reports
 *
 * To enable coverage for all tests, add the coverage helpers to your
 * beforeEach and afterEach hooks in each test file.
 */

import { test, expect } from '@playwright/test';
import {
  startCoverage,
  stopCoverage,
  generateCoverageSummary,
  saveCoverageSummary,
  printCoverageSummary,
} from './coverage.helper';

test.describe('Coverage Example - Home Page', () => {
  test('should collect coverage data for home page', async ({ page }) => {
    // Start coverage collection
    await startCoverage(page);

    // Navigate to the page
    await page.goto('/');

    // Perform test actions
    await expect(page).toHaveTitle(/OpenCode Font/);
    await expect(page.locator('h1')).toBeVisible();

    // Click on demo link to load more JavaScript
    const demoLink = page.getByRole('link', { name: /demo/i });
    if (await demoLink.isVisible()) {
      await demoLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Stop coverage and get results
    const coverage = await stopCoverage(page, 'home-page-coverage');

    // Generate summary
    const summary = generateCoverageSummary(coverage.js, coverage.css);

    // Save summary to file
    saveCoverageSummary(summary, 'home-page-coverage');

    // Print to console
    printCoverageSummary(summary, 'Home Page');

    // Assert that we collected some coverage data
    expect(coverage.js.length).toBeGreaterThan(0);
    expect(coverage.css.length).toBeGreaterThan(0);

    // You can also assert minimum coverage thresholds
    // expect(summary.overall.percentage).toBeGreaterThan(50);
  });
});

test.describe('Coverage Example - Multiple Pages', () => {
  test('should collect coverage across multiple page interactions', async ({ page }) => {
    // Start coverage collection
    await startCoverage(page);

    // Visit multiple pages
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Navigate to demo page
    await page.goto('/demo/');
    await expect(page.locator('h1')).toBeVisible();

    // Interact with demo controls
    const textInput = page.getByLabel(/text/i);
    if (await textInput.isVisible()) {
      await textInput.fill('TEST');
    }

    // Navigate to glyphs page
    await page.goto('/glyphs/');
    await expect(page.locator('h1')).toBeVisible();

    // Stop coverage and get results
    const coverage = await stopCoverage(page, 'multi-page-coverage');

    // Generate and save summary
    const summary = generateCoverageSummary(coverage.js, coverage.css);
    saveCoverageSummary(summary, 'multi-page-coverage');
    printCoverageSummary(summary, 'Multi-Page Flow');

    // With multiple page visits, we should have higher coverage
    expect(summary.overall.percentage).toBeGreaterThan(0);
  });
});
