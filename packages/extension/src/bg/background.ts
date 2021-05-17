import { browser } from 'webextension-polyfill-ts'
import { dateDiffInDays, debounce, initGa, isValidDate } from '../helper'

browser.tabs.onUpdated.addListener(debounce(listener, 500, true))

async function fetchData(shouldRefreshData = false): Promise<any> {
  let jsonUrl = process.env.FETCH_URL

  if (shouldRefreshData) {
    jsonUrl += `?r=${Math.random()}`
  }

  try {
    const res = await fetch(jsonUrl)
    const data = await res.json()
    await setExchangesInStorage(data)
    await browser.storage.local.set({ LAST_FETCH_AT: new Date().toString() })
  } catch (e) {
    console.error('Github json when wrong', e)
  }
}

async function listener(_, { status }, { url }) {
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
      await fetchData()
    }
  } catch (e) {
    console.error('Error Send message', e)
  }
}

async function setExchangesInStorage(response) {
  try {
    const allExchanges = Object.entries(response).flatMap(([exchange, exchangeData]) => {
      // @ts-ignore
      const { shape, list } = exchangeData

      return Object.entries(list).map(([symbol, symbolData]) => {
        // @ts-ignore
        const val = symbolData.reduce(
          (acc, value, index) => ({
            ...acc,
            [shape[index].hasOwnProperty(value) ? shape[index][value] : shape[index].default]: value,
          }),
          {}
        )

        return [`${exchange}:${symbol}`, val]
      })
    })

    await browser.storage.local.set({ LIST: allExchanges })
    // console.log(await browser.storage.local.get('LIST'))
  } catch (e) {
    console.error(`Error set storage`, e)
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
      .then(() => browser.storage.local.set({ LAST_FETCH_AT: new Date().toString() }))
  }
})
;(async () => {
  initGa()
  await fetchData()
})()
