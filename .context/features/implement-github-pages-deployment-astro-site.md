# Implement GitHub Pages Deployment for OpenCode Font Package

## Goal

Port the GitHub Pages deployment pipeline from the `opencode-warcraft-notifications` project to the `opencode-font` project, including the Astro-based site generator, to create an interactive demo/documentation site showcasing the OpenCodeLogo font and both text-to-SVG APIs.

## Context

- The `opencode-warcraft-notifications` project has a working GitHub Pages deployment pipeline using Astro as a static site generator with the following structure:
  - `pages/` directory with Astro site source
  - `docs/` directory with markdown documentation
  - `transform-docs.js` script to convert docs to Astro content
  - GitHub Actions workflow (`deploy-docs.yml`) that builds and deploys to gh-pages
- The `opencode-font` project currently has a simple `demo/index.html` file but no automated deployment
- The target is to create an interactive showcase of both `convertTextToSVG()` and `blockyTextToSVG()` APIs with live examples
- The existing `demo/` directory content should be integrated or replaced with the Astro site

**Assumptions:**
- The deployment should follow the same architectural patterns as `opencode-warcraft-notifications`
- The site should include both API documentation and interactive demos
- Fonts generated during CI should be available to the deployed site

## Inputs

1. **Source Repository**: `../opencode-warcraft-notifications/` containing:
   - `.github/workflows/deploy-docs.yml` - Deployment workflow
   - `.github/workflows/chores-pages.yml` - Pages configuration checker
   - `pages/` directory - Complete Astro site structure
   - `pages/transform-docs.js` - Documentation transformation script
   - `docs/` directory - Markdown documentation structure

2. **Target Repository**: `/Users/thomas.roche/Projects/github/pantheon-org/opencode-font` containing:
   - Existing `demo/index.html` - Simple demo page
   - `README.md` - Package documentation
   - Generated fonts in `fonts/` directory
   - Alphabet module in `src/alphabet/`

3. **Existing Infrastructure**:
   - CI/CD pipelines (1-validate.yml, 2-version-update.yml, etc.)
   - Font generation in `scripts/generate-fonts.ts`
   - Bun as runtime/package manager

## Deliverables

1. **Astro Site Structure** (`pages/` directory):
   ```
   pages/
   ├── src/
   │   ├── content/
   │   │   └── docs/         # Transformed markdown docs
   │   ├── pages/
   │   │   ├── index.astro   # Landing page with demos
   │   │   └── demo.astro    # Interactive demo page
   │   └── components/       # Reusable Astro components
   ├── public/
   │   └── fonts/            # Symlink or copy of generated fonts
   ├── astro.config.mjs
   ├── package.json
   ├── tsconfig.json
   └── transform-docs.js     # Doc transformation script
   ```

2. **GitHub Actions Workflow** (`.github/workflows/deploy-docs.yml`):
   - Build step: Install dependencies, generate fonts, transform docs, build Astro site
   - Deploy step: Deploy `pages/dist/` to GitHub Pages using `actions/deploy-pages@v4`
   - Triggered on: push to main (paths: `demo/**`, `pages/**`, `README.md`), releases, workflow_dispatch

3. **Pages Configuration Checker** (`.github/workflows/chores-pages.yml`):
   - Daily cron job to verify GitHub Pages is configured correctly
   - Creates issue if misconfigured

4. **Interactive Demo Pages**:
   - Landing page showcasing both `convertTextToSVG` and `blockyTextToSVG` APIs
   - Live editor where users can type text and see both rendering methods
   - Theme switcher for blocky text (light/dark)
   - Font file download links
   - API documentation embedded from README

5. **Documentation Updates**:
   - Update root `README.md` with link to GitHub Pages site
   - Create `pages/README.md` explaining the site structure
   - Update `.github/workflows/README.md` with deployment workflow docs

## Constraints & Limitations

- **Technology Stack**: Must use Astro (same as source project), Bun runtime
- **No Breaking Changes**: Existing CI/CD workflows (1-5) must continue working
- **Font Availability**: Fonts must be generated before site build and available in `pages/public/fonts/`
- **Repository Settings**: GitHub Pages must be configured to deploy from Actions (not branch)
- **Security**: No secrets or API keys should be committed; use GitHub Actions permissions
- **Dependencies**: Minimize new npm dependencies; reuse from source project where possible
- **File Size**: Keep `pages/dist/` output under 50MB for GitHub Pages limits
- **Browser Support**: Site should work in modern browsers (Chrome, Firefox, Safari, Edge)

## Quality Standards & Acceptance Criteria

1. **Deployment Success**:
   - [ ] GitHub Actions workflow completes successfully
   - [ ] Site deploys to `https://pantheon-org.github.io/opencode-font/`
   - [ ] No 404 errors on deployed site
   - [ ] Fonts load correctly in deployed environment

2. **Functionality**:
   - [ ] Both `convertTextToSVG` and `blockyTextToSVG` demos work interactively
   - [ ] Users can input text and see live SVG output
   - [ ] Theme switcher toggles between light/dark for blocky text
   - [ ] Font files are downloadable from the site
   - [ ] All internal links work (no broken links)

3. **Build Performance**:
   - [ ] Total build time < 5 minutes
   - [ ] Site loads in < 2 seconds (measured from deployed URL)
   - [ ] Lighthouse score > 90 for Performance

4. **Code Quality**:
   - [ ] TypeScript compiles without errors
   - [ ] ESLint passes for Astro/TypeScript files
   - [ ] All workflows pass validation locally and in CI

5. **Documentation**:
   - [ ] README includes link to deployed site
   - [ ] Workflow README documents the deployment process
   - [ ] Site includes "View on GitHub" link back to repository

## Style & Tone

- **Technical**: Precise, developer-focused documentation
- **Code Comments**: Clear explanations for workflow steps and Astro configuration
- **UI/UX**: Clean, minimalist design matching OpenCode.ai branding (if applicable)
- **Audience**: TypeScript developers, font designers, and npm package users
- **Consistency**: Follow existing code style from `opencode-font` project (ESLint/Prettier)

## Clarifying Questions

If any of the following are unclear, seek clarification:

1. **Site Branding**: Should the GitHub Pages site use OpenCode.ai branding colors/styles, or a neutral design? (Recommend using the theme colors from `src/alphabet/theme.ts`)

2. **Demo Scope**: Should the interactive demo include all 32 characters, or focus on common examples? (Recommend showcase: "HELLO-WORLD!" and "OPENCODE" with character list)

3. **Deployment Trigger**: Should font changes (`src/alphabet/glyphs/**`) trigger site redeployment, or only explicit demo/pages changes? (Recommend trigger on alphabet changes for consistency)

## Example Output

**File**: `.github/workflows/deploy-docs.yml` (partial)
```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths:
      - 'demo/**'
      - 'pages/**'
      - 'src/alphabet/**'  # Redeploy when glyphs change
      - 'README.md'
  release:
    types: [published]
  workflow_dispatch:

jobs:
  build:
    name: Build Documentation
    steps:
      - name: Generate font files
        run: bun run generate:fonts
      
      - name: Build Astro site
        run: |
          cd pages
          bun install --frozen-lockfile
          bun run build
```

**File**: `pages/src/pages/index.astro` (partial)
```astro
---
import { blockyTextToSVG, convertTextToSVG } from '@pantheon-org/opencode-font';

const exampleText = 'HELLO';
const blockySvg = blockyTextToSVG(exampleText, { theme: 'dark', blockSize: 6 });
const simpleSvg = convertTextToSVG(exampleText, { fontSize: 48 });
---

<h1>OpenCode Font Demo</h1>
<div set:html={blockySvg}></div>
<div set:html={simpleSvg}></div>
```

**Site URL**: `https://pantheon-org.github.io/opencode-font/`

## "Do Not Do" List

1. **Do not remove or modify existing `demo/index.html`** until the Astro site is fully functional - keep it as a fallback during development.

2. **Do not change the font generation process** - the deployment should consume the already-generated fonts from `fonts/` directory.

3. **Do not create a separate deployment branch (gh-pages)** - use GitHub Actions to deploy directly from the workflow (modern approach as seen in source project).
