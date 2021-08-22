import fetch from 'node-fetch'
import { delay } from '../utils.mjs'
import { writeToFile } from '../writeToFile.mjs'

const config = {
  FgRed: '\x1b[31m',
  FgCyan: '\x1b[36m',
  blackListItems: ['Cash&Other'],
  exchanges: ['NYSE', 'NASDAQ', 'AMAX', 'OTC'],
  wahedHoldingUrl: 'https://funds.wahedinvest.com/etf-holdings.csv',
}

const isWait = spec => spec.task === 'wait'

function transformToTickersAndSymbols(csv) {
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
        if (config.blackListItems.some(i => new RegExp(i, 'i').test(ticker))) {
          return acc
        }

        return [...acc, { ticker, symbols }]
      }, [])
  )
}

/**
 * https://www.tradingview.com/symbols/NYSE-A/
 * @param {Object} item - item from WHAD ETF
 * @param {string} item.ticker - Company code
 * @param {string} item.symbols - Company fullname
 * @returns {Promise<string>}
 */
const getExchange = item =>
  new Promise(async (res, rej) => {
    for await (const exchange of config.exchanges) {
      try {
        const response = await fetch(`https://www.tradingview.com/symbols/${exchange}-${item.ticker}/`)
        console.log(
          response.status === 200 ? config.FgCyan : config.FgRed,
          `${response.status}:${item.ticker}:${exchange}`
        )

        // only expect status code to be 200 and 404
        if (![200, 404].includes(response.status)) {
          rej(`Failed (getExchanged): status code diff than 200 & 404: ${exchange}:${item.ticker}`)
        }

        if (response.status === 200) {
          res({ ...item, exchange })
          break
          // if all exchanges failed, then search that stock if it is really exist
        } else if (exchange === config.exchanges[config.exchanges.length - 1]) {
          rej(`Failed (getExchanged): all exchanges failed: ${exchange}:${item.ticker}`)
        }
      } catch (e) {
        rej(`Failed (getExchanged): ${exchange}:${item.ticker}: ${e}`)
      }
    }
  })

;(async () => {
  try {
    const response = await fetch(config.wahedHoldingUrl)
    const data = await response.text()
    const list = transformToTickersAndSymbols(data)

    const tasks = list
      .flatMap((item, index) => [item, index + 1 === list.length ? null : { task: 'wait' }])
      .filter(Boolean)

    const listWithExchanges = await tasks.reduce(
      async (p, spec) =>
        p.then(acc =>
          (isWait(spec) ? delay() : getExchange(spec))
            .then(item => {
              if (isWait(spec)) {
                return acc
              } else {
                return acc.concat(item)
              }
            })
            .catch(console.error)
        ),
      Promise.resolve([])
    )

    await writeToFile('summary/US.json', JSON.stringify(listWithExchanges, null, 2))
  } catch (e) {
    throw Error(`Error at getting US stock: ${e}`)
  }
})()
