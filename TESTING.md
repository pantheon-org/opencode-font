# E2E Testing Guide for OpenCode Font Documentation

## 🎯 Overview

This guide provides comprehensive instructions for running, debugging, and maintaining the E2E test suite for the OpenCode Font documentation site.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Code Coverage](#code-coverage)
5. [Debugging Tests](#debugging-tests)
6. [Writing New Tests](#writing-new-tests)
7. [Best Practices](#best-practices)
8. [CI/CD Integration](#cicd-integration)
9. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### First Time Setup

```bash
# Install dependencies
bun install

# Install Playwright browsers (Chromium, Firefox, WebKit)
bun run playwright:install

# Run all tests
bun run test:e2e

# View test report
bun run test:e2e:report
```

### Quick Test Commands

```bash
# Interactive UI mode (recommended for development)
bun run test:e2e:ui

# Run specific browser
bun run test:e2e:chromium

# Debug mode with Playwright Inspector
bun run test:e2e:debug

# Headed mode (see browser)
bun run test:e2e:headed
```

## 🏗️ Test Structure

### Directory Layout

```
tests/
├── pages/                  # Page Object Models
│   ├── BasePage.ts        # Common functionality
│   ├── HomePage.ts        # Home page POM
│   ├── DemoPage.ts        # Demo page POM
│   └── GlyphsPage.ts      # Glyphs page POM
├── home.spec.ts           # Home page tests
├── demo.spec.ts           # Demo page tests
├── glyphs.spec.ts         # Glyphs page tests
└── README.md              # Test documentation
```

### Page Object Model Pattern

Each page has a dedicated Page Object Model class:

```typescript
// Example: HomePage.ts
export class HomePage extends BasePage {
  // Locators
  readonly heroTitle: Locator;
  readonly demoCTA: Locator;

  // Actions
  async goto() {
    await super.goto('/');
  }

  async clickDemoCTA() {
    await this.demoCTA.click();
  }

  // Verifications
  async verifyHeroSection() {
    await expect(this.heroTitle).toBeVisible();
  }
}
```

## 🧪 Running Tests

### All Tests

```bash
# Run all tests in all browsers
bun run test:e2e

# Run with specific reporter
npx playwright test --reporter=html
npx playwright test --reporter=list
npx playwright test --reporter=json
```

### Specific Browsers

```bash
# Desktop browsers
bun run test:e2e:chromium
bun run test:e2e:firefox
bun run test:e2e:webkit

# Mobile browsers
bun run test:e2e:mobile
```

### Specific Test Files

```bash
# Single file
npx playwright test home.spec.ts

# Multiple files
npx playwright test home.spec.ts demo.spec.ts

# By pattern
npx playwright test tests/*.spec.ts
```

### Specific Test Cases

```bash
# By test name
npx playwright test -g "should load home page"

# By describe block
npx playwright test -g "Hero Section"

# By file and test
npx playwright test home.spec.ts -g "should display hero"
```

### Test Filtering

```bash
# Run only tests marked with @smoke tag
npx playwright test --grep @smoke

# Skip tests marked with @slow
npx playwright test --grep-invert @slow

# Run tests in specific project
npx playwright test --project=chromium
```

## 📊 Code Coverage

Playwright can collect JavaScript and CSS coverage data from your E2E tests. See the [E2E Coverage Guide](./docs/E2E-COVERAGE.md) for complete documentation.

### Quick Start with Coverage

```bash
# Run coverage example test
bun run test:e2e:coverage

# View coverage reports
bun run test:e2e:coverage:report
```

### Coverage Data Location

Coverage reports are saved to `coverage/e2e/`:

- `*-js.json` - JavaScript coverage
- `*-css.json` - CSS coverage
- `*-summary.json` - Coverage statistics

### Using Coverage in Tests

```typescript
import { startCoverage, stopCoverage } from './coverage.helper';

test('my test', async ({ page }) => {
  await startCoverage(page);
  await page.goto('/');
  // ... test actions ...
  await stopCoverage(page, 'my-test');
});
```

### Coverage Reports Example

```
📊 Coverage Summary
JavaScript Coverage: 82.5% (25 files)
CSS Coverage: 68.3% (8 files)
Overall Coverage: 78.9%
```

For detailed coverage documentation, see [E2E-COVERAGE.md](./docs/E2E-COVERAGE.md).

## 🔍 Debugging Tests

### UI Mode (Recommended)

The best way to debug tests interactively:

```bash
bun run test:e2e:ui
```

Features:

- ✅ Step through tests
- ✅ See live browser preview
- ✅ Inspect locators
- ✅ View test timeline
- ✅ Debug failures
- ✅ Time travel debugging

### Debug Mode

Run with Playwright Inspector:

```bash
bun run test:e2e:debug

# Debug specific test
npx playwright test home.spec.ts --debug
```

### Headed Mode

See the browser while tests run:

```bash
bun run test:e2e:headed

# Slow down execution
npx playwright test --headed --slow-mo=1000
```

### VS Code Integration

1. Install [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
2. Open test file
3. Click green play button next to test
4. Set breakpoints in test code
5. Debug with full VS Code debugging features

### Console Logging

Add debug output to tests:

```typescript
test('debug example', async ({ page }) => {
  console.log('Current URL:', page.url());

  const element = page.locator('.my-element');
  console.log('Element count:', await element.count());
  console.log('Element text:', await element.textContent());
});
```

### Screenshots and Videos

```typescript
test('capture screenshot', async ({ page }) => {
  await page.goto('/');

  // Full page screenshot
  await page.screenshot({
    path: 'screenshot.png',
    fullPage: true,
  });

  // Element screenshot
  await page.locator('.hero').screenshot({
    path: 'hero.png',
  });
});
```

### Trace Viewer

Traces are automatically captured on first retry. View them:

```bash
npx playwright show-trace test-results/trace.zip
```

Or enable traces for all tests:

```typescript
// playwright.config.ts
use: {
  trace: 'on', // 'on', 'off', 'retain-on-failure', 'on-first-retry'
}
```

## ✍️ Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Feature Name', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should do something', async () => {
    // Arrange
    const element = homePage.someElement;

    // Act
    await element.click();

    // Assert
    await expect(homePage.resultElement).toBeVisible();
  });
});
```

### Adding New Page Object

1. Create new file in `tests/pages/`:

```typescript
// tests/pages/NewPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  readonly pageTitle: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await super.goto('/new-page/');
  }

  async submitForm() {
    await this.submitButton.click();
    await this.waitForPageLoad();
  }
}
```

2. Create test file:

```typescript
// tests/new-page.spec.ts
import { test, expect } from '@playwright/test';
import { NewPage } from './pages/NewPage';

test.describe('New Page', () => {
  // ... tests
});
```

### Locator Strategies

Use the most specific locator possible:

```typescript
// ✅ Good - Role-based (accessible)
page.getByRole('button', { name: 'Submit' });
page.getByRole('heading', { name: 'Title' });

// ✅ Good - Label-based
page.getByLabel('Email');
page.getByPlaceholder('Enter email');

// ✅ Good - Text content
page.getByText('Welcome');

// ⚠️ OK - Test ID
page.getByTestId('submit-button');

// ❌ Avoid - CSS selectors (brittle)
page.locator('.btn-primary');
page.locator('#submit');
```

### Assertions

Use appropriate assertions:

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Text content
await expect(element).toHaveText('Expected text');
await expect(element).toContainText('partial');

// Attributes
await expect(element).toHaveAttribute('href', '/path');
await expect(element).toHaveClass(/active/);

// Count
await expect(elements).toHaveCount(5);

// URL
await expect(page).toHaveURL(/.*\/path/);
await expect(page).toHaveTitle(/Title/);

// State
await expect(checkbox).toBeChecked();
await expect(button).toBeEnabled();
await expect(input).toBeFocused();
```

## 🎯 Best Practices

### 1. Use Page Object Model

✅ **Do:**

```typescript
const homePage = new HomePage(page);
await homePage.clickDemoCTA();
```

❌ **Don't:**

```typescript
await page.locator('a[href="/demo/"]').click();
```

### 2. Wait for Conditions

✅ **Do:**

```typescript
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

❌ **Don't:**

```typescript
await page.waitForTimeout(5000); // Arbitrary wait
```

### 3. Use Auto-Waiting

Playwright automatically waits for elements:

```typescript
// These automatically wait for element to be actionable
await element.click();
await element.fill('text');
await element.selectOption('value');
```

### 4. Test Isolation

Each test should be independent:

```typescript
test.beforeEach(async ({ page }) => {
  // Fresh state for each test
  await page.goto('/');
});
```

### 5. Descriptive Test Names

✅ **Do:**

```typescript
test('should display error message when email is invalid', async () => {
  // ...
});
```

❌ **Don't:**

```typescript
test('test 1', async () => {
  // ...
});
```

### 6. Group Related Tests

```typescript
test.describe('Form Validation', () => {
  test.describe('Email Field', () => {
    test('should accept valid email', async () => {});
    test('should reject invalid email', async () => {});
  });

  test.describe('Password Field', () => {
    test('should require minimum length', async () => {});
  });
});
```

### 7. Handle Async Operations

```typescript
// Wait for navigation
await Promise.all([page.waitForNavigation(), page.click('a[href="/next-page"]')]);

// Wait for response
await Promise.all([
  page.waitForResponse((resp) => resp.url().includes('/api/data')),
  page.click('button'),
]);
```

### 8. Accessibility Testing

```typescript
test('should be accessible', async ({ page }) => {
  await page.goto('/');

  // Check heading hierarchy
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBe(1);

  // Check alt text
  const images = page.locator('img');
  for (let i = 0; i < (await images.count()); i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).not.toBeNull();
  }

  // Check keyboard navigation
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBeTruthy();
});
```

## 🚦 CI/CD Integration

### GitHub Actions

The E2E tests run automatically on:

- Push to main branch
- Pull requests
- Daily schedule (2 AM UTC)
- Manual trigger

View the workflow: `.github/workflows/e2e-tests.yml`

### Running Locally Like CI

```bash
# Simulate CI environment
CI=true bun run test:e2e

# With retries (like CI)
npx playwright test --retries=2
```

### Viewing CI Results

1. Go to GitHub Actions tab
2. Click on E2E Tests workflow
3. View test results and artifacts
4. Download playwright-report for detailed results

## 🐛 Troubleshooting

### Tests Failing Locally

**Issue**: Tests pass in CI but fail locally

**Solutions**:

- Clear browser cache: `rm -rf ~/.cache/ms-playwright`
- Reinstall browsers: `bun run playwright:install`
- Check internet connection (tests hit deployed site)
- Verify base URL in config matches deployed site

### Timeout Errors

**Issue**: Tests timeout waiting for elements

**Solutions**:

- Increase timeout in config
- Use proper waits instead of `waitForTimeout`
- Check if site is slow/down
- Verify selectors are correct

### Flaky Tests

**Issue**: Tests pass sometimes, fail other times

**Solutions**:

- Add proper waits for async operations
- Use `toBeVisible()` instead of checking existence
- Avoid race conditions
- Use `waitForLoadState('networkidle')`
- Increase retries in CI

### Element Not Found

**Issue**: `Error: Element not found`

**Solutions**:

- Verify selector is correct
- Check if element is in iframe
- Wait for element to appear
- Use Playwright Inspector to debug

### Browser Not Installed

**Issue**: `Error: Executable doesn't exist`

**Solution**:

```bash
bun run playwright:install
```

### Port Already in Use

**Issue**: Tests can't start because port is in use

**Solution**:

```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [OpenCode Font Docs](https://pantheon-org.github.io/opencode-font/)

## 🤝 Contributing

When contributing tests:

1. Follow existing patterns
2. Use Page Object Model
3. Write descriptive test names
4. Add comments for complex logic
5. Test across all browsers
6. Verify accessibility
7. Run tests locally before PR
8. Update documentation if needed

## 📝 Checklist for New Tests

- [ ] Uses Page Object Model
- [ ] Has descriptive test name
- [ ] Tests one specific behavior
- [ ] Includes proper assertions
- [ ] Handles async operations correctly
- [ ] Works in all browsers
- [ ] Includes accessibility checks
- [ ] Is not flaky
- [ ] Runs in reasonable time
- [ ] Has proper error handling
- [ ] Documented if complex

---

**Need Help?** Open an issue or check the Playwright documentation!
