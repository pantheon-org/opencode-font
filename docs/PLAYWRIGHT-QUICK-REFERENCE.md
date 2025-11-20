# Playwright E2E Tests - Quick Reference

## 🚀 Quick Commands

```bash
# Run all tests
bun run test:e2e

# Interactive UI (best for development)
bun run test:e2e:ui

# Debug mode
bun run test:e2e:debug

# Headed mode (see browser)
bun run test:e2e:headed

# View report
bun run test:e2e:report
```

## 🎯 Run Specific Tests

```bash
# Single browser
bun run test:e2e:chromium
bun run test:e2e:firefox
bun run test:e2e:webkit

# Mobile
bun run test:e2e:mobile

# Single file
npx playwright test home.spec.ts

# By test name
npx playwright test -g "should load home page"
```

## 📁 File Structure

```
tests/
├── pages/              # Page Object Models
│   ├── BasePage.ts    # Common functionality
│   ├── HomePage.ts    # Home page POM
│   ├── DemoPage.ts    # Demo page POM
│   └── GlyphsPage.ts  # Glyphs page POM
├── home.spec.ts       # Home page tests
├── demo.spec.ts       # Demo page tests
└── glyphs.spec.ts     # Glyphs page tests
```

## 🔍 Debugging

```bash
# UI Mode (recommended)
bun run test:e2e:ui

# Debug specific test
npx playwright test home.spec.ts --debug

# Slow motion
npx playwright test --headed --slow-mo=1000

# View trace
npx playwright show-trace test-results/trace.zip
```

## ✍️ Writing Tests

### Basic Test Template

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Feature', () => {
  let page: HomePage;

  test.beforeEach(async ({ page: p }) => {
    page = new HomePage(p);
    await page.goto();
  });

  test('should do something', async () => {
    await expect(page.element).toBeVisible();
  });
});
```

### Locator Strategies

```typescript
// ✅ Best - Role-based
page.getByRole('button', { name: 'Submit' });

// ✅ Good - Label-based
page.getByLabel('Email');

// ✅ Good - Text
page.getByText('Welcome');

// ⚠️ OK - Test ID
page.getByTestId('submit');

// ❌ Avoid - CSS
page.locator('.btn');
```

### Common Assertions

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Text
await expect(element).toHaveText('text');
await expect(element).toContainText('partial');

// Attributes
await expect(element).toHaveAttribute('href', '/path');
await expect(element).toHaveClass(/active/);

// Count
await expect(elements).toHaveCount(5);

// URL
await expect(page).toHaveURL(/.*\/path/);

// State
await expect(checkbox).toBeChecked();
await expect(button).toBeEnabled();
```

## 🎨 Best Practices

### ✅ Do

- Use Page Object Model
- Wait for conditions (not timeouts)
- Write descriptive test names
- Test one thing per test
- Use auto-waiting
- Group related tests
- Check accessibility

### ❌ Don't

- Use arbitrary waits (`waitForTimeout`)
- Use brittle CSS selectors
- Test multiple things in one test
- Ignore accessibility
- Skip error handling
- Write flaky tests

## 📊 Test Coverage

### Pages

- ✅ Home (/)
- ✅ Demo (/demo/)
- ✅ Glyphs (/glyphs/)

### Categories

- ✅ Functional (105+ tests)
- ✅ Accessibility (15+ tests)
- ✅ Responsive (12+ tests)
- ✅ Performance (6+ tests)

### Browsers

- ✅ Chromium
- ✅ Firefox
- ✅ WebKit
- ✅ Mobile Chrome
- ✅ Mobile Safari
- ✅ iPad

## 🚦 CI/CD

Tests run on:

- ✅ Push to main
- ✅ Pull requests
- ✅ Daily schedule (2 AM UTC)
- ✅ Manual trigger

View: `.github/workflows/e2e-tests.yml`

## 🐛 Troubleshooting

### Tests Failing

```bash
# Reinstall browsers
bun run playwright:install

# Clear cache
rm -rf ~/.cache/ms-playwright

# Check site is up
curl https://pantheon-org.github.io/opencode-font/
```

### Timeout Errors

- Increase timeout in config
- Use proper waits
- Check site performance
- Verify selectors

### Flaky Tests

- Add proper waits
- Use `toBeVisible()`
- Avoid race conditions
- Use `waitForLoadState`

## 📚 Resources

- [Playwright Docs](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 📞 Help

- **Detailed Guide**: See `TESTING.md`
- **Test Docs**: See `tests/README.md`
- **Implementation**: See `docs/E2E-TEST-IMPLEMENTATION.md`
- **Issues**: Open GitHub issue

---

**Quick Tip**: Use `bun run test:e2e:ui` for the best debugging experience! 🎭
