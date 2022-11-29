import { Exchange, ExchangeDetail, MAIN_DEFAULT_EXPORT } from '@app/shared'

import { CONFIG } from './CONFIG.mts'
import { delay, logCount, writeToFile, prettierJSON, commitChangesIfAny, isSameWithPreviousData } from './utils.mts'

const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

// eslint-disable-next-line no-extra-semi
;(async () => {
  try {
    const INDEX_CODES = ['US', 'MYX', 'CHINA', 'IDX']
    const ALL_SHARIAH_LIST: MAIN_DEFAULT_EXPORT[] = await Promise.all(
      INDEX_CODES.map((code) => import(`./ex_${code}.mts`).then((m) => m.default()))
    )

    await delay(1)

    const { allData, allHuman } = ALL_SHARIAH_LIST.reduce(
      (acc, { human, data }) => ({
        allData: { ...acc.allData, ...data },
        allHuman: acc.allHuman.concat(human),
      }),
      { allData: {}, allHuman: [] }
    ) as unknown as {
      allData: MAIN_DEFAULT_EXPORT['data']
      allHuman: MAIN_DEFAULT_EXPORT['human']
    }

    CONFIG.whitelist.forEach(([exchange, code, fullname]: MAIN_DEFAULT_EXPORT['human'][0]) => {
      allHuman.push([exchange, code, fullname])

      // whitelist data will merge into stock-list.json according to exchange
      if (Object.hasOwn(allData, exchange)) {
        allData[exchange].list[code] = [1]
      } else {
        // if not exist then create new
        allData[exchange] = {
          market: '',
          list: { [code]: [1] },
          shape: [{ 0: 'non-s', 1: 's', default: '' }],
          updatedAt: new Date().getTime(),
        }
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

    logCount(allData)

    await writeToFile(CONFIG.mainOutput, JSON.stringify(allData))
    await writeToFile(
      CONFIG.humanOutput,
      await prettierJSON(
        JSON.stringify({
          data: sortedHuman,

          // pluck all updatedAt data from each exchanges
          metadata: Object.entries(allData).reduce((acc, [exchange, detail]: [Exchange, ExchangeDetail]) => {
            acc[exchange] = detail.updatedAt
            return acc
          }, {}) as Record<Exchange, ExchangeDetail['updatedAt']>,
        })
      )
    )

    if (!isCommitSKip) {
      await commitChangesIfAny()
    }

    process.exit()
  } catch (e) {
    console.error('Something wrong with the whole process', e)
    process.exit(1)
  }
})()
