import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import { Ruby, type RubyOptions } from '../../src/ruby';

interface LiveEditorOptions {
  hint?: string;
  rubyOptions?: Partial<RubyOptions>;
}

/**
 * Mount a live TipTap editor with the Ruby extension. Excluded from the
 * visual regression suite — intended for manual QA of the input rule.
 */
export const createLiveEditor = (
  initialHtml: string,
  options: LiveEditorOptions = {}
): HTMLElement => {
  const container = document.createElement('div');
  container.style.border = '1px solid #ddd';
  container.style.padding = '12px';
  container.style.borderRadius = '4px';
  container.style.minHeight = '120px';
  container.setAttribute('data-testid', 'live-editor-container');

  const hint = document.createElement('p');
  hint.textContent = options.hint ?? 'Try typing: |漢字《かんじ》';
  hint.style.fontSize = '12px';
  hint.style.color = '#666';
  hint.style.marginBottom = '8px';
  container.appendChild(hint);

  const editorEl = document.createElement('div');
  editorEl.setAttribute('data-testid', 'editor-root');
  container.appendChild(editorEl);

  const output = document.createElement('pre');
  output.setAttribute('data-testid', 'editor-html');
  output.style.marginTop = '12px';
  output.style.padding = '8px';
  output.style.background = '#f6f6f6';
  output.style.borderRadius = '4px';
  output.style.whiteSpace = 'pre-wrap';
  output.style.fontSize = '12px';
  container.appendChild(output);

  const ruby = options.rubyOptions ? Ruby.configure(options.rubyOptions) : Ruby;

  const editor = new Editor({
    element: editorEl,
    content: initialHtml,
    extensions: [Document, Paragraph, Text, ruby],
    onCreate: ({ editor: currentEditor }) => {
      output.textContent = currentEditor.getHTML();
    },
    onUpdate: ({ editor: currentEditor }) => {
      output.textContent = currentEditor.getHTML();
    },
  });

  const editorWindow = window as Window & {
    __TTR_LIVE_EDITOR__?: Editor;
    __TTR_PASTE_TEXT__?: (text: string) => void;
  };
  editorWindow.__TTR_LIVE_EDITOR__ = editor;
  editorWindow.__TTR_PASTE_TEXT__ = (text: string) => {
    editor.view.pasteText(text);
  };

  return container;
};
