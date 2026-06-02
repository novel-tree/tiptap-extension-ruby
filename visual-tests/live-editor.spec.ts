import { expect, test, type Page } from '@playwright/test';

const typingStoryId = 'ruby-basic--live-editor';
const disabledStoryId = 'ruby-basic--live-editor-input-rule-disabled';
const openStory = async (page: Page, baseURL: string, id: string) => {
  await page.goto(`${baseURL}/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => document.fonts && document.fonts.status === 'loaded');
  await page.waitForLoadState('networkidle');
};

const getEditor = (page: Page) =>
  page.locator('[data-testid="editor-root"] .ProseMirror');

const getHtmlOutput = (page: Page) => page.locator('[data-testid="editor-html"]');

test.describe('Ruby live editor behavior', () => {
  test('typing Aozora shorthand converts into a ruby node', async ({ page, baseURL }) => {
    if (!baseURL) throw new Error('baseURL is not configured');
    await openStory(page, baseURL, typingStoryId);

    await page.evaluate(() => {
      const editor = (window as Window & { __TTR_LIVE_EDITOR__?: { commands: { clearContent: () => void } } })
        .__TTR_LIVE_EDITOR__;
      editor?.commands.clearContent();
    });

    const editor = getEditor(page);
    await editor.click();
    await page.keyboard.type('|漢字《かんじ》');

    await expect(getHtmlOutput(page)).toContainText('<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>');
  });

  test('pasting multiple shorthand tokens converts both in one transaction', async ({
    page,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('baseURL is not configured');
    await openStory(page, baseURL, typingStoryId);

    await page.evaluate(() => {
      const editor = (window as Window & { __TTR_LIVE_EDITOR__?: { commands: { clearContent: () => void } } })
        .__TTR_LIVE_EDITOR__;
      editor?.commands.clearContent();
    });

    await page.evaluate(() => {
      const pasteText = (
        window as Window & { __TTR_PASTE_TEXT__?: (text: string) => void }
      ).__TTR_PASTE_TEXT__;
      pasteText?.('|先生《せんせい》が|漢字《かんじ》を書く');
    });

    const output = getHtmlOutput(page);
    await expect(output).toContainText('<ruby>先生<rp>(</rp><rt>せんせい</rt><rp>)</rp></ruby>');
    await expect(output).toContainText('<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>');
  });

  test('disableInputRule keeps shorthand as plain text while typing', async ({ page, baseURL }) => {
    if (!baseURL) throw new Error('baseURL is not configured');
    await openStory(page, baseURL, disabledStoryId);

    const editor = getEditor(page);
    await editor.click();
    await page.keyboard.type('|漢字《かんじ》');

    const output = getHtmlOutput(page);
    await expect(output).toContainText('|漢字《かんじ》');
    await expect(output).not.toContainText('<ruby>');
  });
});
