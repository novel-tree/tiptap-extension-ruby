import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Ruby/Vertical Writing',
};
export default meta;

type Story = StoryObj;

const ruby = (rb: string, rt: string) =>
  `<ruby>${rb}<rp>(</rp><rt>${rt}</rt><rp>)</rp></ruby>`;

export const VerticalRL: Story = {
  render: () => `
    <div style="writing-mode: vertical-rl; height: 320px; font-size: 20px; line-height: 2.2;">
      <p>${ruby('月', 'つき')}の${ruby('光', 'ひかり')}が${ruby('静', 'しず')}かに${ruby('降', 'ふ')}り${ruby('注', 'そそ')}ぐ。</p>
    </div>
  `,
};
