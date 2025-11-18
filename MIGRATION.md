# Migration: Convert project to Bun + TypeScript

Summary
- Converted source files from JavaScript to TypeScript and configured Bun-native testing.

Files changed (before -> after)
- `src/convertTextToSVG.js` -> `src/convertTextToSVG.ts`
- `src/index.js` -> `src/index.ts`
- `test/convertTextToSVG.spec.js` -> `test/convertTextToSVG.spec.ts`
- `package.json` updated: test script now uses `bun test`, added `dev`, `start`, `build`, `typecheck` scripts
- Added `tsconfig.json`

Commands (run in project root)
- Install dependencies (if needed): `bun install` or `npm install`
- Run type-check only: `bun x tsc --noEmit` or `npm run typecheck`
- Run tests (Bun native): `bun test` or `npm test`
- Build emit JS declarations: `npm run build` (runs `tsc -p tsconfig.json`)
- Development run (Bun dev): `bun dev` or `npm run dev`

Notes & follow-ups
- Module format: converted to ESM (`"type": "module"`) to match Bun and ESNext output.
- I left original `.js` files in place; you may delete them to keep the repo TypeScript-only.
- `tsc` is used for declaration generation and stricter `--noEmit` checks; Bun executes TypeScript directly for dev/test.

Manual steps
- If publishing to npm, ensure `dist/` is built and `types` points to the generated `.d.ts` files.
- Replace placeholder fonts in `fonts/` with real font binaries if packaging fonts with the module.

