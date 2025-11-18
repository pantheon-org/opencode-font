# OpenCode-style font npm package with text-to-SVG conversion

## Goal

Create an npm-distributable library that packages a font which reproduces the look-and-feel of the OpenCode logo across
common formats and exposes a function that converts arbitrary text into an SVG string using that font. The result must
be ready for consumption by other projects (installable, documented, and testable).

## Context

- The original brief: "this project goal is to distribute an npm library for a font that look and feel like the logo of
  OpenCode in different format for consumption by other projects (we aboslutely need a function to convert a text to
  SVG)". This must be preserved exactly.
- The library should provide the font files in common web formats (e.g., `woff2`, `woff`, `ttf`, optional `otf`, `svg`)
  and a programmatic API to convert text to SVG.
- Assumptions: you have a legal right to create/distribute the font; a source/logo vector (SVG or source design) is
  available; target runtime is Node.js and modern browsers; publishing to npm is optional and requires separate
  credentials.

## Inputs

- Source logo/vector file or design reference (SVG/AI/PDF) OR explicit design specs (glyph shapes, kerning).
- Preferred target font formats (pick defaults `woff2`, `woff`, `ttf`).
- Preferred implementation language: JavaScript (ESM) or TypeScript — indicate preference.
- Desired function signature requirements for the text→SVG converter (e.g., options for fontSize, weight, color,
  width/height).

## Deliverables

- A ready-to-publish package tree (example file list):
  - `package.json` (name, version, exports, build scripts)
  - `README.md` (usage, license, API examples)
  - `src/index.js` or `src/index.ts` (exports)
  - `src/convertTextToSVG.js` or `src/convertTextToSVG.ts` (exported function)
  - `fonts/*.woff2`, `fonts/*.woff`, `fonts/*.ttf`, optionally `fonts/*.otf`, `fonts/*.svg`
  - `dist/` (build output)
  - `test/convertTextToSVG.spec.js` (unit tests)
  - `LICENSE` (appropriate license)
- Format examples:
  - `convertTextToSVG(text, options) --> "<svg ...><text ...>...<\/text><\/svg>"`
  - `README.md` with an example usage snippet and a sample HTML embed of the generated SVG.

## Constraints & Limitations

- Language: default JavaScript (ESM); TypeScript optional if requested.
- No private or proprietary assets may be embedded unless explicit permission is provided.
- Do not publish to npm without explicit credentials/consent.
- Keep package size reasonable (font files optimized; `woff2` preferred for web).
- Accessibility: generated SVG must include `role` or `aria` attributes when requested.

## Quality Standards & Acceptance Criteria

- The package builds locally (`npm pack` produces a tarball) without external secrets.
- Fonts included in at least `woff2`, `woff`, and `ttf` formats.
- `convertTextToSVG` returns a well-formed SVG string containing a `<text>` element with the exact input string (test
  asserts substring equality).
- Unit tests (e.g., Jest or Mocha) cover: ASCII, non-ASCII, empty string, long strings, and options variations — tests
  pass.
- README contains installation, API, examples, and licensing info.
- Basic linting and readable code (clear function signatures, JSDoc or TypeDoc comments).

## Style & Tone

- Concise technical, for a senior engineer implementing a production-ready npm library; include actionable
  implementation details but no implementation code in this prompt.

## Clarifying Questions

1. Do you have an original vector/logo file (SVG or source) we must match exactly, or should the font be a new design
   "in the style of" OpenCode?
2. Which formats do you require as minimum: `woff2`, `woff`, `ttf`, `otf`, `svg`?
3. Do you prefer JavaScript (ESM) or TypeScript for the library source?

## Example Output

- `convertTextToSVG("OpenCode", { fontSize: 48, color: "#111" })` → returns
  `"<svg ...><text font-family='OpenCodeLogo' font-size='48' fill='#111'>OpenCode</text></svg>"`
- `README.md` snippet:
  - "Install: `npm install @your-org/opencode-font`" and a short usage example showing import and function call.

## Do not do

- Do not change scope beyond distributing the font and supplying the text→SVG function.
- Do not assume private design assets or publish to npm without consent.
- Do not invent licensing or copyright ownership.

Original Prompt: this project goal is to distribute an npm library for a font that look and feel like the logo of
OpenCode in different format for consumption by other projects (we aboslutely need a function to convert a text to SVG)
