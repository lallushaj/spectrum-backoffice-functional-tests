import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 120000,
  use: {
    baseURL: process.env.SBPOJECT_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
