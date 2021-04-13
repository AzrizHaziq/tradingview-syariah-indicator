import { browser } from 'webextension-polyfill-ts'
import { dateDiffInDays, debounce, initGa, isValidDate } from '../helper'

initGa()
fetchData()
browser.tabs.onUpdated.addListener(debounce(listener, 500, true))

async function fetchData(shouldRefreshData = false): Promise<Record<string, TSI.SHARIAH_LIST>> {
  let jsonUrl = process.env.FETCH_URL

  if (shouldRefreshData) {
    jsonUrl += `?r=${Math.random()}`
  }

  try {
    const res = await fetch(jsonUrl)
    return JSON.parse(await res.text())
  } catch (e) {
    console.error('Github json when wrong', e)
  }
}

async function listener(id, { status }, { url }) {
  if (status === 'loading') {
    return
  }

  const validUrls = ['tradingview.com/chart', 'tradingview.com/screener', 'tradingview.com/symbols']
  // filter out invalid url
  if (!validUrls.some(validUrl => new RegExp(validUrl).test(url))) {
    return
  }

  try {
    const { LAST_FETCH_AT } = await browser.storage.local.get('LAST_FETCH_AT')

    const currentDate = new Date()
    const lastFetchAt = isValidDate(LAST_FETCH_AT) ? new Date(LAST_FETCH_AT) : new Date()

    const shouldUseCacheValue = dateDiffInDays(currentDate, lastFetchAt) >= 0

    if (shouldUseCacheValue) {
      console.log('>>> Cache')
    } else {
      console.log('>>> API')
      const response = await fetchData()
      Object.entries(response).forEach(setStorages)
      await browser.storage.local.set({ LAST_FETCH_AT: new Date().toString() })
    }
  } catch (e) {
    console.error('Error Send message', e)
  }
}

async function setStorages([exchange, { list, updatedAt }]: [string, TSI.SHARIAH_LIST]): Promise<void> {
  try {
    await browser.storage.local.set({ [exchange]: { list, updatedAt } })
  } catch (e) {
    console.error(`Error set ${exchange} storage`, e)
  }
}

browser.runtime.onMessage.addListener((req: TSI.EVENT_MSG) => {
  if (req.type === 'ga') {
    if (req.subType === 'pageview') {
      ga('send', 'pageview', req.payload)
    }

    if (req.subType === 'event') {
      ga('send', {
        hitType: 'event',
        ...req.payload,
      })
    }
  }

  if (req.type === 'invalidate-cache') {
    return browser.storage.local
      .set({ LAST_FETCH_AT: null })
      .then(() => console.log('>>> INVALIDATE CACHE'))
      .then(() => fetchData(true))
      .then(response => Object.entries(response).forEach(setStorages))
      .then(() => browser.storage.local.set({ LAST_FETCH_AT: new Date().toString() }))
  }
})
