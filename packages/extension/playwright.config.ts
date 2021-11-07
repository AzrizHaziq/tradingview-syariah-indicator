import { PlaywrightTestConfig } from '@playwright/test'

export default <PlaywrightTestConfig>{
  testDir: 'e2e',
  timeout: 10_000_000,
  // retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  use: {
    userAgent:
      'Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.10 (KHTML, like Gecko) Chrome/56.0.1000.87 Safari/537.10 OPR/43.0.2442.991',
    headless: false,
  },
}
