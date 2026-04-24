import { nodeInputRule } from '@tiptap/core';
import type { NodeType } from '@tiptap/pm/model';

/**
 * Aozora-Bunko–style ruby shorthand:
 *
 *   |漢字《かんじ》
 *
 * The leading `|` disambiguates the base text, which is especially useful when
 * the base contains mixed kanji/kana. The reading is wrapped in 《》.
 */
export const RUBY_INPUT_REGEX = /\|([^|《》\s]+)《([^《》\n]+)》$/;

export const rubyInputRule = ({ type }: { type: NodeType }) =>
  nodeInputRule({
    find: RUBY_INPUT_REGEX,
    type,
    getAttributes: (match) => {
      const [, rb, rt] = match;
      return { rb: rb ?? '', rt: (rt ?? '').trim() };
    },
  });