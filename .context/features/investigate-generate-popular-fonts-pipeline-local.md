# Investigation: Generate Popular Font Formats for CI/CD Pipeline and Local Development

## Goal

Investigate and document the technical approach for generating the most widely-used web font formats (woff2, woff, ttf) from a source file, with the capability to execute this generation both within the existing CI/CD pipeline and locally via a standalone script. The outcome must enable automated font file production during releases and on-demand generation during development.

## Context

- **Current state**: The project has an empty `fonts/` directory (only `.gitkeep`) and a fully functional CI/CD pipeline (`.github/workflows/1-validate.yml` through `5-publish.yml`). The `convertTextToSVG` function exists but references a font family `OpenCodeLogo` that does not yet have corresponding font files.
- **CI/CD integration**: The publish workflow (`.github/workflows/5-publish.yml`) already builds, tests, validates, and publishes the package to npm with provenance and deploys a demo to GitHub Pages. Font generation must fit seamlessly into this flow without breaking existing steps.
- **Local development requirement**: Developers must be able to regenerate fonts locally when the source design changes, without requiring CI execution or network access.
- **Assumptions**:
  - A source design file (SVG, OTF, TTF, or design tool export) exists or will be provided.
  - Legal rights to create and distribute the font are confirmed.
  - Target formats are woff2, woff, and ttf (minimum); additional formats like otf or eot are optional.
  - Font generation tools must run on Linux (CI) and macOS/Linux (local development).

## Inputs

- **Source font or design file**: Path to the base font file or vector source (e.g., `assets/opencode-logo.svg`, `assets/OpenCodeLogo.otf`, or design tool export).
- **Target font formats**: Specify required formats (default: woff2, woff, ttf).
- **Font metadata**: Font family name (`OpenCodeLogo`), font weight(s), style(s), character set/glyph coverage requirements.
- **Existing CI configuration**: `.github/workflows/5-publish.yml` and other workflow files to understand integration points.
- **Package manager**: Project uses Bun (as seen in `package.json` scripts).
- **Operating system constraints**: CI runs on ubuntu-latest; local development on macOS and Linux.

## Deliverables

1. **Investigation Report** (markdown document):
   - **Section 1**: Comparison of font generation tools and approaches (e.g., FontForge CLI, fonttools Python library, font-blast, svg2ttf/ttf2woff2 npm packages, etc.).
   - **Section 2**: Recommended toolchain with justification (ease of use, cross-platform support, maintenance status, licensing).
   - **Section 3**: Step-by-step instructions for local font generation script creation.
   - **Section 4**: CI integration approach — where in the pipeline to add font generation (e.g., before build step in publish workflow or as separate reusable workflow).
   - **Section 5**: Testing and validation strategy for generated fonts (file size checks, format correctness, loading in browsers).

2. **Local Script Skeleton** (pseudocode or shell script outline, not full implementation):
   - Example: `scripts/generate-fonts.sh` or `scripts/generate-fonts.ts` (Bun-compatible)
   - Input: source file path
   - Output: `fonts/*.woff2`, `fonts/*.woff`, `fonts/*.ttf`
   - Error handling: missing dependencies, invalid source file, permission errors

3. **CI Integration Proposal** (YAML snippet or written instructions):
   - Where to add font generation step in `.github/workflows/5-publish.yml` or if a new workflow is needed
   - Dependency installation commands (e.g., `apt-get install fontforge`, `bun add -D @module/name`)
   - Caching strategy for dependencies if applicable
   - Artifacts to commit or publish (generated font files in `fonts/`)

4. **Dependency and Licensing Summary**:
   - List of tools/libraries required with versions
   - License compatibility check (MIT, Apache, GPL considerations)
   - Installation commands for Ubuntu (CI) and macOS (local)

5. **Example Output**:
   - Sample command: `bun run generate-fonts --source assets/OpenCodeLogo.otf --output fonts/`
   - Expected file list after generation:
     - `fonts/OpenCodeLogo.woff2`
     - `fonts/OpenCodeLogo.woff`
     - `fonts/OpenCodeLogo.ttf`

## Constraints & Limitations

- **No implementation code**: This task is investigative only; do not write full script implementations yet — provide outlines, pseudocode, and recommendations.
- **Cross-platform compatibility**: Solutions must work on both Linux (CI) and macOS (local development); Windows support is optional.
- **No proprietary tools**: Only use open-source, freely available tools (no Adobe Font Maker, Glyphs, etc.).
- **Performance**: Font generation should complete in under 2 minutes in CI; faster is better.
- **CI workflow safety**: Must not break existing validation, testing, or publishing steps; font generation failures should fail the build gracefully.
- **No external API calls**: Font generation must not depend on third-party web services (e.g., no cloud-based font conversion APIs).
- **Package size**: Generated fonts must be optimized; woff2 should be used as primary format for web; total font directory size should remain under 500KB if possible.

## Quality Standards & Acceptance Criteria

- **Completeness**: Investigation report covers at least three different toolchain options with pros/cons comparison.
- **Actionability**: Local script outline includes all key steps and error handling considerations; CI integration proposal can be implemented directly without further research.
- **Validation**: Report includes at least two methods to verify font correctness (e.g., `file` command output check, browser loading test, fonttools validation).
- **Clarity**: All commands, paths, and tool names are explicit and copy-paste ready.
- **Reproducibility**: Instructions enable any developer to generate fonts locally on first attempt following the documented steps.
- **CI-readiness**: CI integration proposal specifies exact workflow file, job name, and step position; includes rollback/failure handling.

## Style & Tone

- **Technical and concise**: Written for senior DevOps engineer or full-stack developer familiar with CI/CD pipelines and npm package publishing.
- **No fluff**: Avoid marketing language or unnecessary background; focus on technical specifications, commands, and implementation steps.
- **Structured**: Use headings, bullet points, code blocks, and tables for easy scanning.
- **Explicit examples**: Provide full command examples with actual file paths from this project (e.g., `fonts/`, `.github/workflows/5-publish.yml`).

## Clarifying Questions

1. **Source file format**: Do you already have a source font file (OTF, TTF, SVG)? If so, what format and where is it located? If not, should this investigation include recommendations for creating a font from the OpenCode logo design?

2. **Glyph coverage**: Should the font support only ASCII characters, or extended Latin, or full Unicode ranges? This affects tool selection and generation complexity.

3. **Font file versioning**: Should generated font files be committed to git, or generated dynamically in CI and only published in the npm package? Committing fonts simplifies local development but increases repository size.

## Example Output

**Investigation Report Excerpt** (Section 2):
```markdown
### Recommended Toolchain: fonttools + Bun Script

**Tool**: `fonttools` (Python library) + `bun` for scripting
**Reason**: Cross-platform, actively maintained, MIT license, supports TTF→WOFF/WOFF2 conversion, no GUI dependencies.

**Installation**:
- CI (Ubuntu): `sudo apt-get install python3-pip && pip3 install fonttools brotli`
- Local (macOS): `brew install python3 && pip3 install fonttools brotli`

**Conversion command**:
```bash
# Convert TTF to WOFF2
pyftsubset input.ttf --output-file=output.woff2 --flavor=woff2
# Convert TTF to WOFF
pyftsubset input.ttf --output-file=output.woff --flavor=woff
```
```

**Local Script Outline** (`scripts/generate-fonts.sh`):
```bash
#!/usr/bin/env bash
set -euo pipefail

SOURCE_FILE="${1:-assets/OpenCodeLogo.ttf}"
OUTPUT_DIR="fonts"

# Check dependencies
command -v pyftsubset >/dev/null 2>&1 || { echo "fonttools not installed"; exit 1; }

# Generate formats
pyftsubset "$SOURCE_FILE" --output-file="$OUTPUT_DIR/OpenCodeLogo.woff2" --flavor=woff2
pyftsubset "$SOURCE_FILE" --output-file="$OUTPUT_DIR/OpenCodeLogo.woff" --flavor=woff
cp "$SOURCE_FILE" "$OUTPUT_DIR/OpenCodeLogo.ttf"

echo "✅ Fonts generated in $OUTPUT_DIR/"
```

**CI Integration Snippet** (add to `.github/workflows/5-publish.yml` after "Install dependencies" step):
```yaml
- name: Generate font files
  run: |
    sudo apt-get update && sudo apt-get install -y python3-pip
    pip3 install fonttools brotli
    bash scripts/generate-fonts.sh assets/OpenCodeLogo.ttf
```

## Do Not Do

- Do not implement full scripts or CI workflows yet — this is research and planning only.
- Do not assume font source files exist without confirmation; ask if unclear.
- Do not recommend proprietary or closed-source font tools.
- Do not change project structure (e.g., moving `fonts/` directory) without explicit justification.

---

**Original Prompt**: investigate how to create the most popular font to include in a pipeline (we should also be able to create them locally through a script)
