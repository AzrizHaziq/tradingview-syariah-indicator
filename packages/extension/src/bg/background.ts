import { browser } from 'webextension-polyfill-ts'
import { dateDiffInDays, debounce, getStorage, initGa, isValidDate, setStorage } from '../helper'
import StorageKeys = TSI.StorageKeys

browser.tabs.onUpdated.addListener(debounce(listener, 500, true))

async function fetchData(shouldRefreshData = false): Promise<void> {
  let jsonUrl = process.env.FETCH_URL

  if (shouldRefreshData) {
    jsonUrl += `?r=${Math.random()}`
  }

  try {
    const res = await fetch(jsonUrl)
    const data: TSI.RESPONSE_FROM_JSON = await res.json()
    await setListInStorages(data)
    await setExchangeDetailInfoInStorage(data)
    await browser.storage.local.set({ LAST_FETCH_AT: new Date().toString() })
  } catch (e) {
    console.error('Github json when wrong', e)
  }
}

async function listener(_, { status }, { url }): Promise<void> {
  if (status === 'loading') {
    return
  }

  const validUrls = ['tradingview.com/chart', 'tradingview.com/screener', 'tradingview.com/symbols']
  // filter out invalid url
  if (!validUrls.some(validUrl => new RegExp(validUrl).test(url))) {
    return
  }

  try {
    const currentDate = new Date()

    let { LAST_FETCH_AT } = await browser.storage.local.get('LAST_FETCH_AT')
    LAST_FETCH_AT = new Date(LAST_FETCH_AT)

    // use for testing cache
    // LAST_FETCH_AT.setDate(LAST_FETCH_AT.getDate() - 1)

    const lastFetchAt = isValidDate(LAST_FETCH_AT) ? LAST_FETCH_AT : new Date()
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

async function setListInStorages(response: TSI.RESPONSE_FROM_JSON): Promise<void> {
  try {
    const allExchanges = Object.entries(response).flatMap(([exchange, exchangeData]) => {
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
    // console.log('Shariah list: ', await browser.storage.local.get('LIST'))
  } catch (e) {
    console.error(`Error set shariah storage`, e)
  }
}

async function setExchangeDetailInfoInStorage(response: TSI.RESPONSE_FROM_JSON): Promise<void> {
  try {
    const exchangesDetails: TSI.Flag[] = Object.entries(response).map(([exchange, { updatedAt }]) => ({
      id: exchange,
      updatedAt,
    }))

    await setStorage({ key: StorageKeys.DETAILS, payload: exchangesDetails })
    console.log('Exchanges details: ', await getStorage(StorageKeys.DETAILS))
  } catch (e) {
    console.error(`Error set Exchanges detail in storage`, e)
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
