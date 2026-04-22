import { defineConfig, devices } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL ?? 'http://localhost:6006';

export default defineConfig({
  testDir: './visual-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html']] : 'html',
  snapshotDir: './visual-tests/__screenshots__',
  snapshotPathTemplate:
    '{snapshotDir}/{projectName}/{testFileName}/{arg}{ext}',

  expect: {
    // Allow a tiny amount of pixel drift (sub-pixel font rendering).
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
    },
  },

  use: {
    baseURL: STORYBOOK_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm storybook --ci',
        url: STORYBOOK_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});