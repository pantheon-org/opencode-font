# Setup CI Pipeline for Lint, Test, and Type Checks on MR to Main

## Goal

Configure automated continuous integration (CI) pipeline(s) that execute linting, testing, and type checking on all merge requests (MRs) targeting the main branch. The pipeline must validate code quality before merge approval, ensuring consistent standards and catching errors early.

## Context

- This repository uses Bun as the runtime and package manager, with TypeScript as the primary language.
- The project already has npm scripts defined: `lint`, `test`, and `typecheck` in package.json.
- The repository is a git repository (platform-specific CI configuration will depend on hosting service: GitHub Actions, GitLab CI, Bitbucket Pipelines, etc.).
- Assumption: The CI pipeline should fail the MR if any check (lint, test, or typecheck) fails.
- Assumption: The pipeline should run automatically on push to MR branches and on updates to existing MRs.

## Inputs

- Current package.json with existing scripts: `lint`, `test`, `typecheck`
- Repository structure and git configuration
- CI/CD platform being used (GitHub, GitLab, Bitbucket, or other)
- Bun version requirements (if any specific version needed)
- Branch protection rules or approval requirements (if any exist)

## Deliverables

1. **CI configuration file(s)** in the appropriate format for the platform:
   - GitHub: `.github/workflows/ci.yml` or `.github/workflows/pr-checks.yml`
   - GitLab: `.gitlab-ci.yml`
   - Bitbucket: `bitbucket-pipelines.yml`
   - Other: Platform-specific configuration file

2. **Pipeline definition** that includes:
   - Job/step to install dependencies using Bun
   - Job/step to run `bun run lint`
   - Job/step to run `bun run test`
   - Job/step to run `bun run typecheck`
   - Trigger configuration for MRs to main branch only

3. **Documentation update** (optional but recommended):
   - Brief addition to README.md explaining the CI checks
   - Or a separate CI.md or CONTRIBUTING.md section

## Constraints & Limitations

- Must use Bun (not npm or yarn) for dependency installation and script execution
- Must run on merge requests targeting the `main` branch specifically
- Must not modify existing npm scripts in package.json (reuse existing `lint`, `test`, `typecheck` commands)
- Should use publicly available CI runners (no custom self-hosted infrastructure assumptions)
- Must fail the entire pipeline if any single check fails (lint, test, or typecheck)
- Configuration must be version-controlled in the repository
- Must not include deployment or publishing steps (validation only)

## Quality Standards & Acceptance Criteria

- [ ] Pipeline configuration file is syntactically valid for the target CI platform
- [ ] Pipeline triggers only on MRs to main branch (not on direct pushes to main, not on other branches)
- [ ] All three checks (lint, test, typecheck) execute successfully on a clean repository state
- [ ] Pipeline fails correctly when intentional errors are introduced (e.g., lint error, failing test, type error)
- [ ] Dependencies are cached appropriately to optimize build times on subsequent runs
- [ ] Pipeline status is visible in the MR interface (shows pass/fail for each check)
- [ ] Bun version is explicitly specified or uses stable/LTS version
- [ ] Pipeline completes within reasonable time (< 5 minutes for typical small project)

## Style & Tone

- Configuration should be concise and well-commented
- Use industry-standard CI/CD patterns and best practices
- Technical and precise; target audience is software engineers familiar with CI/CD concepts
- Comments should explain "why" decisions were made, not just "what" the code does

## Clarifying Questions

1. **Which CI/CD platform is this repository hosted on?** (GitHub, GitLab, Bitbucket, Azure DevOps, or other)
2. **Are there any existing CI configuration files that should be extended rather than created from scratch?**
3. **Should the pipeline run in parallel (all checks simultaneously) or sequentially (stop on first failure)?**

## Example Output

**Example 1: GitHub Actions workflow file (`.github/workflows/pr-checks.yml`)**

```yaml
name: MR Checks

on:
  pull_request:
    branches:
      - main

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - run: bun run lint
      - run: bun run test
      - run: bun run typecheck
```

**Example 2: GitLab CI configuration (`.gitlab-ci.yml`)**

```yaml
lint_test_typecheck:
  image: oven/bun:latest
  only:
    - merge_requests
  script:
    - bun install
    - bun run lint
    - bun run test
    - bun run typecheck
```

## "Do not do" list

1. **Do not modify the existing npm scripts** (`lint`, `test`, `typecheck`) in package.json — reuse them as-is.
2. **Do not add additional checks** beyond lint, test, and typecheck (e.g., no security scanning, coverage thresholds, or deployment steps unless explicitly requested).
3. **Do not assume a specific CI platform** without first confirming with the user or detecting from repository structure.
