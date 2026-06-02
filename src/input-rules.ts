import { nodeInputRule } from '@tiptap/core';
import type { NodeType } from '@tiptap/pm/model';

import { createRubyInputRegex, DEFAULT_SHORTHAND_RULE, type RubyShorthandRule } from './shorthand';

export const DEFAULT_RUBY_INPUT_REGEX = createRubyInputRegex(DEFAULT_SHORTHAND_RULE);

export const rubyInputRules = ({
  rules,
  type,
}: {
  rules: RubyShorthandRule[];
  type: NodeType;
}) =>
  rules.map((rule) =>
    nodeInputRule({
      find: createRubyInputRegex(rule),
      type,
      getAttributes: (match) => {
        const [, rb, rt] = match;
        return { rb: rb ?? '', rt: (rt ?? '').trim() };
      },
    })
  );
