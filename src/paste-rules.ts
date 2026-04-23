import { nodePasteRule } from '@tiptap/core';
import type { NodeType } from '@tiptap/pm/model';

/**
 * Paste-time counterpart of the input rule. Applies across the pasted slice,
 * so long prose containing multiple `|漢字《かんじ》` tokens is converted in one go.
 */
export const RUBY_PASTE_REGEX = /\|([^\|《》\s]+)《([^《》\n]+)》/g;

export const rubyPasteRule = ({ type }: { type: NodeType }) =>
  nodePasteRule({
    find: RUBY_PASTE_REGEX,
    type,
    getAttributes: (match) => {
      const [, rb, rt] = match;
      return { rb: rb ?? '', rt: (rt ?? '').trim() };
    },
  });