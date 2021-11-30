import * as fs from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import config from '../playwright.config'
import { chromium } from 'playwright-chromium'
import { test as base } from '@playwright/test'

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

// AMAX and OTC not available since no data from Wahed
export const exchanges = ['NYSE', 'MYX', 'SSE', 'SZSE', 'NASDAQ', 'AMAX', 'OTC'] as const
export const shariahByExchange: [typeof exchanges[number], string, string][] = exchanges
  .map(findFirstStockByExchange(_shariahList))
  .filter(Boolean)

export const nonShariahList: [typeof exchanges[number], string, string][] = [
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

export type Market = 'malaysia' | 'USA' | 'china' | 'canada' | 'indonesia' | 'brazil'
export const exchangeToMarket = (exchange: typeof exchanges[number]): Market => {
  switch (exchange) {
    case 'MYX':
      return 'malaysia'
    case 'NASDAQ':
    case 'NYSE':
    case 'AMAX':
    case 'OTC':
      return 'USA'
    case 'SZSE':
    case 'SSE':
      return 'china'
  }
}
