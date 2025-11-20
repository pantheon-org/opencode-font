import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for OpenCode Font Documentation
 *
 * This configuration tests the deployed GitHub Pages site at:
 * https://pantheon-org.github.io/opencode-font/
 *
 * Test Coverage:
 * - Cross-browser testing (Chromium, Firefox, WebKit)
 * - Mobile responsiveness (iPhone, Android)
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Performance monitoring (Core Web Vitals)
 * - Font loading and rendering
 * - Interactive elements and user flows
 */
export default defineConfig({
  testDir: './tests',

  // Test organization
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Global test configuration
  use: {
    // Base URL for the deployed GitHub Pages site
    baseURL: 'https://pantheon-org.github.io/opencode-font',

    // Collect trace on first retry for debugging
    trace: 'on-first-retry',

    // Screenshot on failure for visual debugging
    screenshot: 'only-on-failure',

    // Video recording for failed tests
    video: 'retain-on-failure',

    // Timeout settings
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Test timeout
  timeout: 60000,

  // Expect timeout for assertions
  expect: {
    timeout: 10000,
  },

  // Browser projects for cross-browser testing
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],

  // Output directories
  outputDir: 'test-results',
});
