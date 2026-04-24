# tiptap-extension-ruby

[![npm version](https://img.shields.io/npm/v/tiptap-extension-ruby.svg)](https://www.npmjs.com/package/tiptap-extension-ruby)
[![CI](https://github.com/novel-tree/tiptap-extension-ruby/actions/workflows/ci.yml/badge.svg)](https://github.com/novel-tree/tiptap-extension-ruby/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/tiptap-extension-ruby.svg)](./LICENSE)

A TipTap v3 extension that renders HTML `<ruby>` annotations (furigana / 振り仮名) for CJK text.

> 日本語版は [README.ja.md](./README.ja.md) を参照してください。

## Install

```bash
pnpm add tiptap-extension-ruby
# or: npm install tiptap-extension-ruby
# or: yarn add tiptap-extension-ruby
```

Peer dependencies: `@tiptap/core` and `@tiptap/pm` — both `^3.0.0`.

## Quick start

```ts
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Ruby } from 'tiptap-extension-ruby';
import 'tiptap-extension-ruby/style.css'; // opt-in default styling

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
| `enableInputRule`  | `boolean`                 | `true`  | Enable the `\|漢字《かんじ》` input rule.                                    |
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

## Styling

The package ships opt-in default styles that hide the `<rp>` fallback parens in modern browsers:

```ts
import 'tiptap-extension-ruby/style.css';
```

If you have your own design system, skip the import and style `ruby` / `rt` / `rp` directly.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). The `<rp>` fallback keeps the reading readable as `漢字(かんじ)` in legacy / plain-text contexts. Internet Explorer is not supported.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for dev setup, testing, and the visual-regression workflow.

## License

[MIT](./LICENSE) © Michael Kenji Wilkins
