import { Ruby } from '@novel-tree/tiptap-extension-ruby';
import '@novel-tree/tiptap-extension-ruby/style.css';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';

type LocalePreset = {
  key: string;
  label: string;
  note: string;
  shortcut: string;
  readingLabel: string;
  placeholder: string;
  content: string;
  shorthand: {
    enabled: boolean;
    rules: Array<{
      trigger: string;
      open: string;
      close: string;
    }>;
  };
};

const presets: LocalePreset[] = [
  {
    key: 'ja',
    label: 'Japanese / Aozora',
    note: 'Traditional shorthand stays available, but the main path is selection + modal.',
    shortcut: '|漢字《かんじ》',
    readingLabel: 'Furigana',
    placeholder: 'かんじ',
    content:
      '<p>夏目漱石の作品を読みながら、振り仮名の付け方を確認できます。必要な語だけ選んでルビを付けてください。</p>',
    shorthand: {
      enabled: true,
      rules: [{ trigger: '|', open: '《', close: '》' }],
    },
  },
  {
    key: 'zh',
    label: 'Chinese / ASCII',
    note: 'ASCII brackets are easier to type when testing pinyin or zhuyin annotations.',
    shortcut: '|漢字[ㄏㄢˋㄗˋ]',
    readingLabel: 'Pinyin / Zhuyin',
    placeholder: 'ㄏㄢˋㄗˋ',
    content:
      '<p>選中漢字後，可以直接輸入拼音或注音。快捷輸入只是輔助，主要流程仍然是先選字再加註音。</p>',
    shorthand: {
      enabled: true,
      rules: [{ trigger: '|', open: '[', close: ']' }],
    },
  },
  {
    key: 'ko',
    label: 'Korean / Curly',
    note: 'The modal-first flow works well when shorthand symbols are secondary to selection-based editing.',
    shortcut: '~漢字{한글}',
    readingLabel: 'Pronunciation',
    placeholder: '한글',
    content:
      '<p>한자나 외래어를 강조할 때, 먼저 텍스트를 고른 뒤 발음을 입력하는 흐름을 검증할 수 있습니다.</p>',
    shorthand: {
      enabled: true,
      rules: [{ trigger: '~', open: '{', close: '}' }],
    },
  },
];

const findPreset = (key: string): LocalePreset => presets.find((preset) => preset.key === key) ?? presets[0];

export default function App() {
  const [presetKey, setPresetKey] = useState(presets[0].key);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reading, setReading] = useState('');
  const [selectionText, setSelectionText] = useState('');

  const activePreset = findPreset(presetKey);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: false,
          blockquote: false,
          codeBlock: false,
          horizontalRule: false,
        }),
        Ruby.configure({
          shorthand: activePreset.shorthand,
        }),
      ],
      content: activePreset.content,
      editorProps: {
        attributes: {
          class: 'ruby-lab__editor',
        },
      },
    },
    [activePreset]
  );

  useEffect(() => {
    if (!editor) return;

    const syncSelection = () => {
      const { from, to } = editor.state.selection;
      const text = from === to ? '' : editor.state.doc.textBetween(from, to, '');
      setSelectionText(text);
    };

    syncSelection();
    editor.on('selectionUpdate', syncSelection);
    editor.on('transaction', syncSelection);

    return () => {
      editor.off('selectionUpdate', syncSelection);
      editor.off('transaction', syncSelection);
    };
  }, [editor]);

  const openComposer = () => {
    if (!selectionText) return;
    setReading('');
    setIsModalOpen(true);
  };

  const applyRuby = () => {
    if (!editor || !selectionText || !reading.trim()) return;
    editor.commands.toggleRuby({ rb: '', rt: reading });
    setIsModalOpen(false);
    setReading('');
    editor.commands.focus();
  };

  const closeComposer = () => {
    setIsModalOpen(false);
    setReading('');
  };

  return (
    <div className="ruby-lab">
      <div className="ruby-lab__glow ruby-lab__glow--amber" />
      <div className="ruby-lab__glow ruby-lab__glow--teal" />

      <header className="ruby-lab__hero">
        <div>
          <p className="ruby-lab__eyebrow">Ruby Extension Lab</p>
          <h1>Selection-first annotation, shorthand as a locale-friendly bonus.</h1>
        </div>
        <p className="ruby-lab__hero-copy">
          This sandbox shows the workflow most products will actually use: highlight a word, open a
          composer, and apply reading text without forcing specialized punctuation.
        </p>
      </header>

      <main className="ruby-lab__grid">
        <section className="ruby-lab__panel ruby-lab__panel--control">
          <div className="ruby-lab__section-title">
            <span>Locale presets</span>
            <strong>{activePreset.label}</strong>
          </div>
          <div className="ruby-lab__preset-list" role="tablist" aria-label="Locale presets">
            {presets.map((preset) => (
              <button
                key={preset.key}
                className={preset.key === activePreset.key ? 'ruby-chip ruby-chip--active' : 'ruby-chip'}
                onClick={() => setPresetKey(preset.key)}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="ruby-lab__card">
            <p className="ruby-lab__card-label">Primary UX</p>
            <h2>Select text, then open the ruby composer.</h2>
            <p>{activePreset.note}</p>
            <button
              className="ruby-lab__action"
              disabled={!selectionText}
              onClick={openComposer}
              type="button"
            >
              {selectionText ? `Add ruby to "${selectionText}"` : 'Select text inside the editor first'}
            </button>
          </div>

          <div className="ruby-lab__card ruby-lab__card--shortcut">
            <p className="ruby-lab__card-label">Optional shorthand</p>
            <code>{activePreset.shortcut}</code>
            <p>
              The extension now accepts locale-aware shorthand rules. Products can keep this enabled
              for power users while still leading everyone else through a button + modal flow.
            </p>
          </div>
        </section>

        <section className="ruby-lab__panel ruby-lab__panel--editor">
          <div className="ruby-lab__toolbar">
            <div>
              <p className="ruby-lab__card-label">Live editor</p>
              <strong>{selectionText ? `Selected: ${selectionText}` : 'Nothing selected yet'}</strong>
            </div>
            <button className="ruby-lab__ghost" onClick={() => editor?.commands.unsetRuby()} type="button">
              Remove ruby at cursor
            </button>
          </div>

          <EditorContent editor={editor} />

          <div className="ruby-lab__outputs">
            <div className="ruby-lab__output">
              <p className="ruby-lab__card-label">HTML</p>
              <pre>{editor?.getHTML() ?? ''}</pre>
            </div>
            <div className="ruby-lab__output">
              <p className="ruby-lab__card-label">Shortcut preset</p>
              <pre>{JSON.stringify(activePreset.shorthand, null, 2)}</pre>
            </div>
          </div>
        </section>
      </main>

      {isModalOpen ? (
        <div aria-modal="true" className="ruby-modal" role="dialog">
          <div className="ruby-modal__backdrop" onClick={closeComposer} />
          <div className="ruby-modal__sheet">
            <p className="ruby-lab__card-label">Ruby composer</p>
            <h2>{selectionText}</h2>
            <label className="ruby-modal__field">
              <span>{activePreset.readingLabel}</span>
              <input
                autoFocus
                onChange={(event) => setReading(event.target.value)}
                placeholder={activePreset.placeholder}
                value={reading}
              />
            </label>
            <div className="ruby-modal__actions">
              <button className="ruby-lab__ghost" onClick={closeComposer} type="button">
                Cancel
              </button>
              <button className="ruby-lab__action" onClick={applyRuby} type="button">
                Apply ruby
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
