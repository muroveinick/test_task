import { defineConfig, devices } from '@playwright/test';
import { configDotenv } from 'dotenv';

// Read from default ".env" file.
configDotenv();

export default defineConfig({
  testDir: './tests',
  globalTimeout: 120000,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
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

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },


  ],
});
