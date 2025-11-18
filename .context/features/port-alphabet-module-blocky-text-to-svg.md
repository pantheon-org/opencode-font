# Port Alphabet Module for Blocky Text to SVG Conversion

## Goal

Migrate the complete alphabet module from `../opencode-warcraft-notifications/pages/src/utils/alphabet` to the `opencode-font` project to enable blocky pixel-art text rendering before final SVG conversion, replacing the current simple text-based SVG generation.

## Context

- The `opencode-font` project currently uses a simple font-based approach (`convertTextToSVG.ts`) that generates SVG with a `<text>` element referencing the OpenCodeLogo font family.
- The source `alphabet` module from `opencode-warcraft-notifications` provides a sophisticated blocky text rendering system with 26 uppercase letters (A-Z) and 6 symbols (-, |, ', ", ?, !) using a 7-row grid-based glyph system.
- The alphabet module includes variable-width characters (1-5 columns), automatic PRIMARY/SECONDARY color assignment based on row position, theme support (light/dark), SVG path optimization, and comprehensive type definitions.
- The current project structure includes `src/`, `scripts/`, `css/`, `fonts/`, and `.context/features/` directories.
- The project uses TypeScript, Bun as the runtime/package manager, and has existing CI/CD pipelines configured in `.github/workflows/`.

**Assumptions:**

- The ported module should maintain full compatibility with the existing type system and glyph definitions from the source.
- The new blocky text functionality should complement (not replace) the existing `convertTextToSVG` function, providing users with both options.
- Tests should be migrated and updated to work with the new project structure.

## Inputs

1. **Source Module Location**: `../opencode-warcraft-notifications/pages/src/utils/alphabet/` containing:
   - Core files: `index.ts`, `block.ts`, `types.ts`, `theme.ts`, `svg-optimizer.ts`
   - Test files: `block.test.ts`, `types.test.ts`, `theme.test.ts`, `letters.test.ts`
   - Glyph definitions: `glyphs/letters/` (26 letter files) and `glyphs/symbols/` (6 symbol files)
   - Documentation: `README.md`, `USAGE.md`, `LETTERS.md`

2. **Target Project**: `opencode-font` repository at `/Users/thomas.roche/Projects/github/pantheon-org/opencode-font`

3. **Existing Files to Preserve**:
   - `src/convertTextToSVG.ts` - current simple SVG generation (keep as-is)
   - `src/index.ts` - public API exports (update to include new functions)
   - Project configuration files: `package.json`, `tsconfig.json`, `eslint.config.cjs`

## Deliverables

1. **Directory Structure**:

   ```
   src/
   ├── alphabet/
   │   ├── glyphs/
   │   │   ├── letters/
   │   │   │   ├── letter-a.ts through letter-z.ts (26 files)
   │   │   │   └── index.ts
   │   │   ├── symbols/
   │   │   │   ├── symbol-*.ts (6 files)
   │   │   │   └── index.ts
   │   │   └── index.ts
   │   ├── block.ts
   │   ├── types.ts
   │   ├── theme.ts
   │   ├── svg-optimizer.ts
   │   └── index.ts
   ```

2. **Test Files** (migrated and updated):

   ```
   src/alphabet/
   ├── block.spec.ts
   ├── types.spec.ts
   ├── theme.spec.ts
   └── letters.spec.ts
   ```

3. **Updated Public API** (`src/index.ts`):
   - Export `blockyTextToSVG` alongside existing `convertTextToSVG`
   - Export core types: `Glyph`, `Block`, `BlockyTextOptions`, `LetterName`, `SymbolName`
   - Export utility functions: `textToBlocks`, `getAvailableCharacters`, `getAllAvailableCharacters`

4. **Documentation Updates**:
   - Create `src/alphabet/README.md` with usage examples and API reference
   - Update root `README.md` to document both rendering approaches
   - Add migration guide comparing old vs. new approach

5. **Type Definitions**:
   - All TypeScript types properly exported and documented
   - No type conflicts with existing `convertTextToSVG` types
   - Ensure `Glyph`, `CellType`, `Theme`, `Block` types are accessible to consumers

6. **Example Usage** (to be included in README):

   ```typescript
   // Simple blocky text
   import { blockyTextToSVG } from '@pantheon-org/opencode-font';
   const svg = blockyTextToSVG('HELLO', { theme: 'dark', blockSize: 6 });

   // Get block data for custom rendering
   import { textToBlocks } from '@pantheon-org/opencode-font';
   const blocks = textToBlocks('WORLD', { theme: 'light', blockSize: 20 });
   ```

## Constraints & Limitations

- **Language**: TypeScript with strict type checking enabled
- **Runtime**: Must work with Bun runtime (compatibility already established in source)
- **No Breaking Changes**: Existing `convertTextToSVG` API must remain unchanged and fully functional
- **File Size**: Keep glyph definitions in separate files to maintain modularity (do not consolidate into single file)
- **Dependencies**: Do not introduce new external dependencies; use only what's already in `package.json`
- **Import Paths**: Use relative imports within the alphabet module; barrel exports at module boundaries
- **Naming Convention**: Follow existing project conventions (kebab-case for files, PascalCase for types, camelCase for functions)
- **Git History**: Preserve authorship information where possible using `git log` to document original authors in file headers
- **Security**: No changes to font files in `fonts/` directory; purely TypeScript/SVG code migration

## Quality Standards & Acceptance Criteria

1. **Type Safety**:
   - [ ] All TypeScript files compile without errors (`bun run typecheck`)
   - [ ] No `any` types used except where explicitly documented as necessary
   - [ ] All exported types have TSDoc comments

2. **Testing**:
   - [ ] All migrated tests pass (`bun test`)
   - [ ] Test coverage maintained or improved (minimum 80% for new code)
   - [ ] Edge cases handled: empty strings, unsupported characters, null/undefined inputs

3. **Functionality**:
   - [ ] `blockyTextToSVG('OPENCODE')` produces valid SVG matching visual reference from source project
   - [ ] All 26 letters (A-Z) render correctly in both light and dark themes
   - [ ] All 6 symbols render correctly
   - [ ] Variable-width characters render with proper spacing
   - [ ] SVG optimization reduces file size by at least 30% compared to unoptimized output

4. **Code Quality**:
   - [ ] ESLint passes with no errors (`bun run lint`)
   - [ ] Prettier formatting applied (`bun run format`)
   - [ ] No console.warn or console.error in production code paths (use proper error handling)
   - [ ] File imports use barrel exports (`from './alphabet'` not `from './alphabet/block'`)

5. **Documentation**:
   - [ ] README includes comparison table of `convertTextToSVG` vs `blockyTextToSVG`
   - [ ] All exported functions have usage examples in TSDoc
   - [ ] Migration guide explains when to use each approach
   - [ ] Visual examples included or linked (SVG samples in demo/ directory)

6. **Performance**:
   - [ ] `blockyTextToSVG` completes in <100ms for 20-character strings (benchmark)
   - [ ] No memory leaks in repeated calls (test with 1000 iterations)

## Style & Tone

- **Documentation**: Technical, precise, developer-focused with clear code examples
- **Code Comments**: Minimal inline comments; prefer self-documenting code and comprehensive TSDoc headers
- **Error Messages**: Descriptive and actionable (e.g., "Character 'é' not supported. Supported characters: A-Z, -, |, ', \", ?, !")
- **Commit Messages**: Follow existing project convention from `.github/scripts/analyze-commits.sh`
- **Audience**: TypeScript developers familiar with SVG and pixel-art concepts

## Clarifying Questions

If any of the following are unclear, please seek clarification:

1. **Namespace/Export Strategy**: Should the alphabet module be exported as a flat API (`import { blockyTextToSVG }`) or namespaced (`import { alphabet }`)? (Recommend flat for consistency with `convertTextToSVG`)

2. **Theme Defaults**: Should the default theme match the existing font (likely dark on light background) or use the source project's default? (Recommend consistent with existing CSS in `css/opencode-font.css`)

3. **Deprecation Path**: Is the long-term plan to deprecate the simple `convertTextToSVG` in favor of `blockyTextToSVG`, or should both coexist indefinitely? (Affects documentation emphasis)

## Example Output

**File**: `src/index.ts` (partial)

```typescript
// Existing export
export { convertTextToSVG } from './convertTextToSVG';

// New exports from alphabet module
export { blockyTextToSVG, textToBlocks } from './alphabet';
export type { Block, BlockyTextOptions, Glyph, LetterName, SymbolName } from './alphabet';
```

**File**: `src/alphabet/index.ts` (partial)

```typescript
export { textToBlocks, blockyTextToSVG } from './block';
export type { Block, BlockyTextOptions } from './block';
export { ALPHABET, SYMBOLS, getAvailableCharacters } from './types';
export type { Glyph, LetterName, SymbolName } from './types';
```

**Usage Example**:

```typescript
import { blockyTextToSVG } from '@pantheon-org/opencode-font';

const svg = blockyTextToSVG('HELLO-WORLD!', {
  theme: 'dark',
  blockSize: 6,
  charSpacing: 1,
  optimize: true,
});
// Produces: <svg width="..." height="42" ...><path d="..." fill="#FFFFFF"/>...</svg>
```

## "Do Not Do" List

1. **Do not modify existing `convertTextToSVG` functionality** - this must remain backward compatible with zero changes to behavior or API.

2. **Do not flatten glyph files into a single monolithic file** - maintain the modular structure with individual `letter-*.ts` and `symbol-*.ts` files for maintainability.

3. **Do not introduce visual regressions** - the ported glyphs must render identically to the source project. Compare generated SVGs pixel-by-pixel if necessary to validate correctness.
