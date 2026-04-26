# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is pnpm 10 (Node 20+).

```bash
pnpm install
pnpm build            # tsup → dist/ (ESM + CJS + d.ts + style.css)
pnpm dev              # tsup --watch
pnpm typecheck        # tsc --noEmit against tsconfig.json
pnpm lint             # eslint . --max-warnings=0
pnpm format           # prettier --write .
pnpm test             # vitest run (tests/unit/**/*.test.ts)
pnpm test:coverage    # vitest run --coverage (enforces 85/85/80/85)
pnpm test:watch       # vitest watch
pnpm storybook        # dev server on :6006 (required for visual tests locally)
pnpm storybook:build  # static bundle (CI feeds this to Playwright)
pnpm test:visual      # playwright test (spawns Storybook locally via webServer)
pnpm test:visual:update  # regenerate local snapshots
```

Run a single unit test: `pnpm test tests/unit/commands.test.ts` — or narrow with `-t "pattern"` to match a describe/it name.

## Architecture

This is a single-package TipTap v3 extension published as `tiptap-extension-ruby`. `@tiptap/core` and `@tiptap/pm` are peer deps (never bundled).

**Entry point: `src/index.ts`** re-exports only `Ruby`, `RubyOptions`, `RubyAttributes`, and `SetRubyPayload`. Nothing else is part of the public API.

**Node definition (`src/ruby.ts`)** creates an inline **atom** node named `ruby` with two attributes (`rb`, `rt`). The atom shape is deliberate — the base text isn't editable as children; it lives in `attrs.rb` and the node is replaced wholesale. Attributes use `renderHTML: () => ({})` so `rb`/`rt` do not leak onto the `<ruby>` tag as DOM attrs; they're rendered as child text nodes inside `renderHTML`.

**Four pieces plug into the node:**

1. `src/commands.ts` — `setRuby`, `toggleRuby`, `unsetRuby`. `toggleRuby` branches on selection state: on a ruby atom → unset; empty selection → set from payload; text selection → use selected text as `rb` when payload `rb` is empty. All readings flow through `sanitizeReading` (strip control chars, collapse whitespace).
2. `src/input-rules.ts` — Aozora-Bunko `|漢字《かんじ》` shorthand via `nodeInputRule`. Gated by `options.enableInputRule`.
3. `src/paste-rules.ts` — same regex as a global match so one paste can convert many tokens in a single transaction.
4. `src/utils/parse-ruby-html.ts` — tolerant HTML parser for `parseHTML`. Strips `<rt>`/`<rp>` to recover `rb` text, joins multiple `<rt>` nodes into a single reading (atom form flattens the structure).

**Styling** ships as an opt-in side-effect import: `tiptap-extension-ruby/style.css`. `tsup.config.ts` has a manual `cp src/style.css dist/style.css` step via `onSuccess` — tsup itself is kept CSS-agnostic. `package.json` marks `*.css` as the only sideEffect.

**Testing layers:**

- **Unit (`tests/unit/`, vitest + happy-dom)** — all tests build a real `Editor` via `tests/helpers/create-editor.ts` (which wires up Document/Paragraph/Text + Ruby and appends to `document.body`). Call `destroyEditor` in teardown. Coverage is enforced; `src/index.ts` and `src/types.ts` are excluded.
- **Visual regression (`visual-tests/`, Playwright + Storybook)** — stories under `stories/` are the rendering fixtures. Baselines are **platform-scoped**: `visual-tests/__screenshots__/linux/` is checked in (CI-produced); `darwin/` and `win32/` are gitignored. To refresh committed baselines after an intentional visual change, trigger the **Update visual snapshots** workflow on your branch — do not commit local darwin/win32 baselines.

**Build target** is ES2022, dual ESM+CJS with declaration maps. Peer deps are externalized.

## Workflow conventions

- **Conventional Commits** are required (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `ci:`; `feat!:` for breaking). The release flow reads commit messages directly — there is no changeset file.
- **Two-branch release model** driven by `semantic-release` (`.releaserc.json`, `.github/workflows/release.yml`):
  - Merge to `develop` → npm `beta` + GitHub pre-release (`vX.Y.Z-beta.N`)
  - Merge to `main` → npm `latest` + stable GitHub Release (`vX.Y.Z`)
  - No release PR in the middle. Publishing happens on push; semantic-release back-commits the new `package.json` + `CHANGELOG.md` with `[skip ci]`.
- One logical change per PR; tests ship with the code they cover.
