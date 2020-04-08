browser.tabs.onUpdated.addListener(debounce(listener))

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

    const currentDate = new Date()
    const lastFetchAt = isValidDate(LAST_FETCH_AT)
      ? new Date(LAST_FETCH_AT)
      : new Date()

    const shouldUseCacheValue = dateDiffInDays(currentDate, lastFetchAt) >= 0

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

/**
 * 0 = same date
 * +ve = a < b
 * -ve, a > b
 *
 * @param a {Date}
 * @param b {Date}
 * @returns {number}
 */
function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor((utc2 - utc1) / _MS_PER_DAY)
}

function debounce(func, wait, immediate) {
  let timeout

  return function executedFunction() {
    const context = this
    const args = arguments

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait = 500)

    if (callNow) func.apply(context, args)
  }
}

function isValidDate(d) {
  d = new Date();
  return d instanceof Date && !isNaN(d);
}
