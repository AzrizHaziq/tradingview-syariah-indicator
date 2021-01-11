/* global tsi */
browser.tabs.onUpdated.addListener(tsi.debounce(listener, 500, true))

const fetchData = async () => {
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
    const lastFetchAt = tsi.isValidDate(LAST_FETCH_AT) ? new Date(LAST_FETCH_AT) : new Date()

    const shouldUseCacheValue = tsi.dateDiffInDays(currentDate, lastFetchAt) >= 0

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

async function setMYXStorages({ list, updatedAt, mscAt, mscLink }) {
  try {
    await browser.storage.local.set({
      MYX: {
        list, // must save in list key
        mscAt,
        mscLink,
        updatedAt,
      },
    })
  } catch (e) {
    console.error('Error set MYX storage', e)
  }
}

// prettier-ignore
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r
  ;(i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments)
    }),
    (i[r].l = 1 * new Date())
  ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
  a.async = 1
  a.src = g
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', `https://www.google-analytics.com/analytics.js?id=${tsi.GA}`, 'ga')
ga('create', tsi.GA, 'auto')
ga('set', 'checkProtocolTask', function () {})

browser.runtime.onMessage.addListener(request => {
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
})
