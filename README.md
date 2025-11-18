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

## License

MIT
