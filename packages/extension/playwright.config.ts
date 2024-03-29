import { PlaywrightTestConfig } from '@playwright/test'

export default <PlaywrightTestConfig>{
  testDir: 'e2e',
  retries: 2,
  use: {
    headless: false,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
  },
}
