# Contributing

Thanks for your interest in improving `tiptap-extension-ruby`.

## Dev setup

Prerequisites: Node 20+ and pnpm 10.

```bash
pnpm install
pnpm build
pnpm test
```

## Project layout

```
src/                Extension source (ruby node, commands, rules, utils)
tests/              Vitest unit tests + happy-dom helpers + HTML fixtures
stories/            Storybook stories (HTML framework)
visual-tests/       Playwright visual regression spec
.storybook/         Storybook config
examples/           Local verification sandboxes, including React + Vite
```

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/). Common types:

- `feat:` — user-facing feature
- `fix:` — bug fix
- `test:` — tests only
- `docs:` — docs only
- `chore:` — tooling / meta
- `ci:` — CI workflow changes

Breaking changes: `feat!:` with a `BREAKING CHANGE:` footer.

## Releases

Versioning and publishing are fully automated from Conventional Commits via [semantic-release](https://semantic-release.gitbook.io/). You don't hand-author anything per PR — just write a correctly typed commit message and merge.

Two channels:

- `main` → GitHub Packages stable publish + GitHub Release
- `develop` → GitHub Packages `beta` publish + GitHub pre-release
- `codex/phase1-gpr-beta` → GitHub Packages `beta` publish + GitHub pre-release

Workflow:

1. Open your PR into `develop`. PR CI (`ci.yml`) runs lint / typecheck / unit / build / visual.
2. On merge to `develop` or push to `codex/phase1-gpr-beta`, the `Release` workflow runs CI again then `semantic-release`, which (if there are release-worthy commits) cuts a `vX.Y.Z-beta.N` tag, publishes `@novel-tree/tiptap-extension-ruby@X.Y.Z-beta.N` to GitHub Packages under the `beta` dist-tag, and creates a GitHub pre-release. It also commits the bumped `package.json` and updated `CHANGELOG.md` back to the release branch with `[skip ci]`.
3. When you're ready to promote, open a `develop → main` PR. Merging it produces a stable `vX.Y.Z` tag, GitHub Packages stable publish, and a regular GitHub Release.

Bump rules:

- `feat:` → minor (`1.0.0` → `1.1.0`)
- `fix:` → patch (`1.0.0` → `1.0.1`)
- `feat!:` / `BREAKING CHANGE:` → major (`1.0.0` → `2.0.0`)
- `chore:`, `ci:`, `docs:`, `test:`, `refactor:` → no release

Authentication: GitHub Packages publishing uses the workflow `GITHUB_TOKEN` via `NODE_AUTH_TOKEN`. Consumers need access to the repository and an `.npmrc` entry for the `@novel-tree` scope.

Branch protection caveat: semantic-release pushes a back-commit to `main`/`develop` using `GITHUB_TOKEN`. If branch protection later requires PR review or signed commits on these branches, swap to a GitHub App token via `actions/create-github-app-token`.

## Running tests

```bash
pnpm lint            # ESLint + Prettier check
pnpm typecheck       # tsc --noEmit
pnpm test            # Vitest unit suite
pnpm test:coverage   # Unit suite + v8 coverage report
pnpm storybook       # Storybook dev server at http://localhost:6006
pnpm storybook:build # Static Storybook bundle (required for visual tests)
pnpm test:visual     # Playwright visual regression against committed baselines
pnpm example:react   # React + Vite sandbox for selection-first ruby authoring
```

Running `pnpm test:visual` locally will launch Storybook via the `webServer` option in `playwright.config.ts`.

## Visual regression workflow

Screenshots are the source of truth for ruby rendering correctness. A few notes:

- The committed baselines under `visual-tests/__screenshots__/linux/` are **produced by CI**, not by local dev machines. Font antialiasing and subpixel rendering differ enough across macOS / Windows / Linux that cross-platform parity isn't realistic.
- Your local `pnpm test:visual` run writes `darwin/` or `win32/` baselines (gitignored) so you can develop against your own platform. Diffs against those stay on your machine.
- **To refresh the committed Linux baselines** after an intentional visual change, push your branch and trigger the [`Update visual snapshots`](./.github/workflows/update-snapshots.yml) workflow manually from the Actions tab, selecting your branch. The workflow regenerates and commits the new baselines.

## Pull requests

- One logical change per PR. Unit tests and the code they test ship together.
- Fill out the PR template; flag whether your change needs updated screenshots.

## Reporting bugs / requesting features

Use the [issue templates](./.github/ISSUE_TEMPLATE). For security-sensitive reports, see [SECURITY.md](./SECURITY.md).
