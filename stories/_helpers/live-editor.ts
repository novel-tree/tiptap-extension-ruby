import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import { Ruby } from '../../src/ruby';

/**
 * Mount a live TipTap editor with the Ruby extension. Excluded from the
 * visual regression suite — intended for manual QA of the input rule.
 */
export const createLiveEditor = (initialHtml: string): HTMLElement => {
  const container = document.createElement('div');
  container.style.border = '1px solid #ddd';
  container.style.padding = '12px';
  container.style.borderRadius = '4px';
  container.style.minHeight = '120px';

  const hint = document.createElement('p');
  hint.textContent = 'Try typing: |漢字《かんじ》';
  hint.style.fontSize = '12px';
  hint.style.color = '#666';
  hint.style.marginBottom = '8px';
  container.appendChild(hint);

  const editorEl = document.createElement('div');
  container.appendChild(editorEl);

  new Editor({
    element: editorEl,
    content: initialHtml,
    extensions: [Document, Paragraph, Text, Ruby],
  });

  return container;
};
