import type { Command } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';

import type { SetRubyPayload } from './types';
import { sanitizeReading } from './utils/validate';

const NODE_NAME = 'ruby';

interface RubyTarget {
  node: ProseMirrorNode;
  pos: number;
}

const findRubyTarget = (state: EditorState): RubyTarget | null => {
  const { selection } = state;
  const { $from, from } = selection;

  if (selection instanceof NodeSelection && selection.node.type.name === NODE_NAME) {
    return { node: selection.node, pos: from };
  }

  const nodeAfter = $from.nodeAfter;
  if (nodeAfter?.type.name === NODE_NAME) {
    return { node: nodeAfter, pos: from };
  }

  if (!selection.empty) return null;

  const nodeBefore = $from.nodeBefore;
  if (nodeBefore?.type.name === NODE_NAME) {
    return { node: nodeBefore, pos: from - nodeBefore.nodeSize };
  }

  return null;
};

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

    // If the selection touches a ruby node, strip it.
    if (findRubyTarget(state)) {
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
    const target = findRubyTarget(state);
    if (!target) return false;

    const rb = (target.node.attrs as { rb?: string }).rb ?? '';
    if (dispatch) {
      tr.replaceWith(target.pos, target.pos + target.node.nodeSize, state.schema.text(rb || ' '));
      dispatch(tr);
    }
    return true;
  };
