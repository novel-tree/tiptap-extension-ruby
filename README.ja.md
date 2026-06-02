# tiptap-extension-ruby

[![CI](https://github.com/novel-tree/tiptap-extension-ruby/actions/workflows/ci.yml/badge.svg)](https://github.com/novel-tree/tiptap-extension-ruby/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/tiptap-extension-ruby.svg)](./LICENSE)

CJK のテキストに HTML `<ruby>` 注釈（ふりがな / 振り仮名）を付与するための TipTap v3 拡張です。

> English version: [README.md](./README.md).

## Phase 1 の対象範囲

このブランチは GitHub Packages 向け Phase 1 public beta です。

- 対応: 既存 `<ruby>` HTML の表示、TipTap ドキュメント内での ruby 保持、青空文庫形式の input/paste 変換、コマンド経由の ruby 挿入
- 未対応: リッチなインプレース編集 UI、分節 ruby の編集、複数 `<rt>` を持つ複雑な ruby 構造の完全な round-trip

## インストール

```bash
echo "@novel-tree:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
pnpm add @novel-tree/tiptap-extension-ruby@beta
# または: npm install @novel-tree/tiptap-extension-ruby@beta
# または: yarn add @novel-tree/tiptap-extension-ruby@beta
```

peerDependencies: `@tiptap/core` と `@tiptap/pm`（どちらも `^3.0.0`）。

## クイックスタート

```ts
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Ruby } from '@novel-tree/tiptap-extension-ruby';
import '@novel-tree/tiptap-extension-ruby/style.css'; // 任意: デフォルトスタイル

const editor = new Editor({
  element: document.querySelector('#editor')!,
  extensions: [Document, Paragraph, Text, Ruby],
  content: '<p><ruby>漢字<rt>かんじ</rt></ruby></p>',
});

editor.commands.setRuby({ rb: '先生', rt: 'せんせい' });
```

## オプション

`Ruby.configure({...})` で設定します。

| オプション          | 型                        | 既定値 | 説明                                                                     |
| ------------------- | ------------------------- | ------ | ------------------------------------------------------------------------ |
| `HTMLAttributes`    | `Record<string, unknown>` | `{}`   | レンダリングされる `<ruby>` 要素にマージする属性。                       |
| `enableInputRule`   | `boolean`                 | `true` | shorthand 入力ルール用の旧来スイッチ。通常は `shorthand.enabled` を使います。 |
| `shorthand`         | `RubyShorthandOptions`    | 青空文庫 | input/paste 変換に使うロケール別 shorthand ルール。                      |
| `renderRpFallback`  | `boolean`                 | `true` | `<rt>` の前後に `<rp>(</rp>` / `<rp>)</rp>` を出力してフォールバックに。 |

## コマンド

| コマンド                 | シグネチャ                                 | 振る舞い                                                 |
| ------------------------ | ------------------------------------------ | -------------------------------------------------------- |
| `setRuby({ rb, rt })`    | `(payload: SetRubyPayload) => boolean`     | 現在のカーソル位置に ruby ノードを挿入。                 |
| `toggleRuby({ rb, rt })` | `(payload: SetRubyPayload) => boolean`     | 選択中のテキストを ruby で囲む、または既存の ruby を解除。|
| `unsetRuby()`            | `() => boolean`                            | カーソル位置の ruby を解除し、base 文字列だけを残す。    |

戻り値はドキュメントを変更した場合のみ `true`、それ以外は `false` です。

## 入力ルール

[青空文庫](https://www.aozora.gr.jp/) 記法に着想を得ています。

```
|漢字《かんじ》
```

base に漢字とかなが混在するケースを明確化するため、先頭に `|` を付けます。ペースト時にも同じ記法が認識され、1 回のペーストに含まれる複数トークンは 1 トランザクションで変換されます。

ロケールごとに shorthand の記号を変えることもできます。

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

これにより、日本語では青空文庫記法を残しつつ、中国語や韓国語向けには ASCII ベースの入力ショートカットを併用できます。

## ローカルの example app

[examples/react-vite](/Users/michaelwilkins/Documents/GitHub/tiptap-extension-ruby/examples/react-vite/package.json:1) に小さな React + Vite サンドボックスを用意しています。次を確認できます。

- 選択してから modal で ruby を付与する主導線
- 日本語 / 中国語 / 韓国語の locale preset
- 補助導線としての shorthand 切り替え

ローカルで動かすには:

```bash
cd examples/react-vite
pnpm install
pnpm dev
```

## スタイリング

モダンブラウザで `<rp>` フォールバックを非表示にする任意の既定スタイルを同梱しています。

```ts
import '@novel-tree/tiptap-extension-ruby/style.css';
```

独自のデザインシステムを持つ場合はインポートをスキップし、`ruby` / `rt` / `rp` を直接スタイリングしてください。

## 対応ブラウザ

モダンなエバーグリーンブラウザ（Chrome / Firefox / Safari / Edge）。`<rp>` フォールバックにより、プレーンテキストのリーダーでも `漢字(かんじ)` として判読できます。Internet Explorer は対応していません。

## コントリビュート

開発セットアップ、テスト、ビジュアル回帰の運用については [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

[MIT](./LICENSE) © Michael Kenji Wilkins
