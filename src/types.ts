import '@tiptap/core';

/**
 * Payload accepted by `setRuby` / `toggleRuby` commands.
 *
 * - `rb` — base text (the characters the reading annotates). Required.
 * - `rt` — reading text shown above the base (furigana). Required.
 */
export interface SetRubyPayload {
  rb: string;
  rt: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ruby: {
      /**
       * Insert a `<ruby>` node with the given base/reading.
       */
      setRuby: (payload: SetRubyPayload) => ReturnType;
      /**
       * Toggle: if the current selection is inside a ruby node, remove it;
       * otherwise wrap the selected text with the provided reading.
       */
      toggleRuby: (payload: SetRubyPayload) => ReturnType;
      /**
       * Unwrap the ruby node at the current selection, preserving the base text.
       */
      unsetRuby: () => ReturnType;
    };
  }
}