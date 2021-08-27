import fetch from 'node-fetch'
import { CONFIG } from './config.mjs'
import { delay, pipe } from './utils.mjs'

let progressBar = undefined

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
        if (CONFIG.US.blackListItems.some(i => new RegExp(i, 'i').test(ticker))) {
          return acc
        }

        return [...acc, { ticker, symbols }]
      }, [])
  )
}

/**
 * https://www.tradingview.com/symbols/NYSE-A/
 * @param {BeforeGetExchange} item
 * @returns {Promise<AfterGetExchange>}
 */
const getExchange = item =>
  new Promise(async (res, rej) => {
    progressBar.increment()
    for await (const exchange of CONFIG.US.exchanges) {
      try {
        const response = await fetch(`https://www.tradingview.com/symbols/${exchange}-${item.ticker}/`)
        // console.log(response.status === 200 ? '\x1b[31m' : '\x1b[36m'`${response.status}:${item.ticker}:${exchange}`)

        // only expect status code to be 200 and 404
        if (![200, 404].includes(response.status)) {
          rej(`Failed (getExchanged): status code diff than 200 & 404: ${exchange}:${item.ticker}`)
        }

        if (response.status === 200) {
          res({ ...item, exchange })
          break
          // if all exchanges failed, then search that stock if it is really exist
        } else if (exchange === CONFIG.US.exchanges[CONFIG.US.exchanges.length - 1]) {
          rej(`Failed (getExchanged): all exchanges failed: ${exchange}:${item.ticker}`)
        }
      } catch (e) {
        rej(`Failed (getExchanged): ${exchange}:${item.ticker}: ${e}`)
      }
    }
  })

/**
 * @param {AfterGetExchange[]} list
 */
function createTasks(list) {
  return list.flatMap((item, index) => [item, index + 1 === list.length ? null : { task: 'wait' }]).filter(Boolean)
}

/**
 * @param {(Tasks|AfterGetExchange)[]} tasks
 * @returns {Promise}
 */
function runTaskSequentially(tasks) {
  const human = []
  const data = CONFIG.US.exchanges.reduce((acc, exchange) => ({ ...acc, [exchange]: {} }), {})

  return tasks.reduce(
    async (p, spec) =>
      p.then(acc =>
        (isWait(spec) ? delay() : getExchange(spec))
          .then(item => {
            if (!isWait(spec)) {
              acc.data[item.exchange][item.ticker] = [1] // shape final output
              acc.human.push({ code: `${item.exchange}-${item.ticker}`, fullname: spec.symbols })
            }

            return acc
          })
          .catch(console.error)
      ),
    Promise.resolve({ data, human })
  )
}

/**
 * @param {Promise<Object>} p
 * @returns {Promise<Exchange>}
 */
function finalOutput(p) {
  return p.then(({ data, human }) => ({
    human,
    data: Object.entries(data).reduce(
      (acc, [k, v]) => ({
        ...acc,
        ...(Object.keys(v).length ? { [k]: { shape: CONFIG.US.shape, list: v } } : {}),
      }),
      {}
    ),
  }))
}

/**
 * @returns {Promise<{ data: Exchange; human: Object[]}>}
 */
export async function US() {
  try {
    const response = await fetch(CONFIG.US.wahedHoldingUrl)
    const responseText = await response.text()

    return await pipe(
      transformToTickersAndSymbols,
      // data => data.slice(0, 5),
      data => {
        progressBar = CONFIG.progressBar.create(data.length, 0)
        return data
      },
      createTasks,
      runTaskSequentially,
      finalOutput
    )(responseText)
  } catch (e) {
    throw Error(`Error generating US stock: ${e}`)
  }
}

/**
 * @typedef {Object} BeforeGetExchange
 * @property {string} ticker - company code
 * @property {string} symbols - company full name
 */

/**
 * @typedef {Object} AfterGetExchange
 * @property {string} ticker - company code
 * @property {string} symbols - company full name
 * @property {string} exchange - company's exchange
 */

/**
 * @typedef {Object} Tasks
 * @property {wait} task
 */

/**
 * @typedef {Object} ExchangeItem
 * @property {Array.<Object>} shape
 * @property {Record<string, [number]>} list
 */

/**
 * @typedef {Object} Exchange
 * @property {Record<string, ExchangeItem>} e
 */
