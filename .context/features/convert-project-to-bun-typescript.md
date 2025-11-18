# Convert project to Bun + TypeScript

## Title

Convert project to Bun + TypeScript

## Goal

Convert the existing project to use Bun as the runtime/tooling and migrate source code to TypeScript so the repository builds and runs under Bun with typed sources and an appropriate TypeScript configuration. The deliverable must allow a developer to run, build, and test the project using Bun commands.

## Context

- Original Prompt: convert this project to bun/typescript
- The current repository is a JavaScript project (CommonJS or ESM) without TypeScript sources or Bun-specific configuration.
- Assumptions: no external private credentials are required and network access may be restricted; produce changes that work locally and document any manual steps.

## Inputs

- Access to the repository source tree and `package.json`.
- Information about preferred module format (ESM vs CommonJS) — if unspecified, default to ESM.
- Optional: confirmation about test runner preference (Bun-native `bun test` vs existing test runner).

## Deliverables

- `tsconfig.json` configured for Bun-friendly TypeScript (e.g., `"module": "ESNext"`, `"target": "ES2022"`).
- Updated `package.json` with Bun scripts: example entries `"dev": "bun dev"`, `"build": "bun build"`, and `"start": "bun run"` as applicable.
- `MIGRATION.md` describing all changed files, the rationale, and any manual follow-ups.
- A sample converted source file `src/index.ts` or a list of converted files with before/after mapping (e.g., `src/index.js -> src/index.ts`).
- Instructions to run and test: exact commands to start, build, and run tests with Bun.

Format examples:

- `MIGRATION.md` bullet: `src/index.js -> src/index.ts` and `package.json` scripts snippet.

## Constraints & Limitations

- Do not modify external services or publish packages.
- Preserve public API surface; do not rename exported functions or change semantics.
- Prefer ESM conversion by default; if conversion is not possible, document reasons and alternatives.
- Do not add unrelated features (CI/workflows) beyond migration scope.

## Quality Standards & Acceptance Criteria

- TypeScript compiles cleanly: `tsc --noEmit` (or Bun-compatible check) reports zero type errors for migrated files.
- Bun runs the project: `bun run dev` or configured `bun` script starts without module errors.
- Existing tests (if present) run and pass under Bun or documented alternative.
- `MIGRATION.md` lists changed files and manual follow-ups.

## Style & Tone

Concise, technical instructions intended for a senior engineer. Provide step-by-step actionable items.

## Clarifying Questions

1. Should the project convert to ESM (`"type": "module"`) or remain CommonJS with TypeScript wrappers?
2. Do you want Bun-native testing (`bun test`) or to keep the current test runner (e.g., Jest)?
3. Any constraints on TypeScript compiler strictness or specific target runtime (ES2020/ES2022)?

## Example Output

- `MIGRATION.md` snippet:
  - `src/index.js -> src/index.ts`
  - `package.json` scripts: `"dev": "bun dev", "build": "bun build"`
- `tsconfig.json` sample fields:
  - `"compilerOptions": { "target": "ES2022", "module": "ESNext", "strict": true }`

## Do not do

- Do not change public APIs without approval.
- Do not publish the package or alter remote registries.
- Do not introduce unrelated feature work beyond migration.
