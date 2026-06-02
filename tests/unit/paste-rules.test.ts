import { describe, expect, it } from 'vitest';

import { DEFAULT_RUBY_PASTE_REGEX } from '../../src/paste-rules';
import { createRubyPasteRegex } from '../../src/shorthand';

const allMatches = (input: string) =>
  Array.from(input.matchAll(DEFAULT_RUBY_PASTE_REGEX)).map((m) => ({
    rb: m[1],
    rt: m[2],
  }));

describe('DEFAULT_RUBY_PASTE_REGEX', () => {
  it('matches a token embedded in surrounding prose', () => {
    const matches = allMatches('先生|漢字《かんじ》を書く');
    expect(matches).toEqual([{ rb: '漢字', rt: 'かんじ' }]);
  });

  it('matches multiple tokens in the same input', () => {
    const matches = allMatches('|先生《せんせい》が|漢字《かんじ》を書く');
    expect(matches).toEqual([
      { rb: '先生', rt: 'せんせい' },
      { rb: '漢字', rt: 'かんじ' },
    ]);
  });

  it('does not match without the leading pipe', () => {
    expect(allMatches('先生漢字《かんじ》を書く')).toEqual([]);
  });

  it('does not match tokens with newlines in the reading', () => {
    expect(allMatches('|漢字《かん\nじ》')).toEqual([]);
  });

  it('does not match empty reading', () => {
    expect(allMatches('|漢字《》')).toEqual([]);
  });
});

describe('createRubyPasteRegex', () => {
  it('matches custom shorthand delimiters repeatedly', () => {
    const regex = createRubyPasteRegex({ trigger: '~', open: '{', close: '}' });
    const matches = Array.from('~漢字{かんじ}と~韓国{한글}'.matchAll(regex)).map((match) => ({
      rb: match[1],
      rt: match[2],
    }));
    expect(matches).toEqual([
      { rb: '漢字', rt: 'かんじ' },
      { rb: '韓国', rt: '한글' },
    ]);
  });
});

describe('paste integration', () => {
  // See input-rules.test.ts — full paste-event simulation is covered by the
  // Playwright visual suite. Regex-level matching is tested above.
  it.todo('inserts ruby nodes on paste for each matched token');
});
