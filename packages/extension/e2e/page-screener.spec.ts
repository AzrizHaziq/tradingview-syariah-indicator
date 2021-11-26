import { expect } from '@playwright/test'
import { nonShariahList, shariahByExchange, test } from './setup'

// const shariahButton = '#shariah-checkbox-id'
const shariahLabelButton = '[for="shariah-checkbox-id"]'

const setMarket = (market: 'malaysia' | 'USA' | 'china' | 'canada' | 'indonesia' | 'brazil') => async (page) => {
  // click country dropdown
  await page.click('.tv-screener-market-select > .js-screener-market-button')
  await page.fill('[placeholder=Search]', market)

  // @ts-ignore
  if (market === 'USA') market = 'america'

  await page.click(`[data-market=${market}]`)
  await page.waitForTimeout(2000)
}

test.beforeEach(async ({ page }) => {
  await page.goto(`https://www.tradingview.com/screener/`)

  // black friday modal
  await page.click('#overlap-manager-root svg')
})

test.describe.parallel('Screener page', () => {
  test('Shariah checkbox button should exist on US, China, Malaysia market', async ({ page }) => {
    await setMarket('canada')(page)
    await page.isHidden(shariahLabelButton)

    await setMarket('china')(page)
    await page.isVisible(shariahLabelButton)

    await setMarket('indonesia')(page)
    await page.isHidden(shariahLabelButton)

    await setMarket('malaysia')(page)
    await page.isVisible(shariahLabelButton)

    await setMarket('brazil')(page)
    await page.isHidden(shariahLabelButton)

    await setMarket('USA')(page)
    await page.isVisible(shariahLabelButton)
  })

  test('Should retain active/inactive state of shariah button', async ({ page }) => {
    const assert = ([s]) => Promise.resolve(getComputedStyle(document.querySelector(s)).getPropertyValue('opacity'))
    let res = await page.evaluate(assert, [shariahLabelButton])
    expect(parseFloat(res)).toBe(0.4)

    // set shariah active
    await page.click(shariahLabelButton)
    await page.waitForTimeout(500)
    res = await page.evaluate(assert, [shariahLabelButton])
    expect(parseFloat(res)).toBe(1)

    await setMarket('brazil')(page)
    await page.isHidden(shariahLabelButton)

    await setMarket('USA')(page)
    await page.waitForTimeout(500)
    res = await page.evaluate(assert, [shariahLabelButton])
    expect(parseFloat(res)).toBe(1)

    // set shariah inactive
    await page.click(shariahLabelButton)
    await page.waitForTimeout(500)
    res = await page.evaluate(assert, [shariahLabelButton])
    expect(parseFloat(res)).toBe(0.4)

    await setMarket('brazil')(page)
    await page.isHidden(shariahLabelButton)

    await setMarket('USA')(page)
    await page.waitForTimeout(500)
    res = await page.evaluate(assert, [shariahLabelButton])
    expect(parseFloat(res)).toBe(0.4)
  })
})

// const goToScreenerPage =
//   (assert: 'toBeTruthy' | 'toBeFalsy') =>
//   ([exchange, code, name]) => {
//
//   }

// goToScreenerPage('toBeTruthy')(['MYX', 'ADVENTA', 'ADVENTA BERHAD'])
// test.describe.parallel('Screener page', () => {
//   shariahByExchange.forEach(goToScreenerPage('toBeTruthy'))
// nonShariahList.forEach(goToScreenerPage('toBeFalsy'))
// })
