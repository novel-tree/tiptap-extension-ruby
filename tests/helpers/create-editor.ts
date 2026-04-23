import { Editor, type Extensions } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import { Ruby, type RubyOptions } from '../../src/ruby';

export interface CreateEditorOptions {
  content?: string;
  rubyOptions?: Partial<RubyOptions>;
  extraExtensions?: Extensions;
}

/**
 * Build a detached TipTap editor suitable for unit testing in happy-dom.
 * Callers are responsible for calling `destroyEditor(editor)` in teardown.
 */
export const createEditor = (options: CreateEditorOptions = {}): Editor => {
  const element = document.createElement('div');
  document.body.appendChild(element);

  const ruby = options.rubyOptions ? Ruby.configure(options.rubyOptions) : Ruby;

  const editor = new Editor({
    element,
    content: options.content ?? '',
    extensions: [Document, Paragraph, Text, ruby, ...(options.extraExtensions ?? [])],
  });

  return editor;
};

export const destroyEditor = (editor: Editor): void => {
  const dom = editor.view.dom;
  editor.destroy();
  if (dom.parentElement) dom.parentElement.remove();
};
