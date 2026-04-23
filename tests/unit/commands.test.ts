import { afterEach, describe, expect, it } from 'vitest';
import type { Editor } from '@tiptap/core';

import { createEditor, destroyEditor } from '../helpers/create-editor';

let active: Editor | null = null;
const make = (opts: Parameters<typeof createEditor>[0] = {}) => {
  active = createEditor(opts);
  return active;
};

afterEach(() => {
  if (active) destroyEditor(active);
  active = null;
});

describe('setRuby', () => {
  it('inserts a ruby node on an empty paragraph', () => {
    const editor = make({ content: '<p></p>' });
    const result = editor.commands.setRuby({ rb: '漢字', rt: 'かんじ' });
    expect(result).toBe(true);
    expect(editor.getHTML()).toContain('<ruby>漢字<rp>(</rp><rt>かんじ</rt>');
  });

  it('returns false and does not dispatch when rt is empty', () => {
    const editor = make({ content: '<p>hello</p>' });
    const before = editor.getHTML();
    const result = editor.commands.setRuby({ rb: '漢字', rt: '' });
    expect(result).toBe(false);
    expect(editor.getHTML()).toBe(before);
  });

  it('returns false when rb is empty', () => {
    const editor = make({ content: '<p></p>' });
    const result = editor.commands.setRuby({ rb: '', rt: 'かんじ' });
    expect(result).toBe(false);
  });

  it('sanitizes control characters from rt', () => {
    const editor = make({ content: '<p></p>' });
    editor.commands.setRuby({ rb: '漢字', rt: 'か\u0001ん\u0000じ' });
    expect(editor.getHTML()).toContain('<rt>かんじ</rt>');
  });
});

describe('toggleRuby', () => {
  it('unwraps an existing ruby, leaving rb as plain text', () => {
    const editor = make({ content: '<p></p>' });
    editor.commands.setRuby({ rb: '漢字', rt: 'かんじ' });
    // Move cursor to position before the ruby atom.
    editor.commands.setTextSelection(1);
    const result = editor.commands.toggleRuby({ rb: '', rt: '' });
    expect(result).toBe(true);
    expect(editor.getHTML()).toBe('<p>漢字</p>');
  });

  it('uses selected text as rb when payload rb is empty', () => {
    const editor = make({ content: '<p>漢字</p>' });
    // Select "漢字" (positions 1..3 — paragraph opens at 1, each char = 1).
    editor.commands.setTextSelection({ from: 1, to: 3 });
    const result = editor.commands.toggleRuby({ rb: '', rt: 'かんじ' });
    expect(result).toBe(true);
    expect(editor.getHTML()).toContain('<ruby>漢字');
  });

  it('inserts when selection is empty', () => {
    const editor = make({ content: '<p></p>' });
    const result = editor.commands.toggleRuby({ rb: '漢字', rt: 'かんじ' });
    expect(result).toBe(true);
    expect(editor.getHTML()).toContain('<ruby>漢字');
  });
});

describe('unsetRuby', () => {
  it('returns false when the cursor is not before a ruby', () => {
    const editor = make({ content: '<p>hello</p>' });
    editor.commands.setTextSelection(1);
    const result = editor.commands.unsetRuby();
    expect(result).toBe(false);
  });

  it('unwraps ruby when cursor is positioned before it', () => {
    const editor = make({ content: '<p></p>' });
    editor.commands.setRuby({ rb: '漢字', rt: 'かんじ' });
    editor.commands.setTextSelection(1);
    const result = editor.commands.unsetRuby();
    expect(result).toBe(true);
    expect(editor.getHTML()).toBe('<p>漢字</p>');
  });
});
