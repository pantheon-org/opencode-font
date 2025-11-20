# OpenCode Font - E2E Testing Suite

Comprehensive end-to-end testing suite for the OpenCode Font documentation site using Playwright.

## 🎯 Test Coverage

This test suite provides comprehensive coverage of the deployed GitHub Pages site at `https://pantheon-org.github.io/opencode-font/`

### Pages Tested

1. **Home Page** (`/`)
   - Hero section with CTAs
   - Feature cards
   - Code examples with syntax highlighting
   - API comparison table
   - Installation instructions
   - Character support information
   - Navigation and links

2. **Demo Page** (`/demo/`)
   - Interactive text input
   - Theme switching (light/dark)
   - Block size slider
   - Character spacing slider
   - Optimize checkbox
   - Live SVG preview
   - Generated code display
   - Copy to clipboard functionality

3. **Glyphs Page** (`/glyphs/`)
   - 26 letter glyphs (A-Z)
   - 6 symbol glyphs
   - Theme comparison (light/dark/both)
   - Grid layout
   - Card hover effects
   - SVG rendering

### Test Categories

- ✅ **Functional Testing**: All interactive elements and user flows
- ✅ **Accessibility Testing**: WCAG 2.1 AA compliance
- ✅ **Responsive Design**: Mobile, tablet, and desktop viewports
- ✅ **Performance Testing**: Page load times and Core Web Vitals
- ✅ **Cross-Browser Testing**: Chromium, Firefox, WebKit
- ✅ **Visual Testing**: SVG rendering and font loading
- ✅ **Navigation Testing**: Internal and external links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Internet connection (tests run against deployed site)

### Installation

```bash
# Install dependencies
bun install

# Install Playwright browsers
bun run playwright:install
```

## 📝 Running Tests

### All Tests

```bash
# Run all tests in all browsers
bun run test:e2e

# Run with UI mode (interactive)
bun run test:e2e:ui

# Run in headed mode (see browser)
bun run test:e2e:headed

# Run in debug mode
bun run test:e2e:debug
```

### Specific Browsers

```bash
# Chromium only
bun run test:e2e:chromium

# Firefox only
bun run test:e2e:firefox

# WebKit only
bun run test:e2e:webkit

# Mobile browsers
bun run test:e2e:mobile
```

### Specific Test Files

```bash
# Home page tests only
npx playwright test home.spec.ts

# Demo page tests only
npx playwright test demo.spec.ts

# Glyphs page tests only
npx playwright test glyphs.spec.ts
```

### Test Reports

```bash
# View HTML report
bun run test:e2e:report
```

## 🏗️ Test Architecture

### Page Object Model (POM)

Tests use the Page Object Model pattern for maintainability:

```
tests/
├── pages/
│   ├── BasePage.ts       # Common functionality
│   ├── HomePage.ts       # Home page elements and actions
│   ├── DemoPage.ts       # Demo page elements and actions
│   └── GlyphsPage.ts     # Glyphs page elements and actions
├── home.spec.ts          # Home page tests
├── demo.spec.ts          # Demo page tests
└── glyphs.spec.ts        # Glyphs page tests
```

### BasePage Features

The `BasePage` class provides common functionality:

- Navigation helpers
- Header and sidebar verification
- Accessibility checks (heading hierarchy, alt text, keyboard navigation)
- Font loading verification
- Performance measurement
- Responsive layout testing
- Console error detection

## 🎨 Test Examples

### Basic Test

```typescript
test('should load home page', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await expect(page).toHaveTitle(/OpenCode Font/);
});
```

### Interactive Test

```typescript
test('should update preview when text changes', async ({ page }) => {
  const demoPage = new DemoPage(page);
  await demoPage.goto();
  await demoPage.testTextInput('HELLO');
  await expect(demoPage.previewSVG).toBeVisible();
});
```

### Accessibility Test

```typescript
test('should have proper heading hierarchy', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.verifyHeadingHierarchy();
});
```

## 🔧 Configuration

### Playwright Config

The `playwright.config.ts` file configures:

- **Base URL**: `https://pantheon-org.github.io/opencode-font`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Devices**: iPhone 12, Pixel 5
- **Tablet**: iPad Pro
- **Retries**: 2 retries in CI, 0 locally
- **Reporters**: HTML, JSON, JUnit, List

### Timeouts

- **Test timeout**: 60 seconds
- **Action timeout**: 10 seconds
- **Navigation timeout**: 30 seconds
- **Expect timeout**: 10 seconds

## 📊 Test Results

Test results are saved to:

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/` (on failure)
- **Traces**: `test-results/` (on retry)

## 🔍 Debugging Tests

### UI Mode

The best way to debug tests:

```bash
bun run test:e2e:ui
```

This opens an interactive UI where you can:

- Run tests step-by-step
- See live browser preview
- Inspect locators
- View test timeline
- Debug failures

### Debug Mode

Run tests with Playwright Inspector:

```bash
bun run test:e2e:debug
```

### Headed Mode

See the browser while tests run:

```bash
bun run test:e2e:headed
```

### VS Code Extension

Install the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension for:

- Run tests from editor
- Set breakpoints
- View test results inline
- Record new tests

## 🚦 CI/CD Integration

### GitHub Actions

Add to `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Install Playwright browsers
        run: bun run playwright:install

      - name: Run E2E tests
        run: bun run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload test artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
          retention-days: 30
```

## 📈 Performance Benchmarks

Expected performance metrics:

- **Page Load**: < 3 seconds
- **First Contentful Paint**: < 2 seconds
- **Interactive Elements**: < 500ms response time
- **Theme Switching**: < 1 second

## ♿ Accessibility Standards

Tests verify WCAG 2.1 AA compliance:

- ✅ Proper heading hierarchy (single h1)
- ✅ Alt text on all images
- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ Sufficient color contrast
- ✅ Focus indicators

## 🐛 Common Issues

### Tests Failing Locally

1. **Network Issues**: Tests require internet connection to access deployed site
2. **Browser Not Installed**: Run `bun run playwright:install`
3. **Timeout Issues**: Increase timeouts in `playwright.config.ts`

### Site Not Available

If the deployed site is down:

- Check GitHub Pages deployment status
- Verify the base URL in `playwright.config.ts`
- Check for any DNS issues

### Flaky Tests

If tests are flaky:

- Use proper waits (`waitForLoadState`, `waitForSelector`)
- Avoid `waitForTimeout` except for animations
- Use `toBeVisible()` instead of checking existence
- Increase retries in CI

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [OpenCode Font Docs](https://pantheon-org.github.io/opencode-font/)

## 🤝 Contributing

When adding new tests:

1. Follow the Page Object Model pattern
2. Add tests to appropriate spec file
3. Update page objects if needed
4. Ensure tests are deterministic (no flakiness)
5. Add meaningful test descriptions
6. Test across all browsers
7. Verify accessibility compliance

## 📝 Test Checklist

When creating new tests, verify:

- [ ] Test has clear, descriptive name
- [ ] Uses Page Object Model
- [ ] Includes proper assertions
- [ ] Tests one specific behavior
- [ ] Handles async operations correctly
- [ ] Works across all browsers
- [ ] Includes accessibility checks
- [ ] Has proper error handling
- [ ] Is not flaky
- [ ] Runs in reasonable time

## 🎯 Future Enhancements

Potential improvements:

- [ ] Visual regression testing with Percy or Applitools
- [ ] Performance monitoring with Lighthouse CI
- [ ] API testing for backend endpoints
- [ ] Load testing for high traffic scenarios
- [ ] Internationalization testing
- [ ] Security testing (XSS, CSRF)
- [ ] SEO validation
- [ ] Analytics verification

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Check Playwright documentation
- Review test logs and screenshots
- Use debug mode to investigate failures

---

**Happy Testing! 🎭**
