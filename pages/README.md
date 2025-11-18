# OpenCode Font Documentation Site

This directory contains the Astro-based documentation site for the OpenCode Font project.

## Overview

The documentation site is built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/), providing:

- **Landing Page**: Feature showcase with API examples
- **Interactive Demo**: Live editors for both `blockyTextToSVG()` and `convertTextToSVG()` APIs
- **Glyph Showcase**: Visual display of all 32 glyphs in both light and dark themes
- **Automated Deployment**: GitHub Actions workflow deploys to GitHub Pages

## Directory Structure

```
pages/
├── src/
│   ├── content/
│   │   └── docs/          # Documentation content (MDX files)
│   │       ├── index.mdx  # Landing page
│   │       ├── demo.mdx   # Interactive demo
│   │       └── glyphs.mdx # Glyph showcase
│   ├── components/        # Astro components
│   │   ├── Header.astro
│   │   └── ASCIISiteTitle.astro
│   ├── assets/            # Static assets (logos, images)
│   ├── styles/            # Custom CSS
│   │   └── custom.css     # OpenCode theme styles
│   └── utils/             # Utility functions
│       └── alphabet.ts    # Re-exports library functions
├── public/
│   └── fonts/             # Font files (copied during build)
├── astro.config.mjs       # Astro configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── transform-docs.js      # Script to transform README to docs

```

## Development

### Prerequisites

- **Bun** (latest version recommended)
- **Node.js** 18+ (for compatibility)

### Local Development

```bash
# Install dependencies
cd pages
bun install

# Start development server
bun run dev

# The site will be available at http://localhost:4321/opencode-font/
```

### Build for Production

```bash
# Build the site
bun run build

# Preview the production build
bun run preview
```

## Build Process

The build process follows these steps:

1. **Copy Fonts**: Fonts from `../fonts/` are copied to `public/fonts/`
2. **Transform Docs**: Root `README.md` is transformed to `src/content/docs/index.md`
3. **Build Site**: Astro builds the static site to `dist/`

## Scripts

- **`bun run copy-fonts`**: Copy font files to public directory
- **`bun run transform`**: Transform README to Astro content
- **`bun run dev`**: Start development server with hot reload
- **`bun run build`**: Build production site
- **`bun run preview`**: Preview production build locally

## Configuration

### Astro Config (`astro.config.mjs`)

Key settings:

- **Site**: `https://pantheon-org.github.io`
- **Base**: `/opencode-font/` (GitHub Pages subdirectory)
- **Integration**: Starlight (documentation theme)

### Starlight Sidebar

The sidebar is configured in `astro.config.mjs` with three main pages:

- Home (landing page)
- Interactive Demo
- Glyph Showcase

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to `main` branch.

### Workflow Triggers

- Push to `main` (paths: `pages/**`, `src/alphabet/**`, `fonts/**`, `README.md`)
- Release published
- Manual workflow dispatch

### Deployment URL

https://pantheon-org.github.io/opencode-font/

## Custom Styling

The site uses custom CSS (`src/styles/custom.css`) that replicates the OpenCode documentation theme:

- **Typography**: IBM Plex Mono font family
- **Colors**: Exact HSL values from OpenCode.ai
- **Components**: Custom styling for headers, sidebars, code blocks, and more

## Components

### Header.astro

Custom header component that includes:

- ASCIISiteTitle (logo using blocky text)
- Search functionality
- Social icons
- Theme selector

### ASCIISiteTitle.astro

Generates the "OPENCODE" logo using `blockyTextToSVG()` from the library.

## Content

All content pages are in `src/content/docs/` as MDX files, allowing:

- Markdown formatting
- JSX components
- Interactive JavaScript/TypeScript
- Custom styling

## Dependencies

Key dependencies:

- **Astro** (^5.15.0): Static site generator
- **@astrojs/starlight** (^0.36.0): Documentation theme
- **rehype-mermaid** (^3.0.0): Mermaid diagram support
- **sharp** (^0.34.5): Image optimization

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Delete `node_modules` and `bun.lock`
2. Run `bun install --frozen-lockfile`
3. Try building again

### Font Loading Issues

If fonts don't appear:

1. Ensure fonts are generated: `bun run generate:fonts` (from root)
2. Verify fonts are copied: `bun run copy-fonts`
3. Check `public/fonts/` directory contains `.woff`, `.woff2`, and `.ttf` files

### TypeScript Errors

If TypeScript errors occur in Astro files:

1. Run `bunx astro check` to validate
2. Ensure `@astrojs/check` is installed
3. Check `tsconfig.json` extends `astro/tsconfigs/strict`

## Contributing

When making changes to the documentation:

1. Edit MDX files in `src/content/docs/`
2. Update components in `src/components/` if needed
3. Test locally with `bun run dev`
4. Commit changes - the site will auto-deploy via GitHub Actions

## License

MIT - See the root LICENSE file for details.
