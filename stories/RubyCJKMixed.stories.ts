import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Ruby/CJK Mixed',
};
export default meta;

type Story = StoryObj;

const ruby = (rb: string, rt: string) =>
  `<ruby>${rb}<rp>(</rp><rt>${rt}</rt><rp>)</rp></ruby>`;

export const JapaneseAndChinese: Story = {
  render: () => `
    <p>日本語: ${ruby('日本語', 'にほんご')}、中文: ${ruby('中文', 'zhōngwén')}、
       한국어: ${ruby('한국어', 'ha-nguk-eo')}.</p>
  `,
};

export const PinyinOverHanzi: Story = {
  render: () => `
    <p>${ruby('学', 'xué')}${ruby('习', 'xí')}${ruby('中', 'zhōng')}${ruby('文', 'wén')}。</p>
  `,
};
