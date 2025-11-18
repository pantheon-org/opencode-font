# CI/CD Workflow Documentation

This directory contains GitHub Actions workflows that automate testing, versioning, and publishing for the opencode-font package.

## Workflows Overview

### 1. Validate PR (Lint, Test, Build)

**File:** `1-validate.yml`  
**Trigger:** Pull requests to `main` branch

**Purpose:** Ensures code quality before merging

**Steps:**

- Checkout code and setup Bun
- Install dependencies with caching
- Run format check (`bun run format:check`)
- Run linter (`bun run lint`)
- Run type checking (`bun run typecheck`)
- Run tests with coverage (`bun run test:coverage`)
- Build project (`bun run build`)
- Analyze PR size and warn if too large (>20 files or >500 lines)

**Skip Condition:** Automatically skips for `version-bump/*` branches

---

### 2. Version Update (Create PR)

**File:** `2-version-update.yml`  
**Trigger:** Push to `main` branch (excludes docs and markdown changes)

**Purpose:** Automatically creates version bump PRs based on conventional commits

**Steps:**

1. Analyzes commits since last tag using conventional commit patterns
2. Determines version bump type:
   - `BREAKING CHANGE` or `!:` → **major** (1.0.0 → 2.0.0)
   - `feat:` or `feature:` → **minor** (1.0.0 → 1.1.0)
   - `fix:`, `docs:`, `chore:` → **patch** (1.0.0 → 1.0.1)
3. Calculates new version number
4. Creates branch `version-bump/vX.Y.Z`
5. Updates `package.json` version
6. Creates PR with changelog

**Manual Trigger:** Can be manually run with forced version type (major/minor/patch/auto)

**Safety:** Detects and skips workflow-generated commits to prevent loops

---

### 3. Auto-Merge Version PR

**File:** `3-auto-merge.yml`  
**Trigger:**

- Pull request events (opened, synchronize, reopened)
- Pull request reviews
- Check suite completion
- Workflow run completion

**Purpose:** Automatically merges version bump PRs once all checks pass

**Logic:**

1. Identifies PRs with title pattern: `chore: bump version to vX.Y.Z`
2. Verifies PR is from `github-actions[bot]` or configured PAT user
3. Checks all CI checks have passed (with retries)
4. Enables auto-merge with squash strategy
5. Posts comment about next steps

**Retry Strategy:** Up to 3 attempts with 30-second delays for pending checks

**Configuration:** Set `WORKFLOW_PAT_OWNER` variable to allow PRs from specific user

---

### 4. Create Tag (After Version Merge)

**File:** `4-create-tag.yml`  
**Trigger:** Push to `main` that modifies `package.json`

**Purpose:** Creates git tag after version bump merge

**Steps:**

1. Detects version bump commits (pattern: `chore: bump version to X.Y.Z`)
2. Reads version from `package.json`
3. Checks if tag `vX.Y.Z` already exists
4. Creates annotated tag with release message
5. Pushes tag to remote

**Tag Format:** `v{major}.{minor}.{patch}` (e.g., `v1.2.3`)

**Triggers:** Pushing the tag triggers the publish workflow

---

### 5. Publish Release (npm + gh-pages)

**File:** `5-publish.yml`  
**Trigger:** Push of tags matching `v*`

**Purpose:** Publishes package to npm and deploys demo to GitHub Pages

**Jobs:**

#### Job 1: Publish to npm

- Verifies version in `package.json` matches tag
- Runs full validation (lint, typecheck, test, build)
- Checks if version already published to npm
- Publishes with `--access public --provenance`
- Verifies publication (6 attempts with 15-second delays)

#### Job 2: Deploy Demo to gh-pages

- Builds the project
- Deploys `demo/` directory to `gh-pages` branch
- Accessible at: `https://pantheon-org.github.io/opencode-font/`

#### Job 3: Create GitHub Release

- Gets commits since previous tag
- Generates changelog
- Creates GitHub Release with:
  - Version information
  - Changelog from commits
  - npm package link
  - Demo site link
  - Build information

#### Job 4: Summary

- Displays results of all jobs
- Provides links to npm, GitHub Pages, and release

**Manual Trigger:** Can specify a tag to publish

---

## Helper Scripts

Located in `.github/scripts/`:

### analyze-commits.sh

Analyzes commit messages to determine semantic version bump type.

**Usage:** `./analyze-commits.sh commits.txt`

**Returns:** `major`, `minor`, `patch`, or `none`

### calculate-version.sh

Calculates new version number based on current version and bump type.

**Usage:** `./calculate-version.sh 1.2.3 minor`

**Returns:** `1.3.0`

### create-version-pr.sh

Creates version bump branch, updates package.json, and creates PR.

**Usage:** `./create-version-pr.sh 1.3.0 1.2.3 minor version-bump/v1.3.0`

---

## Required Secrets

Configure these in GitHub repository settings → Secrets and variables → Actions:

| Secret         | Required | Purpose                                                        |
| -------------- | -------- | -------------------------------------------------------------- |
| `NPM_TOKEN`    | **Yes**  | npm authentication token for publishing packages               |
| `WORKFLOW_PAT` | No       | Personal Access Token for auto-merge (if using different user) |

### Creating NPM_TOKEN

1. Go to npmjs.com → Account → Access Tokens
2. Generate new token (Type: Automation)
3. Copy token and add to GitHub secrets

### Creating WORKFLOW_PAT (Optional)

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` and `workflow` scopes
3. Copy token and add to GitHub secrets

---

## Configuration Variables

Optional variables in GitHub repository settings → Secrets and variables → Actions → Variables:

| Variable             | Default  | Purpose                                          |
| -------------------- | -------- | ------------------------------------------------ |
| `WORKFLOW_PAT_OWNER` | `thoroc` | GitHub username allowed to create auto-merge PRs |

---

## Conventional Commit Format

Use these prefixes to control version bumping:

```bash
# Minor version bump (new features)
feat: add text-to-SVG conversion
feat(api): add color customization

# Patch version bump (bug fixes, chores, docs)
fix: correct SVG viewport calculation
fix(types): resolve TypeScript errors
docs: update API documentation
chore: update dependencies
ci: improve workflow performance

# Major version bump (breaking changes)
feat!: change API signature
feat(api)!: remove deprecated methods
BREAKING CHANGE: complete API redesign
```

---

## Workflow Sequence

Complete flow from PR to npm release:

```
1. Developer creates PR → main
   ↓
2. [1-validate.yml] Runs lint, test, typecheck, build
   ↓
3. Developer merges PR (or auto-merge completes)
   ↓
4. [2-version-update.yml] Analyzes commits, creates version PR
   ↓
5. [1-validate.yml] Validates version bump PR
   ↓
6. [3-auto-merge.yml] Auto-merges version PR
   ↓
7. [4-create-tag.yml] Creates git tag vX.Y.Z
   ↓
8. [5-publish.yml] Publishes to npm + gh-pages + creates release
```

---

## Troubleshooting

### Version PR not created

- Check if commits follow conventional commit format
- Verify workflow isn't skipped (check commit message for `[skip ci]`)
- Look at workflow logs in Actions tab

### Auto-merge not working

- Verify PR title matches pattern exactly
- Check if all required checks passed
- Ensure `WORKFLOW_PAT` has correct permissions (if used)
- Review auto-merge workflow logs

### npm publish fails

- Verify `NPM_TOKEN` secret is set correctly
- Check npm token hasn't expired
- Ensure package name is available on npm
- Verify package.json version matches tag

### gh-pages deployment fails

- Ensure GitHub Pages is enabled in repository settings
- Check that `demo/` directory exists and contains files
- Verify GitHub Actions has write permissions

---

## Manual Operations

### Manually trigger version bump

1. Go to Actions → "2. Version Update (Create PR)"
2. Click "Run workflow"
3. Select branch: `main`
4. Choose version type: auto/major/minor/patch
5. Click "Run workflow"

### Manually publish a version

1. Go to Actions → "5. Publish Release (npm + gh-pages)"
2. Click "Run workflow"
3. Enter tag (e.g., `v1.2.3`)
4. Click "Run workflow"

### Force re-run failed workflow

1. Go to Actions tab
2. Select failed workflow run
3. Click "Re-run all jobs" or "Re-run failed jobs"

---

## Best Practices

1. **Commit Messages:** Always use conventional commit format
2. **PR Size:** Keep PRs small (<20 files, <500 lines) for easier review
3. **Testing:** Ensure all tests pass locally before pushing
4. **Breaking Changes:** Document breaking changes in PR description
5. **Dependencies:** Keep dependencies up to date for security
6. **Secrets:** Rotate npm tokens periodically
7. **Monitoring:** Check GitHub Actions tab regularly for failed workflows

---

## Security Considerations

- All workflows use pinned action versions with commit SHA
- npm publishing uses provenance for supply chain security
- Workflows have minimal necessary permissions
- PAT tokens should have limited scope (only repo + workflow)
- Branch protection recommended for `main` branch

---

## Font Generation in CI/CD

### Overview

The OpenCodeLogo font files (WOFF2, WOFF, TTF) are automatically generated during CI/CD workflows. Generated fonts are included in the published npm package but are NOT committed to git.

### Integration Points

#### Validation Workflow (`1-validate.yml`)

Font generation added after dependency installation:

```yaml
- name: Generate font files
  run: |
    bun run generate:fonts
    bash scripts/validate-fonts.sh
```

**Purpose:** Validates that font generation works correctly in PRs.

#### Publish Workflow (`5-publish.yml`)

Font generation added to both npm publish and demo deploy jobs:

```yaml
- name: Generate font files
  run: |
    bun run generate:fonts
    ls -lh fonts/*.woff2 fonts/*.woff fonts/*.ttf
    bash scripts/validate-fonts.sh
```

**Purpose:** Generates fonts for npm package distribution and GitHub Pages demo.

### Font Generation Details

**Command:**

```bash
bun run generate:fonts
```

**Process:**

1. Converts 32 grid-based glyphs (A-Z + 6 symbols) to SVG files
2. Combines SVGs into SVG font format
3. Converts SVG font → TTF → WOFF2/WOFF
4. Validates output files

**Output:**

- `fonts/OpenCodeLogo.woff2` (~1.3 KB)
- `fonts/OpenCodeLogo.woff` (~1.8 KB)
- `fonts/OpenCodeLogo.ttf` (~6.4 KB)
- **Total:** ~9.5 KB

**Performance:** ~0.15 seconds (800× faster than 2-minute target)

### Validation

**Command:**

```bash
bun run validate:fonts
```

**Checks:**

- File existence (WOFF2, WOFF, TTF)
- Size limits (< 50KB, 100KB, 200KB respectively)
- Format correctness (magic bytes verification)
- Non-empty files

**Failure:** Build stops immediately if validation fails.

### Local Development

Developers must generate fonts locally:

```bash
bun run generate:fonts  # Generate fonts
bun run validate:fonts  # Optional validation
open fonts/test.html    # Visual test
```

**Note:** Font files excluded from git via `.gitignore`.

### Package Distribution

The `package.json` includes fonts in the published package:

```json
"files": ["dist/", "fonts/"]
```

Consumers receive compiled code (`dist/`) and font files (`fonts/`).

---

## Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
