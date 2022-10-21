import fetch from 'node-fetch'
import { pipe } from './utils.mjs'
import { CONFIG } from './config.mjs'
import { PromisePool } from '@supercharge/promise-pool'
import { ScrapeResult } from './model.mjs'
import 'error-cause/auto'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })

function transformToTickersAndSymbols(csvLines: string[]): { ticker: string, fullname: string }[] {
  return csvLines // get tickers & symbols
    .reduce((acc, item) => {
      const [, , ticker, , fullname] = item.split(',')

      // remove non stock item (sukuk)
      if (CONFIG.US.blackListItems.some((i) => new RegExp(i, 'i').test(ticker))) {
        return acc
      }

      return [...acc, { ticker, fullname }]
    }, [] as { ticker: string, fullname: string }[])
}

function prettifyCSV(csv: string): string[] {
  function isValidDate(d: Date) {
    return !isNaN(d.getTime())
  }

  return (
    csv
      .split('\n')
      .filter(Boolean)

      // remove not valid data (eg column header
      .reduce((acc, item) => {
        const [firstCol] = item.split(',')
        return isValidDate(new Date(firstCol)) ? acc.concat(item) : acc
      }, [] as string[])
  )
}

// https://www.tradingview.com/symbols/NYSE-A/
function getExchange(item: {ticker: string, fullname: string}): Promise<{exchange: string, ticker: string, fullname: string}> {
  return new Promise(async (resolve, reject) => {
    for (const exchange of CONFIG.US.exchanges) {
      try {
        const response = await fetch(`https://www.tradingview.com/symbols/${exchange}-${item.ticker}/`)
        // console.log(`${response.status}:${item.ticker}:${exchange}`)

        // only expect status code to be 200 and 404
        if (![200, 404].includes(response.status)) {
          reject(new Error(`Failed (getExchanged): status code diff than 200 & 404: ${exchange}:${item.ticker}`))
        }

        if (response.status === 200) {
          progressBar.increment(1, { stats: `${exchange}-${item.ticker}` })
          resolve({ ...item, exchange })
          break
          // if all exchanges failed, then search that stock if it is really exist
        } else if (exchange === CONFIG.US.exchanges[CONFIG.US.exchanges.length - 1]) {
          // TODO: check if this logic correct. Because it was stuck forever
          // continue
          reject(new Error(`Failed (getExchanged): all exchanges failed: ${exchange}:${item.ticker}`))
        }
      } catch (e) {
        reject(new Error(`Failed (getExchanged): ${exchange}:${item.ticker}: ${e}`))
      }
    }

    reject(new Error(`Failed (getExchanged): 'exitloop':${item.ticker}: exitloop`))
  })
}

async function runTaskSequentially(tasks: [{ticker: string, fullname: string}]): Promise<{
    [exchange: string]: {
      stocks: {code: string, name: string}[]
    }
  }> {
  const { results, errors } = await PromisePool.for(tasks).process(async (item) => await getExchange(item))

  // Simply skip those failed to check
  // if (errors.length) {
  //   throw new Error(`failed runTaskSequentially`, { cause: errors })
  // }

  return results.reduce(
    (acc, item) => {
      // shape final output
      if (!acc[item.exchange]) {
        acc[item.exchange] = {
          stocks: []
        }
      }
      acc[item.exchange].stocks.push({code: item.ticker, name: item.fullname})

      return acc
    }, {})
}

function finalOutput(updatedAt: Date) {
  return (p: Promise<{
                      [exchange: string]: {
                        stocks: {code: string, name: string}[]
                      }
                    }>) => {
    return p.then(exchangeData => {
      const data: ScrapeResult = Object.entries(exchangeData).reduce(
        (finData, [exchange, data]) => ({
          ...finData,
          ...(data.stocks.length
            ? {
                [exchange]: {
                  updatedAt,
                  stocks: data.stocks,
                  // shape: CONFIG.US.shape,
                  market: CONFIG.US.market,
                },
              }
            : {}),
        }),
        {}
      )

      return data;
    }).catch(e => {
      console.error('Failed to process', e)
    })
  }
}

/**
 * Main NYSE & NASDAQ & AMAX & OTC scrape function
 * */
export default async function(): Promise<ScrapeResult> {
  try {
    const response = await fetch(CONFIG.US.wahedHoldingUrl)
    const responseText = await response.text()

    const prettyCsv = prettifyCSV(responseText)
    let updatedAtStr = prettyCsv[prettyCsv.length - 1].split(',')[0]
    const [m, d, y] = updatedAtStr.split('-')
    const updatedAt = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))

    return await pipe(
      transformToTickersAndSymbols,
      (data) => data.slice(0, CONFIG.isDev ? 10 : data.length),
      (data) => {
        progressBar.setTotal(data.length)
        return data
      },
      runTaskSequentially,
      finalOutput(updatedAt)
    )(prettyCsv)
  } catch (e) {
    throw new Error(`Error generating US stock`, { cause: e })
  }
}
