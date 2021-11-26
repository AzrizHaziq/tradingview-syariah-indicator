import * as fs from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { chromium } from 'playwright-chromium'
import { test as base } from '@playwright/test'
import config from '../playwright.config'

// @ts-ignore
import { data as _shariahList } from '../../data/stock-list-human.json'

export const test = base.extend({
  page: async ({}, use) => {
    const pathToExtension = join(__dirname, '..', 'dist')
    const dir = await fs.promises.mkdtemp(join(tmpdir(), 'test-user-data-dir'))
    const context = await chromium.launchPersistentContext(dir, {
      headless: config.use.headless,
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    })

    await use(context.pages()[0])
    await context.close()
  },
})

const findFirstStockByExchange =
  <T extends []>(array: T) =>
  (exchange: string): T =>
    array.find(([e]: [string]) => e === exchange)

export const shariahByExchange = ['NYSE', 'MYX', 'SSE', 'SZSE', 'NASDAQ'].map(findFirstStockByExchange(_shariahList))

export const nonShariahList = [
  ['MYX', 'CARLSBG', 'CARSBERG'],
  ['MYX', 'BAT', 'British Tobacco'],
  ['MYX', 'MAYBANK', 'Maybank'],
  ['MYX', 'PBBANK', 'Public Bank'],
  ['NYSE', 'PM', 'Philip Morris International'],
  ['NYSE', 'SAM', 'Boston Beer'],
  ['NASDAQ', 'NFLX', 'Netflix'],
  ['SSE', '601988', 'Bank of China'],
  ['SZSE', '000001', 'PING AN BANK'],
]

/**
 * @description Cant use this as cant use css selector with playwright
 */
const tsi_selector = '[data-indicator=tradingview-syariah-indicator]'
