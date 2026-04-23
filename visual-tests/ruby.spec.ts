import { test, expect } from '@playwright/test';

interface StorybookEntry {
  type: 'story' | 'docs';
  id: string;
  name: string;
  title: string;
  importPath: string;
  tags?: string[];
}

interface StorybookIndex {
  v: number;
  entries: Record<string, StorybookEntry>;
}

const SKIP_TAG = 'visual-skip';

const getStories = async (baseURL: string): Promise<StorybookEntry[]> => {
  const res = await fetch(`${baseURL}/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Storybook index: ${res.status}`);
  }
  const index = (await res.json()) as StorybookIndex;
  return Object.values(index.entries).filter(
    (entry) => entry.type === 'story' && !(entry.tags ?? []).includes(SKIP_TAG)
  );
};

test.describe('Ruby visual regression', () => {
  test('every story matches its committed screenshot', async ({ page, baseURL }, testInfo) => {
    if (!baseURL) throw new Error('baseURL is not configured');
    const stories = await getStories(baseURL);
    expect(stories.length, 'expected at least one non-skipped story').toBeGreaterThan(0);

    for (const story of stories) {
      await test.step(story.id, async () => {
        await page.goto(`${baseURL}/iframe.html?id=${story.id}&viewMode=story`);
        // Wait for Storybook to render and for web fonts to finish loading.
        await page.waitForFunction(() => document.fonts && document.fonts.status === 'loaded');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot(`${story.id}.png`, {
          fullPage: false,
        });
      });
    }

    // Surface the project name in test annotations so snapshot reviewers can
    // see which browser produced which image.
    testInfo.annotations.push({ type: 'story-count', description: String(stories.length) });
  });
});
