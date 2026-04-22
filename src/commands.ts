import type { Command } from '@tiptap/core';

import type { SetRubyPayload } from './types';
import { sanitizeReading } from './utils/validate';

const NODE_NAME = 'ruby';

export const setRuby =
  (payload: SetRubyPayload): Command =>
  ({ state, dispatch, tr }) => {
    const rb = payload.rb;
    const rt = sanitizeReading(payload.rt);
    if (!rb || !rt) return false;

    const type = state.schema.nodes[NODE_NAME];
    if (!type) return false;

    const node = type.create({ rb, rt });
    if (dispatch) {
      tr.replaceSelectionWith(node, false).scrollIntoView();
      dispatch(tr);
    }
    return true;
  };

export const toggleRuby =
  (payload: SetRubyPayload): Command =>
  (props) => {
    const { state } = props;
    const { $from } = state.selection;

    // If the selection sits on a ruby node, strip it.
    const nodeAfter = $from.nodeAfter;
    if (nodeAfter && nodeAfter.type.name === NODE_NAME) {
      return unsetRuby()(props);
    }

    // If the selection is empty, just insert from the payload.
    const { from, to } = state.selection;
    if (from === to) {
      return setRuby(payload)(props);
    }

    // Otherwise, use the selected text as the base if caller didn't supply one.
    const selectedText = state.doc.textBetween(from, to, '');
    const rb = payload.rb || selectedText;
    return setRuby({ rb, rt: payload.rt })(props);
  };

export const unsetRuby =
  (): Command =>
  ({ state, dispatch, tr }) => {
    const { $from } = state.selection;
    const nodeAfter = $from.nodeAfter;
    if (!nodeAfter || nodeAfter.type.name !== NODE_NAME) return false;

    const rb = (nodeAfter.attrs as { rb?: string }).rb ?? '';
    if (dispatch) {
      const pos = $from.pos;
      tr.replaceWith(pos, pos + nodeAfter.nodeSize, state.schema.text(rb || ' '));
      dispatch(tr);
    }
    return true;
  };