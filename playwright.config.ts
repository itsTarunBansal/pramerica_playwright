import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://nvestuat.pramericalife.in',
    headless: true,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },
  timeout: 300_000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
