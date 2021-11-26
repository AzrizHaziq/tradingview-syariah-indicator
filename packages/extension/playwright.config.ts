import { PlaywrightTestConfig } from '@playwright/test'

export default <PlaywrightTestConfig>{
  testDir: 'e2e',
  retries: 2,
  use: {
    headless: false,
    userAgent:
      'Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.10 (KHTML, like Gecko) Chrome/56.0.1000.87 Safari/537.10 OPR/43.0.2442.991',
  },
}
