import { afterEach, describe, expect, it } from 'vitest';
import type { Editor } from '@tiptap/core';

import { createEditor, destroyEditor } from '../helpers/create-editor';
import { loadFixture } from '../helpers/load-fixture';

let active: Editor | null = null;
const make = (opts: Parameters<typeof createEditor>[0] = {}) => {
  active = createEditor(opts);
  return active;
};

afterEach(() => {
  if (active) destroyEditor(active);
  active = null;
});

describe('editor.getHTML', () => {
  it('serializes a ruby node with rp fallback by default', () => {
    const editor = make();
    editor.commands.setRuby({ rb: '漢字', rt: 'かんじ' });
    expect(editor.getHTML()).toContain(
      '<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>'
    );
  });
});

describe('editor.getJSON', () => {
  it('includes the ruby node with rb/rt attributes', () => {
    const editor = make();
    editor.commands.setRuby({ rb: '漢字', rt: 'かんじ' });
    const json = editor.getJSON();
    expect(JSON.stringify(json)).toContain(
      '"type":"ruby","attrs":{"rb":"漢字","rt":"かんじ"}'
    );
  });
});

describe('editor.getText', () => {
  it('emits "rb(rt)" for the ruby node', () => {
    const editor = make({ content: loadFixture('basic.html') });
    expect(editor.getText()).toBe('漢字(かんじ)');
  });
});
