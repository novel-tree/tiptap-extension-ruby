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
examples/           Runnable vanilla + React usage examples
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

Versioning is fully automated from Conventional Commits via [release-please](https://github.com/googleapis/release-please). You don't need to hand-author anything per PR — just write a correctly typed commit message.

How it works:

1. On merge to `main`, the `Release` workflow runs release-please, which opens (or updates) a PR titled `chore(main): release X.Y.Z`. That PR bumps `package.json` and regenerates `CHANGELOG.md` from the commits since the last release.
2. Merging the release PR creates the `vX.Y.Z` git tag and a GitHub Release whose body is the changelog entry. The workflow then publishes the package to npm (`tiptap-extension-ruby@X.Y.Z`, with provenance) and attaches the `tiptap-extension-ruby-X.Y.Z.tgz` tarball as a release asset.

Required secret: `NPM_TOKEN` (npm automation token with publish access). Provenance is generated via the workflow's OIDC token — no extra config needed beyond the `id-token: write` permission already on the workflow.

Bump rules (standard semver post-1.0):

- `feat:` → minor (`1.0.0` → `1.1.0`)
- `fix:` → patch (`1.0.0` → `1.0.1`)
- `feat!:` / `BREAKING CHANGE:` → major (`1.0.0` → `2.0.0`)

## Running tests

```bash
pnpm lint            # ESLint + Prettier check
pnpm typecheck       # tsc --noEmit
pnpm test            # Vitest unit suite
pnpm test:coverage   # Unit suite + v8 coverage report
pnpm storybook       # Storybook dev server at http://localhost:6006
pnpm storybook:build # Static Storybook bundle (required for visual tests)
pnpm test:visual     # Playwright visual regression against committed baselines
```

Running `pnpm test:visual` locally will launch Storybook via the `webServer` option in `playwright.config.ts`.

## Visual regression workflow

Screenshots are the source of truth for ruby rendering correctness. A few notes:

- The committed baselines under `visual-tests/__screenshots__/linux/` are **produced by CI**, not by local dev machines. Font antialiasing and subpixel rendering differ enough across macOS / Windows / Linux that cross-platform parity isn't realistic.
- Your local `pnpm test:visual` run writes `darwin/` or `win32/` baselines (gitignored) so you can develop against your own platform. Diffs against those stay on your machine.
- **To refresh the committed Linux baselines** after an intentional visual change, push your branch and trigger the [`Update visual snapshots`](./.github/workflows/update-snapshots.yml) workflow manually from the Actions tab, selecting your branch. The workflow regenerates and commits the new baselines.

## Pull requests

- One logical change per PR. Unit tests and the code they test ship together.
- Include a changeset (`pnpm changeset`) if you touch `src/`.
- Fill out the PR template; flag whether your change needs updated screenshots.

## Reporting bugs / requesting features

Use the [issue templates](./.github/ISSUE_TEMPLATE). For security-sensitive reports, see [SECURITY.md](./SECURITY.md).
