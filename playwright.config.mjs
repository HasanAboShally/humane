import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/site',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4178/humane/', reducedMotion: 'reduce', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }, { name: 'webkit', use: { browserName: 'webkit' } }],
  webServer: {
    command: 'npm run dev:site',
    url: 'http://127.0.0.1:4178/humane/',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
