# @pantheon-org/opencode-font

OpenCode-style font package with text-to-SVG conversion.

## Overview

This package bundles OpenCode-styled web fonts and exposes a small API to convert text into an SVG string which
references the packaged font.

## Usage

Install (local):

```bash
npm install /path/to/opencode-font
```

Import and use:

```js
import { convertTextToSVG } from '@pantheon-org/opencode-font';

const svg = convertTextToSVG('OpenCode', { fontSize: 48, color: '#111' });
console.log(svg);
```

To use the font in the browser, include the font files from the `fonts/` directory and reference via `@font-face` in
your CSS.

## API

- `convertTextToSVG(text, options)` — returns an SVG string.

Options:

- `fontSize` (number) — default `48`
- `color` (string) — default `#000`
- `fontFamily` (string) — default `OpenCodeLogo`
- `width`, `height` (number) — optional
- `role`, `ariaLabel` — accessibility attributes

## Development

Run tests with:

```bash
npm test
```

## Using the packaged CSS helper

This repo includes a small helper CSS at `css/opencode-font.css` that registers the `OpenCode` font-family and points at font files in the `fonts/` directory. If you publish the package, adjust the paths or include the CSS from your build output.

Example (install and include):

```html
<link rel="stylesheet" href="node_modules/@pantheon-org/opencode-font/css/opencode-font.css" />
```

Demo

Open `demo/index.html` in a browser to see a small interactive demo that generates SVG from text and uses the packaged font via the helper CSS (replace the placeholder font files in `fonts/` with real files for accurate rendering).

## CI/CD Pipeline

This repository uses a fully automated CI/CD pipeline for testing, versioning, and publishing:

### Workflow Overview

1. **Pull Request Validation** (`.github/workflows/1-validate.yml`)
   - Runs on every PR to `main`
   - Executes: linting, type checking, tests with coverage, and build
   - Analyzes PR size and warns if too large

2. **Version Bumping** (`.github/workflows/2-version-update.yml`)
   - Triggers after merge to `main`
   - Analyzes commits using conventional commit patterns
   - Automatically creates version bump PR based on changes:
     - `feat:` → minor version bump
     - `fix:` → patch version bump
     - `BREAKING CHANGE` or `!:` → major version bump

3. **Auto-Merge** (`.github/workflows/3-auto-merge.yml`)
   - Automatically merges version bump PRs once checks pass
   - Validates PR format and author
   - Retries if checks are still pending

4. **Tag Creation** (`.github/workflows/4-create-tag.yml`)
   - Creates git tag after version bump is merged
   - Tag format: `v{major}.{minor}.{patch}`
   - Triggers publishing workflow

5. **Publishing** (`.github/workflows/5-publish.yml`)
   - Publishes to npm with provenance
   - Deploys demo to GitHub Pages
   - Creates GitHub Release with changelog

### Conventional Commits

Use conventional commit messages to control version bumping:

```bash
feat: add new feature          # minor bump (0.1.0 → 0.2.0)
fix: resolve bug               # patch bump (0.1.0 → 0.1.1)
feat!: breaking change         # major bump (0.1.0 → 1.0.0)
docs: update documentation     # patch bump (0.1.0 → 0.1.1)
chore: update dependencies     # patch bump (0.1.0 → 0.1.1)
```

### Required Secrets

Add these secrets to your GitHub repository settings:

- `NPM_TOKEN` - npm authentication token for publishing
- `WORKFLOW_PAT` (optional) - Personal Access Token with repo and workflow permissions for auto-merge

### Manual Version Bump

To manually trigger a version bump:

1. Go to Actions → "2. Version Update (Create PR)"
2. Click "Run workflow"
3. Select version type: auto, major, minor, or patch

## License

MIT
