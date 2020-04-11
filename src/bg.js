/*global tsi */
browser.tabs.onUpdated.addListener(tsi.debounce(listener))

const fetchData = async () => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/AzrizHaziq/tradingview-syariah-indicator/master/stock-list.json')
    return await res.json()
  } catch (e) {
    console.error('Github json when wrong', e)
  }
}

async function listener(id) {
  try {
    const { LAST_FETCH_AT } = (await browser.storage.local.get('LAST_FETCH_AT'))

    const currentDate = new Date()
    const lastFetchAt = tsi.isValidDate(LAST_FETCH_AT)
      ? new Date(LAST_FETCH_AT)
      : new Date()

    const shouldUseCacheValue = tsi.dateDiffInDays(currentDate, lastFetchAt) >= 0

    if (shouldUseCacheValue) {
      console.log('Cache >>>')
      const { SHARIAH_LIST } = (await browser.storage.local.get('SHARIAH_LIST'))
      browser.tabs.sendMessage(id, { list: SHARIAH_LIST })
    } else {
      console.log('API   >>>')
      const { list, updatedAt } = await fetchData()

      await browser.storage.local.set({ 'UPDATED_AT': updatedAt, })
      await browser.storage.local.set({ 'SHARIAH_LIST': list, })
      await browser.storage.local.set({ 'LAST_FETCH_AT': new Date().toString() })

      browser.tabs.sendMessage(id, { list })
    }
  } catch
    (e) {
    console.error('Error Send message', e)
  }
}
