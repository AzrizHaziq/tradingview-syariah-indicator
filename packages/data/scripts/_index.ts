import { disconnect } from 'process';
import { CONFIG } from './config.mjs'
import { ScrapeResult } from './model.mjs';
import { delay, logCount, writeToFile, prettierJSON, commitChangesIfAny, isSameWithPreviousData } from './utils.mjs'

const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

// eslint-disable-next-line no-extra-semi
;(async () => {
  try {
    const INDEX_CODES = ['MYX'] // ['US', 'MYX', 'CHINA', 'IDX']
    const ALL_SHARIAH_LIST: ScrapeResult[] = await Promise.all(
      INDEX_CODES.map((code) => import(`./ex-${code.toLowerCase()}.mjs`)
        .then(m => m.default()))
    )

    await delay(1)

    const allData = ALL_SHARIAH_LIST.reduce((mergedData, data) => mergedData = {...mergedData, ...data}, {})
    let allHuman: [exchange: string, code: string, name: string][] = []

    Object.entries(allData).forEach(([exchangeCode, val]) => {
        allHuman = allHuman.concat(val.stocks.map(s => {return [ exchangeCode, s.code, s.name ]}))
      })

    CONFIG.whitelist.forEach(([exchangeCode, code, fullname]) => {
      allHuman.push([exchangeCode, code, fullname])

      // whitelist data will merge into stock-list.json according to exchange
      if (Object.keys(allData).includes(exchangeCode)) {
        allData[exchangeCode].stocks.push({code, name: 'ABC'})
      } else {
        // if not exist then create new
        allData[exchangeCode] = { stocks: [{code, name: 'ABC'}], updatedAt: new Date(), market: 'unknown' }
      }
    })

    // sort stock by company name > code > exchange
    const sortedHuman = allHuman
      .sort(([a1, a2, a3], [b1, b2, b3]) => {
        if (a2 === b2 && a3 === b3) return a1 > b1 ? 1 : a1 < b1 ? -1 : 0 // sort by exchange
        if (a3 === b3) return a2 > b2 ? 1 : a2 < b2 ? -1 : 0 // sort by code
        return a3 > b3 ? 1 : a3 < b3 ? -1 : 0 // by default use company name to sort
      })
      // sometimes we are unable to parse correctly CHINA exchange code, so remove all empty code
      .filter(([, code]) => code)

    console.log('\n')
    if (isSameWithPreviousData(sortedHuman)) {
      console.log('Previous data and current data is same, hence skip commit')
      process.exit()
    }

    const adaptedAllData = adapt(allData)
    logCount(adaptedAllData)

    await writeToFile(CONFIG.mainOutput, JSON.stringify(adaptedAllData))
    await writeToFile(
      CONFIG.humanOutput,
      await prettierJSON(
        JSON.stringify({
          data: sortedHuman,

          // pluck all updatedAt data from each exchanges
          metadata: Object.entries(allData).reduce((acc: any, [exchange, detail]) => {
            acc[exchange] = detail.updatedAt
            return acc
          }, {}),
        })
      )
    )

    if (!isCommitSKip) {
      await commitChangesIfAny()
    }

    process.exit()
  } catch (e) {
    console.log('Something wrong with the whole process', e)
    process.exit(1)
  }
})()

function adapt(allData: ScrapeResult) : {
  [exchange: string]: {
    updatedAt: number,
    list: {
      [code: string]: [1]
    },
    shape: any,
    market: string
  }
} {
  let adapted = {}
  for (let [exchange, data] of Object.entries(allData)) {
    adapted[exchange] = {
      updatedAt: data.updatedAt.getTime(),
      list: data.stocks.reduce((dic, stock) => {
        dic[stock.code] = [1]
        return dic
      }, {}),
      market: data.market,
      shape: [
        {
          "0": "non-s",
          "1": "s",
          "default": ""
        }
      ]
    }
  }

  return adapted
}