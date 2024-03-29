import fetch from 'node-fetch'
import { MAIN_DEFAULT_EXPORT } from '@app/shared'
import { PromisePool } from '@supercharge/promise-pool'

import { pipe } from './utils.mjs'
import { CONFIG } from './CONFIG.mjs'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })

type tempUS = { ticker: string; fullname: string }

/** Main NYSE & NASDAQ & AMAX & OTC scrape function */
export default async function (): Promise<MAIN_DEFAULT_EXPORT> {
  try {
    const response = await fetch(CONFIG.US.wahedHoldingUrl)
    const responseText = await response.text()
    const updatedAt = new Date(prettierCSV(responseText)[0].split(',')[0]).getTime()

    return await pipe(
      prettierCSV,
      transformToTickersAndSymbols,
      (data) => data.slice(0, CONFIG.isDev ? 10 : data.length),
      (data) => {
        progressBar.setTotal(data.length)
        return data
      },
      runTaskSequentially,
      finalOutput(updatedAt)
    )(responseText)
  } catch (e) {
    throw Error(`Error generating US stock`, { cause: e })
  }
}

// https://www.tradingview.com/symbols/NYSE-A/
const getExchange = <T extends tempUS>(item: T): Promise<T & { exchange: string }> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    for (const exchange of CONFIG.US.exchanges) {
      try {
        const response = await fetch(`https://www.tradingview.com/symbols/${exchange}-${item.ticker}/`)
        // console.log(response.status === 200 ? '\x1b[31m' : '\x1b[36m'`${response.status}:${item.ticker}:${exchange}`)

        // only expect status code to be 200 and 404
        if (![200, 404].includes(response.status)) {
          reject(new Error(`(getExchange): status code diff than 200 & 404: ${exchange}:${item.ticker}`))
        }

        if (response.status === 200) {
          progressBar.increment(1, { stats: `${exchange}-${item.ticker}` })
          resolve({ ...item, exchange })
          break
        } else if (exchange === CONFIG.US.exchanges[CONFIG.US.exchanges.length - 1]) {
          // if all exchanges failed, then just resolve it and remove it later
          resolve(null)
        }
      } catch (e) {
        if (exchange === CONFIG.US.exchanges[CONFIG.US.exchanges.length - 1]) {
          reject(new Error(`(getExchange): failed whole process ${exchange}:${item.ticker}: ${e}`))
        } else {
          continue
        }
      }
    }
  })

function prettierCSV(csv: string): string[] {
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

function transformToTickersAndSymbols(data: string[]): tempUS[] {
  return data // get tickers & symbols
    .reduce((acc, item) => {
      const [, , ticker, , fullname] = item.split(',')

      // remove non stock item (sukuk)
      if (CONFIG.US.blackListItems.some((i) => new RegExp(i, 'i').test(ticker))) {
        return acc
      }

      return [...acc, { ticker, fullname }]
    }, [])
}

async function runTaskSequentially(tasks: tempUS[]) {
  try {
    const { results, errors } = await PromisePool.for(tasks).process(async (item) => await getExchange(item))

    if (errors.length) {
      throw Error(`failed runTaskSequentially`, { cause: errors })
    }

    return results.filter(Boolean).reduce<MAIN_DEFAULT_EXPORT>(
      (acc, item) => {
        // shape final output
        acc.data[item.exchange][item.ticker] = [1]
        acc.human.push([item.exchange, item.ticker, item.fullname])
        return acc
      },
      { human: [], data: CONFIG.US.exchanges.reduce((acc, exchange) => ({ ...acc, [exchange]: {} }), {}) }
    )
  } catch (e) {
    console.error(e)
  }
}

const finalOutput = (updatedAt: number) => (p: Promise<MAIN_DEFAULT_EXPORT>) =>
  p.then(({ data, human }) => ({
    human,
    data: Object.entries(data).reduce(
      (acc, [k, v]) => ({
        ...acc,
        ...(Object.keys(v).length
          ? {
              [k]: {
                updatedAt,
                list: v,
                shape: CONFIG.US.shape,
                market: CONFIG.US.market,
              },
            }
          : {}),
      }),
      {}
    ),
  }))
