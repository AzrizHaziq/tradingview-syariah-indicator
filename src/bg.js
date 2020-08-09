/* global tsi */
browser.tabs.onUpdated.addListener(tsi.debounce(listener, 500, true))

const fetchData = async() => {
  const jsonUrl = 'https://raw.githubusercontent.com/AzrizHaziq/tradingview-syariah-indicator/master/stock-list.json'

  try {
    const res = await fetch(jsonUrl)
    return await res.json()
  } catch (e) {
    console.error('Github json when wrong', e)
  }
}

// just trigger get first in bg script
fetchData()

const validUrls = [
  'tradingview.com/chart',
  'tradingview.com/screener',
  'tradingview.com/symbols'
]

async function listener(id, { status }, { url }) {
  if (status === 'loading') {
    return
  }

  // filter out invalid url
  if (!validUrls.some(validUrl => new RegExp(validUrl).test(url))) {
    return
  }

  try {
    const { LAST_FETCH_AT } = (await browser.storage.local.get('LAST_FETCH_AT'))

    const currentDate = new Date()
    const lastFetchAt = tsi.isValidDate(LAST_FETCH_AT)
      ? new Date(LAST_FETCH_AT)
      : new Date()

    const shouldUseCacheValue = tsi.dateDiffInDays(currentDate, lastFetchAt) >= 0

    if (shouldUseCacheValue) {
      console.log('>>> Cache')
    } else {
      console.log('>>> API')
      const { list, updatedAt, mscAt, mscLink } = await fetchData()

      await browser.storage.local.set({ 'MSC_AT': mscAt, })
      await browser.storage.local.set({ 'MSC_LINK': mscLink, })
      await browser.storage.local.set({ 'SHARIAH_LIST': list, })
      await browser.storage.local.set({ 'UPDATED_AT': updatedAt, })
      await browser.storage.local.set({ 'LAST_FETCH_AT': new Date().toString() })
    }
    const { SHARIAH_LIST } = (await browser.storage.local.get('SHARIAH_LIST'))
    browser.tabs.sendMessage(id, { list: SHARIAH_LIST })
    return await SHARIAH_LIST
  } catch (e) {
    console.error('Error Send message', e)
  }
}
