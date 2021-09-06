import fetch from 'node-fetch'
import { CONFIG } from './config.mjs'
import { delay, pipe } from './utils.mjs'

const progressBar = CONFIG.progressBar.create(100)

const isWait = spec => spec.task === 'wait'

function transformToTickersAndSymbols(data) {
  return data // get tickers & symbols
    .reduce((acc, item) => {
      const [, , ticker, , symbols] = item.split(',')

      // remove non stock item (sukuk)
      if (CONFIG.US.blackListItems.some(i => new RegExp(i, 'i').test(ticker))) {
        return acc
      }

      return [...acc, { ticker, symbols }]
    }, [])
}

function prettierCSV(csv) {
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
  )
}

// https://www.tradingview.com/symbols/NYSE-A/
const getExchange = item =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    for (const exchange of CONFIG.US.exchanges) {
      try {
        const response = await fetch(`https://www.tradingview.com/symbols/${exchange}-${item.ticker}/`)
        // console.log(response.status === 200 ? '\x1b[31m' : '\x1b[36m'`${response.status}:${item.ticker}:${exchange}`)

        // only expect status code to be 200 and 404
        if (![200, 404].includes(response.status)) {
          reject(new Error(`Failed (getExchanged): status code diff than 200 & 404: ${exchange}:${item.ticker}`))
        }

        if (response.status === 200) {
          resolve({ ...item, exchange })
          break
          // if all exchanges failed, then search that stock if it is really exist
        } else if (exchange === CONFIG.US.exchanges[CONFIG.US.exchanges.length - 1]) {
          reject(new Error(`Failed (getExchanged): all exchanges failed: ${exchange}:${item.ticker}`))
        }
      } catch (e) {
        reject(new Error(`Failed (getExchanged): ${exchange}:${item.ticker}: ${e}`))
      }
    }
  })

function createTasks(list) {
  return list.flatMap((item, index) => [item, index + 1 === list.length ? null : { task: 'wait' }]).filter(Boolean)
}

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
              acc.human.push([item.exchange, item.ticker, spec.symbols])
              progressBar.increment()
            }

            return acc
          })
          .catch(console.error)
      ),
    Promise.resolve({ data, human })
  )
}

const finalOutput = updatedAt => p => {
  return p.then(({ data, human }) => ({
    human,
    data: Object.entries(data).reduce(
      (acc, [k, v]) => ({
        ...acc,
        ...(Object.keys(v).length ? { [k]: { updatedAt, shape: CONFIG.US.shape, list: v } } : {}),
      }),
      {}
    ),
  }))
}

export async function US() {
  try {
    const response = await fetch(CONFIG.US.wahedHoldingUrl)
    const responseText = await response.text()

    let updatedAt = prettierCSV(responseText)[0].split(',')[0]
    const [m, d, y] = updatedAt.split('/')
    updatedAt = new Date(y, m - 1, d).getTime()

    return await pipe(
      prettierCSV,
      transformToTickersAndSymbols,
      // data => data.slice(0, 10),
      data => {
        progressBar.setTotal(data.length)
        return data
      },
      createTasks,
      runTaskSequentially,
      finalOutput(updatedAt)
    )(responseText)
  } catch (e) {
    throw Error(`Error generating US stock: ${e}`)
  }
}
