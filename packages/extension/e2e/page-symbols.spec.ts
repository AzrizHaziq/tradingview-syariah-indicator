import { expect } from '@playwright/test'
import { nonShariahList, shariahByExchange, test } from './setup'

const mobileSelector = `.tv-symbol-header.tv-symbol-header--mobile .tv-symbol-header__first-line > svg`
const desktopSelector = `.tv-symbol-header .tv-symbol-header__second-line .tv-symbol-header__exchange-container > svg`

const symbolsPage =
  (assert: 'toBeTruthy' | 'toBeFalsy') =>
  ([exchange, code, name]) => {
    test.describe(`${assert === 'toBeTruthy' ? '[S]' : '[NS]'}: ${exchange}-${code}-${name}`, () => {
      test(`desktop view`, async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 700 })
        await page.goto(`https://www.tradingview.com/symbols/${exchange}-${code}`)
        const bool = await page.isVisible(desktopSelector)
        expect(bool)[assert]()
      })

      test('mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 500, height: 700 })
        await page.goto(`https://www.tradingview.com/symbols/${exchange}-${code}`)
        const bool = await page.isVisible(mobileSelector)
        expect(bool)[assert]()
      })
    })
  }

test.describe.parallel('Symbol page', () => {
  shariahByExchange.forEach(symbolsPage('toBeTruthy'))
  nonShariahList.forEach(symbolsPage('toBeFalsy'))
})
