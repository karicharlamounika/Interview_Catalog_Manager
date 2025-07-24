import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './E2ETests/tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  timeout: 60000,
  use: {
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
