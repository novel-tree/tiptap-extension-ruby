import type { Meta, StoryObj } from '@storybook/html';

import { createLiveEditor } from './_helpers/live-editor';

const meta: Meta = {
  title: 'Ruby/Basic',
};
export default meta;

type Story = StoryObj;

const rubyHtml = (rb: string, rt: string) =>
  `<ruby>${rb}<rp>(</rp><rt>${rt}</rt><rp>)</rp></ruby>`;

export const Default: Story = {
  render: () => `<p>今日は${rubyHtml('漢字', 'かんじ')}を書きます。</p>`,
};

export const WithoutRpFallback: Story = {
  render: () => `<p>今日は<ruby>漢字<rt>かんじ</rt></ruby>を書きます。</p>`,
};

export const MultipleRubies: Story = {
  render: () =>
    `<p>${rubyHtml('先生', 'せんせい')}が${rubyHtml('漢字', 'かんじ')}を${rubyHtml('書', 'か')}く。</p>`,
};

export const LiveEditor: Story = {
  // `visual-skip` tag is honored by visual-tests/ruby.spec.ts to exclude this
  // story from screenshot regression (it mounts a live editor for manual QA).
  tags: ['visual-skip'],
  render: () =>
    createLiveEditor(`<p>今日は${rubyHtml('漢字', 'かんじ')}を書きます。</p>`, {
      hint: 'Try typing or pasting: |漢字《かんじ》',
    }),
};

export const LiveEditorInputRuleDisabled: Story = {
  tags: ['visual-skip'],
  render: () =>
    createLiveEditor('<p></p>', {
      hint: 'Input rule disabled. Typing |漢字《かんじ》 should stay as plain text.',
      rubyOptions: { enableInputRule: false },
    }),
};
