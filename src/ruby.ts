import { Node, mergeAttributes } from '@tiptap/core';
import type { DOMOutputSpec } from '@tiptap/pm/model';

import { setRuby, toggleRuby, unsetRuby } from './commands';
import { rubyInputRule } from './input-rules';
import { rubyPasteRule } from './paste-rules';
import { parseRubyElement } from './utils/parse-ruby-html';

export interface RubyOptions {
  /**
   * Additional HTML attributes merged onto the rendered `<ruby>` element.
   */
  HTMLAttributes: Record<string, unknown>;
  /**
   * Enable the Aozora-Bunko-style `|漢字《かんじ》` input rule.
   */
  enableInputRule: boolean;
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
    if (!this.options.enableInputRule) return [];
    return [rubyInputRule({ type: this.type })];
  },

  addPasteRules() {
    return [rubyPasteRule({ type: this.type })];
  },
});
