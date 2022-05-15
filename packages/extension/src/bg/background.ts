import browser from 'webextension-polyfill'
import { differenceInDays, format, isDate } from 'date-fns'
import { debounce, getStorage, setStorage } from '../helper'
;(async () => await fetchData())()

browser.runtime.onInstalled.addListener(() => fetchData(true))
browser.tabs.onUpdated.addListener(
  debounce(
    async function listener(_, { status }, { url }): Promise<void> {
      if (status === 'loading') {
        return
      }

      const validUrls = ['tradingview.com/chart', 'tradingview.com/screener', 'tradingview.com/symbols']
      // filter out invalid url
      if (!validUrls.some((validUrl) => new RegExp(validUrl).test(url))) {
        return
      }

      try {
        const LAST_FETCH_AT_STR = await getStorage('LAST_FETCH_AT')
        const LAST_FETCH_AT = new Date(LAST_FETCH_AT_STR)

        // use for testing cache
        // LAST_FETCH_AT.setDate(LAST_FETCH_AT.getDate() - 1)

        const lastFetchAt = isDate(LAST_FETCH_AT) ? LAST_FETCH_AT : new Date()
        const shouldUseCacheValue = differenceInDays(new Date(), lastFetchAt) >= 0

        if (shouldUseCacheValue) {
          console.log('>>> Cache')
        } else {
          console.log('>>> API')
          await fetchData()
        }
      } catch (e) {
        console.error('Error Send message', e)
      }
    },
    500,
    true
  )
)

browser.runtime.onMessage.addListener((req: TSI.EVENT_MSG) => {
  if (req.type === 'invalidate-cache') {
    return setStorage('LAST_FETCH_AT', '')
      .then(() => console.log('>>> INVALIDATE CACHE'))
      .then(() => fetchData(true))
      .then(() => setStorage('LAST_FETCH_AT', new Date().toString()))
  }
})

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
    await setStorage('LAST_FETCH_AT', new Date().toString())
  } catch (e) {
    console.error('Github json when wrong', e)
  }
}

async function setListInStorages(response: TSI.RESPONSE_FROM_JSON): Promise<void> {
  try {
    const allExchanges = Object.entries(response).flatMap(([exchange, exchangeDetail]) => {
      const { shape, list } = exchangeDetail as TSI.ExchangeDetail
      return Object.entries(list).map(([symbol, symbolData]) => {
        const val = symbolData.reduce(
          (acc, value, index) => ({
            ...acc,
            [shape[index].hasOwnProperty(value) ? shape[index][value] : shape[index].default]: value,
          }),
          {} as Record<string, Record<string, number | boolean | string>>
        )

        return [`${exchange}:${symbol}`, val]
      })
    })

    // @ts-ignore
    await setStorage('LIST', allExchanges)
  } catch (e) {
    console.error(`Error set shariah storage`, e)
  }
}

async function setExchangeDetailInfoInStorage(response: TSI.RESPONSE_FROM_JSON): Promise<void> {
  try {
    const exchangesDetails: TSI.Flag[] = Object.entries(response).map(
      ([exchange, { market, updatedAt, list }]: [TSI.Exchange, TSI.ExchangeDetail]) => ({
        id: exchange,
        market,
        counts: Object.keys(list).length,
        updatedAt: isDate(new Date(updatedAt)) ? format(new Date(updatedAt), 'dd LLL yy') : '--',
      })
    )

    await setStorage('DETAILS', exchangesDetails)
  } catch (e) {
    console.error(`Error set Exchanges detail in storage`, e)
  }
}
