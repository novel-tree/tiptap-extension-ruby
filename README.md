# tiptap-extension-ruby

[![CI](https://github.com/novel-tree/tiptap-extension-ruby/actions/workflows/ci.yml/badge.svg)](https://github.com/novel-tree/tiptap-extension-ruby/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/tiptap-extension-ruby.svg)](./LICENSE)

A TipTap v3 extension that renders HTML `<ruby>` annotations (furigana / 振り仮名) for CJK text.

> 日本語版は [README.ja.md](./README.ja.md) を参照してください。

## Phase 1 scope

This branch is the Phase 1 public beta for GitHub Packages.

- Supported: rendering existing `<ruby>` HTML, preserving ruby nodes in TipTap documents, converting Aozora-Bunko-style shorthand on input/paste, and inserting ruby nodes through commands.
- Not yet supported: rich in-place ruby editing UI, multi-segment ruby authoring, or lossless round-tripping of complex ruby structures with multiple `<rt>` nodes.

## Install

```bash
echo "@novel-tree:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
pnpm add @novel-tree/tiptap-extension-ruby@beta
# or: npm install @novel-tree/tiptap-extension-ruby@beta
# or: yarn add @novel-tree/tiptap-extension-ruby@beta
```

Peer dependencies: `@tiptap/core` and `@tiptap/pm` — both `^3.0.0`.

## Quick start

```ts
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Ruby } from '@novel-tree/tiptap-extension-ruby';
import '@novel-tree/tiptap-extension-ruby/style.css'; // opt-in default styling

const editor = new Editor({
  element: document.querySelector('#editor')!,
  extensions: [Document, Paragraph, Text, Ruby],
  content: '<p><ruby>漢字<rt>かんじ</rt></ruby></p>',
});

editor.commands.setRuby({ rb: '先生', rt: 'せんせい' });
```

## Options

Configure via `Ruby.configure({...})`.

| Option             | Type                      | Default | Description                                                                  |
| ------------------ | ------------------------- | ------- | ---------------------------------------------------------------------------- |
| `HTMLAttributes`   | `Record<string, unknown>` | `{}`    | Attributes merged onto the rendered `<ruby>` element.                        |
| `enableInputRule`  | `boolean`                 | `true`  | Legacy switch for shorthand input rules. Prefer `shorthand.enabled`.         |
| `shorthand`        | `RubyShorthandOptions`    | Aozora  | Locale-friendly shorthand rules for input/paste conversion.                  |
| `renderRpFallback` | `boolean`                 | `true`  | Emit `<rp>(</rp>` / `<rp>)</rp>` around `<rt>` for plain-text readers.       |

## Commands

| Command                                   | Signature                                  | Behavior                                                         |
| ----------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| `setRuby({ rb, rt })`                     | `(payload: SetRubyPayload) => boolean`     | Insert a ruby node at the current selection.                     |
| `toggleRuby({ rb, rt })`                  | `(payload: SetRubyPayload) => boolean`     | Wrap the selected text in a ruby, or unwrap an existing one.     |
| `unsetRuby()`                             | `() => boolean`                            | Remove the ruby at the cursor, preserving the base text.         |

All commands return `true` when they mutate the document, `false` otherwise.

## Input rule syntax

Inspired by [Aozora Bunko](https://www.aozora.gr.jp/) notation:

```
|漢字《かんじ》
```

The leading `|` disambiguates the base text when it contains mixed kanji/kana. The same shorthand is recognized on paste — multiple tokens in one paste are converted in a single transaction.

You can override the shorthand delimiters per locale:

```ts
Ruby.configure({
  shorthand: {
    enabled: true,
    rules: [
      { trigger: '|', open: '《', close: '》' },
      { trigger: '|', open: '[', close: ']' },
      { trigger: '~', open: '{', close: '}' },
    ],
  },
});
```

This keeps Aozora-style input available for Japanese users while giving Chinese and Korean products easier ASCII-friendly shortcuts.

## Local example app

A small React + Vite sandbox lives in [examples/react-vite](/Users/michaelwilkins/Documents/GitHub/tiptap-extension-ruby/examples/react-vite/package.json:1). It demonstrates:

- selection-first ruby authoring through a modal
- locale presets for Japanese, Chinese, and Korean
- customizable shorthand rules as a secondary workflow

Run it locally with:

```bash
cd examples/react-vite
pnpm install
pnpm dev
```

## Styling

The package ships opt-in default styles that hide the `<rp>` fallback parens in modern browsers:

```ts
import '@novel-tree/tiptap-extension-ruby/style.css';
```

If you have your own design system, skip the import and style `ruby` / `rt` / `rp` directly.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). The `<rp>` fallback keeps the reading readable as `漢字(かんじ)` in legacy / plain-text contexts. Internet Explorer is not supported.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for dev setup, testing, and the visual-regression workflow.

## License

[MIT](./LICENSE) © Michael Kenji Wilkins
