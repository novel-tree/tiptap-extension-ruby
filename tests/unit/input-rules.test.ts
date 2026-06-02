import { afterEach, describe, expect, it } from 'vitest';
import type { Editor } from '@tiptap/core';

import { DEFAULT_RUBY_INPUT_REGEX } from '../../src/input-rules';
import { createRubyInputRegex } from '../../src/shorthand';
import { createEditor, destroyEditor } from '../helpers/create-editor';

let active: Editor | null = null;
afterEach(() => {
  if (active) destroyEditor(active);
  active = null;
});

describe('DEFAULT_RUBY_INPUT_REGEX', () => {
  it('matches |漢字《かんじ》 at end of string', () => {
    const match = '|漢字《かんじ》'.match(DEFAULT_RUBY_INPUT_REGEX);
    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('漢字');
    expect(match?.[2]).toBe('かんじ');
  });

  it('requires the leading pipe', () => {
    expect('漢字《かんじ》'.match(DEFAULT_RUBY_INPUT_REGEX)).toBeNull();
  });

  it('rejects empty reading', () => {
    expect('|漢字《》'.match(DEFAULT_RUBY_INPUT_REGEX)).toBeNull();
  });

  it('rejects nested brackets in reading', () => {
    expect('|漢字《か《ん》じ》'.match(DEFAULT_RUBY_INPUT_REGEX)).toBeNull();
  });

  it('anchors to the end of the string (not mid-string)', () => {
    // Input rules only fire on the newest typed char, which is the tail of
    // the pending input. Mid-string matches are the paste rule's job.
    const match = 'prefix |漢字《かんじ》'.match(DEFAULT_RUBY_INPUT_REGEX);
    expect(match).not.toBeNull();
    expect('|漢字《かんじ》 tail'.match(DEFAULT_RUBY_INPUT_REGEX)).toBeNull();
  });
});

describe('createRubyInputRegex', () => {
  it('supports ASCII-friendly delimiters', () => {
    const regex = createRubyInputRegex({ trigger: '|', open: '[', close: ']' });
    const match = '|hanzi[ㄏㄢˋㄗˋ]'.match(regex);
    expect(match?.[1]).toBe('hanzi');
    expect(match?.[2]).toBe('ㄏㄢˋㄗˋ');
  });

  it('supports custom trigger characters', () => {
    const regex = createRubyInputRegex({ trigger: '~', open: '{', close: '}' });
    const match = '~漢字{かんじ}'.match(regex);
    expect(match?.[1]).toBe('漢字');
    expect(match?.[2]).toBe('かんじ');
  });
});

describe('Ruby option propagation', () => {
  it('defaults enableInputRule to true', () => {
    active = createEditor({ content: '<p></p>' });
    const rubyExt = active.extensionManager.extensions.find((e) => e.name === 'ruby');
    expect(rubyExt?.options.enableInputRule).toBe(true);
  });

  it('accepts enableInputRule: false via configure()', () => {
    active = createEditor({
      content: '<p></p>',
      rubyOptions: { enableInputRule: false },
    });
    const rubyExt = active.extensionManager.extensions.find((e) => e.name === 'ruby');
    expect(rubyExt?.options.enableInputRule).toBe(false);
  });

  it('accepts shorthand rule overrides via configure()', () => {
    active = createEditor({
      content: '<p></p>',
      rubyOptions: {
        shorthand: {
          enabled: true,
          rules: [{ trigger: '|', open: '[', close: ']' }],
        },
      },
    });
    const rubyExt = active.extensionManager.extensions.find((e) => e.name === 'ruby');
    expect(rubyExt?.options.shorthand.rules).toEqual([{ trigger: '|', open: '[', close: ']' }]);
  });
});

describe('full typing integration', () => {
  // Triggering prosemirror-inputrules programmatically in happy-dom requires
  // simulating composition/beforeinput events that jsdom/happy-dom don't
  // faithfully reproduce. The Playwright visual suite (Phase E) covers the
  // end-to-end behavior.
  it.todo('converts |漢字《かんじ》 into a ruby node as the user types');
  it.todo('does not fire when enableInputRule is false');
});
