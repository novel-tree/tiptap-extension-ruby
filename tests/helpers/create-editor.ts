import { Editor, type Extensions } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import { Ruby } from '../../src/ruby';

export interface CreateEditorOptions {
  content?: string;
  extensions?: Extensions;
}

/**
 * Build a detached TipTap editor suitable for unit testing in happy-dom.
 * Callers are responsible for `editor.destroy()` in teardown.
 */
export const createEditor = (options: CreateEditorOptions = {}): Editor => {
  const element = document.createElement('div');
  // happy-dom doesn't attach the element to document.body by default; appending
  // is what lets ProseMirror compute coordinates for selection-based commands.
  document.body.appendChild(element);

  const editor = new Editor({
    element,
    content: options.content ?? '',
    extensions: [Document, Paragraph, Text, Ruby, ...(options.extensions ?? [])],
  });

  return editor;
};

export const destroyEditor = (editor: Editor): void => {
  const dom = editor.view.dom;
  editor.destroy();
  if (dom.parentElement) dom.parentElement.remove();
};
