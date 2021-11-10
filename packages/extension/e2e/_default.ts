import * as fs from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { chromium } from 'playwright-chromium'
import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({}, use) => {
    const pathToExtension = join(__dirname, '..', 'dist')
    const dir = await fs.promises.mkdtemp(join(tmpdir(), 'test-user-data-dir'))
    const context = await chromium.launchPersistentContext(dir, {
      headless: false,
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    })

    await use(context.pages()[0])
    await context.close()
  },
})
