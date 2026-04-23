import type { Preview } from '@storybook/html';

// Pin the web font so CI and local rendering stay visually identical.
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';

// Opt-in default styles for the Ruby extension.
import '../src/style.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
    viewport: {
      defaultViewport: 'desktop',
      viewports: {
        desktop: {
          name: 'Desktop',
          styles: { width: '800px', height: '400px' },
          type: 'desktop',
        },
      },
    },
  },
  decorators: [
    (storyFn) => {
      const wrapper = document.createElement('div');
      wrapper.style.fontFamily = '"Noto Sans JP", system-ui, sans-serif';
      wrapper.style.fontSize = '18px';
      wrapper.style.lineHeight = '2';
      wrapper.style.color = '#111';
      const story = storyFn();
      if (typeof story === 'string') {
        wrapper.innerHTML = story;
      } else if (story instanceof Node) {
        wrapper.appendChild(story);
      }
      return wrapper;
    },
  ],
};

export default preview;
