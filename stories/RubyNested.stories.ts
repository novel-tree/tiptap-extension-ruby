import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Ruby/Inside Inline Marks',
};
export default meta;

type Story = StoryObj;

const ruby = (rb: string, rt: string) =>
  `<ruby>${rb}<rp>(</rp><rt>${rt}</rt><rp>)</rp></ruby>`;

export const InsideStrong: Story = {
  render: () =>
    `<p>普通の文字と<strong>強調された${ruby('漢字', 'かんじ')}の文字</strong>が並ぶ。</p>`,
};

export const InsideEm: Story = {
  render: () =>
    `<p>これは<em>${ruby('斜体', 'しゃたい')}</em>の${ruby('例', 'れい')}です。</p>`,
};

export const InsideLink: Story = {
  render: () =>
    `<p>詳細は<a href="#">${ruby('説明書', 'せつめいしょ')}</a>を参照。</p>`,
};
