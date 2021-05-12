import fetch from 'node-fetch'

const blackListItems = ['Cash&Other']
const wahedHoldingUrl = 'https://funds.wahedinvest.com/etf-holdings.csv'

function getTickersAndSymbols(csv) {
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d)
  }

  return (
    csv
      .split('\n')
      .filter(Boolean)

      // remove not valid data (eg column header
      .reduce((acc, item) => {
        const [firstCol] = item.split(',')
        return isValidDate(new Date(firstCol)) ? acc.concat(item) : acc
      }, [])

      // get tickers & symbols
      .reduce((acc, item) => {
        const [, , ticker, , symbols] = item.split(',')

        // remove non stock item (sukuk)
        if (blackListItems.some(i => new RegExp(i, 'i').test(ticker))) {
          return acc
        }

        return [...acc, { ticker, symbols }]
      }, [])
  )
}

;(async () => {
  const response = await fetch(wahedHoldingUrl)
  const data = await response.text()
  const d = getTickersAndSymbols(data)

  console.log(d)
})()
