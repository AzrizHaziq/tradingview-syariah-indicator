import { test } from './_default'
import { expect } from '@playwright/test'

// @ts-ignore
import { data as _shariahList } from '../../data/stock-list-human.json'

const tsi_selector = '[data-indicator=tradingview-shariah-indicator]'

const findFirstStockByExchange =
  <T extends []>(array: T) =>
  (exchange: string): T =>
    array.find(([e]: [string]) => e === exchange)

const shariahByExchange = ['NYSE', 'MYX', 'SSE', 'SZSE', 'NASDAQ'].map(findFirstStockByExchange(_shariahList))

const nonShariahList = [
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

const chartTestPage =
  (assert: 'toBeTruthy' | 'toBeFalsy') =>
  ([exchange, code, name]) => {
    test.describe.parallel(`${assert === 'toBeTruthy' ? '[S]' : '[NS]'}: ${exchange}-${code}-${name}`, () => {
      test(`desktop view`, async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 700 })
        await page.goto(`https://www.tradingview.com/symbols/${exchange}-${code}`)
        const bool = await page.isVisible(`.tv-symbol-header ${tsi_selector}`)
        expect(bool)[assert]()
      })

      test('mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 500, height: 700 })
        await page.goto(`https://www.tradingview.com/symbols/${exchange}-${code}`)
        const bool = await page.isVisible(`.tv-symbol-header.tv-symbol-header--mobile ${tsi_selector}`)
        expect(bool)[assert]()
      })
    })
  }

shariahByExchange.forEach(chartTestPage('toBeTruthy'))
nonShariahList.forEach(chartTestPage('toBeFalsy'))
