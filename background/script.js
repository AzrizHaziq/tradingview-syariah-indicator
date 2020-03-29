browser.tabs.onUpdated.addListener(listener)

const fetchData = async () => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/AzrizHaziq/tradingview-syariah-indicator/master/background/stock-list.json')
    return await res.json()
  } catch (e) {
    console.error('Github json when wrong', e)
  }
}

async function listener(id) {
  try {
    const { LAST_FETCH_AT } = (await browser.storage.local.get('LAST_FETCH_AT'))

    if (LAST_FETCH_AT) {
      console.log('Cache >>>')
      const { SHARIAH_LIST } = (await browser.storage.local.get('SHARIAH_LIST'))
      browser.tabs.sendMessage(id, { list: SHARIAH_LIST })
    } else {
      console.log('API   >>>')
      const { list, updatedAt } = await fetchData()

      await browser.storage.local.set({ 'UPDATED_AT': updatedAt, })
      await browser.storage.local.set({ 'SHARIAH_LIST': list, })
      await browser.storage.local.set({ 'LAST_FETCH_AT': new Date() })

      browser.tabs.sendMessage(id, { list })
    }
  } catch
    (e) {
    console.error('Error Send message', e)
  }
}

