import { Node, mergeAttributes } from '@tiptap/core';
import type { DOMOutputSpec } from '@tiptap/pm/model';

import { setRuby, toggleRuby, unsetRuby } from './commands';
import { rubyInputRules } from './input-rules';
import { rubyPasteRules } from './paste-rules';
import {
  DEFAULT_SHORTHAND_RULE,
  type RubyShorthandOptions,
  type RubyShorthandRule,
} from './shorthand';
import { parseRubyElement } from './utils/parse-ruby-html';

export interface RubyOptions {
  /**
   * Additional HTML attributes merged onto the rendered `<ruby>` element.
   */
  HTMLAttributes: Record<string, unknown>;
  /**
   * Enable the Aozora-Bunko-style `|漢字《かんじ》` input rule.
   * Deprecated: prefer `shorthand.enabled`.
   */
  enableInputRule: boolean;
  /**
   * Configure locale-friendly shorthand rules for input/paste conversion.
   */
  shorthand: RubyShorthandOptions;
  /**
   * Emit `<rp>(</rp>` / `<rp>)</rp>` fallbacks around `<rt>` for
   * browsers/readers that don't support ruby rendering.
   */
  renderRpFallback: boolean;
}

export interface RubyAttributes {
  rb: string;
  rt: string;
}

const normalizeShorthandRules = (rules: RubyShorthandRule[]): RubyShorthandRule[] =>
  rules.filter((rule) => rule.trigger && rule.open && rule.close);

const NODE_NAME = 'ruby';

export const Ruby = Node.create<RubyOptions>({
  name: NODE_NAME,
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
      enableInputRule: true,
      shorthand: {
        enabled: true,
        rules: [DEFAULT_SHORTHAND_RULE],
      },
      renderRpFallback: true,
    };
  },

  addAttributes() {
    return {
      rb: {
        default: '',
        renderHTML: () => ({}),
      },
      rt: {
        default: '',
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'ruby',
        getAttrs: (element) => {
          if (!(element instanceof Element)) return false;
          const parsed = parseRubyElement(element);
          if (!parsed) return false;
          return parsed;
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const attrs = node.attrs as RubyAttributes;
    const children: DOMOutputSpec[] = [attrs.rb];
    if (this.options.renderRpFallback) {
      children.push(['rp', '('], ['rt', attrs.rt], ['rp', ')']);
    } else {
      children.push(['rt', attrs.rt]);
    }
    return [
      'ruby',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ...children,
    ] as DOMOutputSpec;
  },

  renderText({ node }) {
    const { rb, rt } = node.attrs as RubyAttributes;
    return `${rb}(${rt})`;
  },

  addCommands() {
    return {
      setRuby,
      toggleRuby,
      unsetRuby,
    };
  },

  addInputRules() {
    if (!this.options.enableInputRule || !this.options.shorthand.enabled) return [];
    const rules = normalizeShorthandRules(this.options.shorthand.rules);
    return rubyInputRules({ rules, type: this.type });
  },

  addPasteRules() {
    if (!this.options.shorthand.enabled) return [];
    const rules = normalizeShorthandRules(this.options.shorthand.rules);
    return rubyPasteRules({ rules, type: this.type });
  },
});
