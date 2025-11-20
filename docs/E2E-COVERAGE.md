# Code Coverage with Playwright

This guide explains how to collect and analyze code coverage from your Playwright E2E tests.

## Overview

Playwright can collect **JavaScript** and **CSS** coverage data from the browser during test execution. This helps you understand:

- Which JavaScript code is executed during tests
- Which CSS rules are applied during tests
- Overall frontend code coverage percentage
- Areas of the application that need more testing

## Quick Start

### 1. Run Coverage Example

```bash
# Run the coverage example test
bun run test:e2e:coverage

# View coverage reports
bun run test:e2e:coverage:report
```

### 2. View Results

Coverage data is saved to `coverage/e2e/`:

- `*-js.json` - JavaScript coverage data
- `*-css.json` - CSS coverage data
- `*-summary.json` - Coverage summary statistics

## Using Coverage in Your Tests

### Basic Usage

```typescript
import { test } from '@playwright/test';
import { startCoverage, stopCoverage } from './coverage.helper';

test('my test with coverage', async ({ page }) => {
  // Start coverage collection
  await startCoverage(page);

  // Navigate and interact
  await page.goto('/');
  // ... your test actions ...

  // Stop coverage and save results
  await stopCoverage(page, 'my-test');
});
```

### With Summary Reports

```typescript
import { test } from '@playwright/test';
import {
  startCoverage,
  stopCoverage,
  generateCoverageSummary,
  saveCoverageSummary,
  printCoverageSummary,
} from './coverage.helper';

test('test with summary', async ({ page }) => {
  await startCoverage(page);

  await page.goto('/');
  // ... test actions ...

  const coverage = await stopCoverage(page, 'test-name');
  const summary = generateCoverageSummary(coverage.js, coverage.css);

  saveCoverageSummary(summary, 'test-name');
  printCoverageSummary(summary, 'Test Name');
});
```

### Using Hooks for All Tests

Add coverage collection to all tests in a file:

```typescript
import { test } from '@playwright/test';
import { startCoverage, stopCoverage } from './coverage.helper';

test.beforeEach(async ({ page }) => {
  await startCoverage(page);
});

test.afterEach(async ({ page }, testInfo) => {
  await stopCoverage(page, testInfo.title.replace(/\s+/g, '-'));
});

test('test 1', async ({ page }) => {
  // Coverage automatically collected
});

test('test 2', async ({ page }) => {
  // Coverage automatically collected
});
```

## Understanding Coverage Data

### JavaScript Coverage

JavaScript coverage shows which parts of your JS code were executed:

```json
{
  "total": 150000,
  "covered": 120000,
  "percentage": 80.0,
  "files": 25
}
```

- **total**: Total bytes of JavaScript
- **covered**: Bytes that were executed
- **percentage**: Coverage percentage
- **files**: Number of JS files loaded

### CSS Coverage

CSS coverage shows which CSS rules were applied:

```json
{
  "total": 50000,
  "covered": 35000,
  "percentage": 70.0,
  "files": 8
}
```

### Overall Coverage

Combined JavaScript and CSS coverage:

```json
{
  "percentage": 77.5
}
```

## Coverage Scripts

### Available Commands

```bash
# Run coverage example test
bun run test:e2e:coverage

# View coverage report summary
bun run test:e2e:coverage:report

# Run specific test with coverage
playwright test my-test.spec.ts

# Clean coverage data
rm -rf coverage/e2e/
```

## Best Practices

### 1. Collect Coverage for Critical Paths

Focus on collecting coverage for:

- Main user journeys
- Authentication flows
- Core features
- Navigation patterns

### 2. Test Multiple Browsers

Different browsers may execute different code paths:

```bash
# Test coverage on different browsers
playwright test coverage-example.spec.ts --project=chromium
playwright test coverage-example.spec.ts --project=firefox
playwright test coverage-example.spec.ts --project=webkit
```

### 3. Coverage Thresholds

Set minimum coverage thresholds in your tests:

```typescript
test('should meet coverage threshold', async ({ page }) => {
  // ... test actions ...

  const coverage = await stopCoverage(page, 'threshold-test');
  const summary = generateCoverageSummary(coverage.js, coverage.css);

  expect(summary.overall.percentage).toBeGreaterThan(70);
  expect(summary.js.percentage).toBeGreaterThan(75);
  expect(summary.css.percentage).toBeGreaterThan(60);
});
```

### 4. Continuous Monitoring

Track coverage trends over time:

- Save coverage reports as artifacts in CI
- Compare coverage across branches
- Set up alerts for coverage drops

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run E2E tests with coverage
  run: bun run test:e2e:coverage

- name: Upload coverage artifacts
  uses: actions/upload-artifact@v3
  with:
    name: e2e-coverage
    path: coverage/e2e/
    retention-days: 30
```

## Limitations

### What Coverage DOES Show

✅ JavaScript that was executed  
✅ CSS rules that were applied  
✅ Code paths taken during tests  
✅ Unused code that can be removed

### What Coverage DOESN'T Show

❌ Backend/API code coverage  
❌ Server-side rendered code  
❌ Code quality or correctness  
❌ Whether tests are comprehensive

## Troubleshooting

### No Coverage Data Collected

**Problem**: Coverage data is empty or zero

**Solutions**:

- Ensure `startCoverage()` is called BEFORE navigation
- Check that JavaScript/CSS is actually loaded
- Verify the page isn't using external CDN resources
- Check browser console for errors

### Low Coverage Percentage

**Problem**: Coverage is lower than expected

**Solutions**:

- Add more test interactions
- Test different user paths
- Include edge cases and error scenarios
- Test mobile and desktop viewports

### Coverage Files Not Found

**Problem**: Coverage directory doesn't exist

**Solutions**:

- Run tests first to generate coverage
- Check write permissions for `coverage/e2e/`
- Ensure `ensureCoverageDir()` is called

## Example Output

```
📊 Coverage Summary for: Home Page
──────────────────────────────────────────────────
JavaScript Coverage: 82.5% (25 files)
  Total: 150000 bytes
  Covered: 123750 bytes
CSS Coverage: 68.3% (8 files)
  Total: 50000 bytes
  Covered: 34150 bytes
Overall Coverage: 78.9%
──────────────────────────────────────────────────
```

## Additional Resources

- [Playwright Coverage API](https://playwright.dev/docs/api/class-coverage)
- [Chrome DevTools Protocol - Coverage](https://chromerdevtools.github.io/devtools-protocol/tot/Profiler/)
- [Example Tests](./coverage-example.spec.ts)
- [Coverage Helper](./coverage.helper.ts)

## Next Steps

1. Run the example coverage test: `bun run test:e2e:coverage`
2. Add coverage to your existing tests using hooks
3. Set coverage thresholds for critical paths
4. Integrate coverage reports into CI/CD
5. Monitor coverage trends over time
