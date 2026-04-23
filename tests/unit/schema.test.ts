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

describe('parseHTML', () => {
  it('parses basic <ruby>base<rt>reading</rt></ruby>', () => {
    const editor = make({ content: loadFixture('basic.html') });
    const json = editor.getJSON();
    const [paragraph] = json.content ?? [];
    const [ruby] = paragraph?.content ?? [];
    expect(ruby).toMatchObject({
      type: 'ruby',
      attrs: { rb: '漢字', rt: 'かんじ' },
    });
  });

  it('strips <rp> from the base text', () => {
    const editor = make({ content: loadFixture('with-rp.html') });
    const [paragraph] = editor.getJSON().content ?? [];
    const [ruby] = paragraph?.content ?? [];
    expect(ruby).toMatchObject({
      type: 'ruby',
      attrs: { rb: '漢字', rt: 'かんじ' },
    });
  });

  it('handles legacy <rb> wrapper', () => {
    const editor = make({ content: loadFixture('with-rb.html') });
    const [paragraph] = editor.getJSON().content ?? [];
    const [ruby] = paragraph?.content ?? [];
    expect(ruby).toMatchObject({
      type: 'ruby',
      attrs: { rb: '漢字', rt: 'かんじ' },
    });
  });

  it('detects ruby inside inline wrappers (<strong>)', () => {
    const editor = make({ content: loadFixture('nested-inline.html') });
    const html = editor.getHTML();
    expect(html).toContain('<ruby>');
    expect(html).toContain('<rt>かんじ</rt>');
  });

  it('rejects malformed empty <ruby></ruby>', () => {
    const editor = make({ content: loadFixture('malformed-empty.html') });
    const json = editor.getJSON();
    const hasRuby = JSON.stringify(json).includes('"type":"ruby"');
    expect(hasRuby).toBe(false);
  });
});

describe('renderHTML', () => {
  it('emits <rp> fallbacks by default', () => {
    const editor = make({ content: loadFixture('basic.html') });
    expect(editor.getHTML()).toBe(
      '<p><ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby></p>'
    );
  });

  it('omits <rp> when renderRpFallback is false', () => {
    const editor = make({
      content: loadFixture('basic.html'),
      rubyOptions: { renderRpFallback: false },
    });
    expect(editor.getHTML()).toBe('<p><ruby>漢字<rt>かんじ</rt></ruby></p>');
  });

  it('merges custom HTMLAttributes onto the ruby element', () => {
    const editor = make({
      content: loadFixture('basic.html'),
      rubyOptions: { HTMLAttributes: { class: 'tt-ruby' } },
    });
    expect(editor.getHTML()).toContain('<ruby class="tt-ruby">');
  });
});

describe('round-trip', () => {
  it('preserves attrs through JSON → HTML → JSON', () => {
    const first = make({ content: loadFixture('basic.html') });
    const firstJson = first.getJSON();
    const html = first.getHTML();
    destroyEditor(first);

    const second = createEditor({ content: html });
    active = second;
    const secondJson = second.getJSON();
    expect(secondJson).toEqual(firstJson);
  });
});
