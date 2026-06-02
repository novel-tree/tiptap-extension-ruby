import { nodePasteRule } from '@tiptap/core';
import type { NodeType } from '@tiptap/pm/model';

import { createRubyPasteRegex, DEFAULT_SHORTHAND_RULE, type RubyShorthandRule } from './shorthand';

export const DEFAULT_RUBY_PASTE_REGEX = createRubyPasteRegex(DEFAULT_SHORTHAND_RULE);

export const rubyPasteRules = ({
  rules,
  type,
}: {
  rules: RubyShorthandRule[];
  type: NodeType;
}) =>
  rules.map((rule) =>
    nodePasteRule({
      find: createRubyPasteRegex(rule),
      type,
      getAttributes: (match) => {
        const [, rb, rt] = match;
        return { rb: rb ?? '', rt: (rt ?? '').trim() };
      },
    })
  );
