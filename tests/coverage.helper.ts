/**
 * Playwright Code Coverage Helper
 *
 * This helper enables JavaScript and CSS coverage collection for E2E tests.
 * Coverage data is collected from the browser and can be used to measure
 * how much of your frontend code is executed during tests.
 *
 * Usage:
 * 1. Import this helper in your test files
 * 2. Call startCoverage() before navigating to pages
 * 3. Call stopCoverage() after tests complete
 * 4. Coverage reports are saved to coverage/e2e/
 */

import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const COVERAGE_DIR = 'coverage/e2e';

/**
 * Ensure coverage directory exists
 */
export const ensureCoverageDir = (): void => {
  if (!fs.existsSync(COVERAGE_DIR)) {
    fs.mkdirSync(COVERAGE_DIR, { recursive: true });
  }
};

/**
 * Start collecting JavaScript and CSS coverage
 * Call this before page navigation
 */
export const startCoverage = async (page: Page): Promise<void> => {
  await Promise.all([
    page.coverage.startJSCoverage({
      resetOnNavigation: false,
    }),
    page.coverage.startCSSCoverage({
      resetOnNavigation: false,
    }),
  ]);
};

/**
 * Stop collecting coverage and save results
 * Call this after your test completes
 */
export const stopCoverage = async (
  page: Page,
  testName: string,
): Promise<{ js: any[]; css: any[] }> => {
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  ensureCoverageDir();

  // Save JS coverage
  const jsCoveragePath = path.join(COVERAGE_DIR, `${testName}-js.json`);
  fs.writeFileSync(jsCoveragePath, JSON.stringify(jsCoverage, null, 2));

  // Save CSS coverage
  const cssCoveragePath = path.join(COVERAGE_DIR, `${testName}-css.json`);
  fs.writeFileSync(cssCoveragePath, JSON.stringify(cssCoverage, null, 2));

  return { js: jsCoverage, css: cssCoverage };
};

/**
 * Generate a summary report of coverage data
 */
export const generateCoverageSummary = (
  jsCoverage: any[],
  cssCoverage: any[],
): {
  js: { total: number; covered: number; percentage: number; files: number };
  css: { total: number; covered: number; percentage: number; files: number };
  overall: { percentage: number };
} => {
  // Calculate JS coverage
  let totalJSBytes = 0;
  let coveredJSBytes = 0;

  jsCoverage.forEach((entry) => {
    const text = entry.text || '';
    totalJSBytes += text.length;
    const covered = entry.ranges.reduce(
      (sum: number, range: any) => sum + (range.end - range.start),
      0,
    );
    coveredJSBytes += covered;
  });

  // Calculate CSS coverage
  let totalCSSBytes = 0;
  let coveredCSSBytes = 0;

  cssCoverage.forEach((entry) => {
    const text = entry.text || '';
    totalCSSBytes += text.length;
    const covered = entry.ranges.reduce(
      (sum: number, range: any) => sum + (range.end - range.start),
      0,
    );
    coveredCSSBytes += covered;
  });

  const jsPercentage =
    totalJSBytes > 0 ? Math.round((coveredJSBytes / totalJSBytes) * 100 * 100) / 100 : 0;
  const cssPercentage =
    totalCSSBytes > 0 ? Math.round((coveredCSSBytes / totalCSSBytes) * 100 * 100) / 100 : 0;

  const totalBytes = totalJSBytes + totalCSSBytes;
  const coveredBytes = coveredJSBytes + coveredCSSBytes;
  const overallPercentage =
    totalBytes > 0 ? Math.round((coveredBytes / totalBytes) * 100 * 100) / 100 : 0;

  return {
    js: {
      total: totalJSBytes,
      covered: coveredJSBytes,
      percentage: jsPercentage,
      files: jsCoverage.length,
    },
    css: {
      total: totalCSSBytes,
      covered: coveredCSSBytes,
      percentage: cssPercentage,
      files: cssCoverage.length,
    },
    overall: {
      percentage: overallPercentage,
    },
  };
};

/**
 * Save coverage summary to a JSON file
 */
export const saveCoverageSummary = (
  summary: ReturnType<typeof generateCoverageSummary>,
  testName: string,
): void => {
  ensureCoverageDir();
  const summaryPath = path.join(COVERAGE_DIR, `${testName}-summary.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
};

/**
 * Print coverage summary to console
 */
export const printCoverageSummary = (
  summary: ReturnType<typeof generateCoverageSummary>,
  testName: string,
): void => {
  console.log(`\n📊 Coverage Summary for: ${testName}`);
  console.log('─'.repeat(50));
  console.log(`JavaScript Coverage: ${summary.js.percentage}% (${summary.js.files} files)`);
  console.log(`  Total: ${summary.js.total} bytes`);
  console.log(`  Covered: ${summary.js.covered} bytes`);
  console.log(`CSS Coverage: ${summary.css.percentage}% (${summary.css.files} files)`);
  console.log(`  Total: ${summary.css.total} bytes`);
  console.log(`  Covered: ${summary.css.covered} bytes`);
  console.log(`Overall Coverage: ${summary.overall.percentage}%`);
  console.log('─'.repeat(50));
};
