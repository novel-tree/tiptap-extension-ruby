import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Ruby/Long Text',
};
export default meta;

type Story = StoryObj;

const ruby = (rb: string, rt: string) =>
  `<ruby>${rb}<rp>(</rp><rt>${rt}</rt><rp>)</rp></ruby>`;

export const Wrapping: Story = {
  render: () => `
    <p style="max-width: 560px;">
      ${ruby('春', 'はる')}の夜の${ruby('桜', 'さくら')}が${ruby('満開', 'まんかい')}で、
      ${ruby('町', 'まち')}の${ruby('人々', 'ひとびと')}は${ruby('花見', 'はなみ')}を${ruby('楽', 'たの')}しんでいる。
      ${ruby('川辺', 'かわべ')}では${ruby('子供', 'こども')}たちが${ruby('走', 'はし')}り回り、
      ${ruby('笑', 'わら')}い${ruby('声', 'ごえ')}が${ruby('響', 'ひび')}き${ruby('渡', 'わた')}る。
    </p>
  `,
};
