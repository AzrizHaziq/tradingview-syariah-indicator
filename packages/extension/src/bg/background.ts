import { browser } from 'webextension-polyfill-ts'
import { dateDiffInDays, debounce, initGa, isValidDate } from '../helper'

initGa()
browser.tabs.onUpdated.addListener(debounce(listener, 500, true))

const fetchData = async (shouldRefreshData = false): Promise<Record<'MYX', TSI.SHARIAH_LIST>> => {
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

// just trigger get first in bg script
fetchData()

const validUrls = ['tradingview.com/chart', 'tradingview.com/screener', 'tradingview.com/symbols']

async function listener(id, { status }, { url }) {
  if (status === 'loading') {
    return
  }

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
      const { MYX } = await fetchData()
      await setMYXStorages(MYX)

      await browser.storage.local.set({ LAST_FETCH_AT: new Date().toString() })
    }
  } catch (e) {
    console.error('Error Send message', e)
  }
}

async function setMYXStorages({ list, updatedAt }: TSI.SHARIAH_LIST): Promise<void> {
  try {
    await browser.storage.local.set({
      MYX: {
        list, // must save in list key
        updatedAt,
      },
    })
  } catch (e) {
    console.error('Error set MYX storage', e)
  }
}

browser.runtime.onMessage.addListener((request: TSI.EVENT_MSG) => {
  if (request.type === 'ga') {
    if (request.subType === 'pageview') {
      ga('send', 'pageview', request.payload)
    }

    if (request.subType === 'event') {
      ga('send', {
        hitType: 'event',
        ...request.payload,
      })
    }
  }

  if (request.type === 'invalidate-cache') {
    return browser.storage.local
      .set({ LAST_FETCH_AT: null })
      .then(() => console.log('>>> INVALIDATE CACHE'))
      .then(() => fetchData(true))
      .then(({ MYX }) => setMYXStorages(MYX))
      .then(() => browser.storage.local.set({ LAST_FETCH_AT: new Date().toString() }))
  }
})
