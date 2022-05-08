import { CONFIG } from './CONFIG.mjs'
import {
  delay,
  logCount,
  writeToFile,
  prettierJSON,
  returnEmptyData,
  commitChangesIfAny,
  isSameWithPreviousData,
} from './utils.mjs'

const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

// eslint-disable-next-line no-extra-semi
;(async () => {
  try {
    // Please make sure the key is unique and taken from TV exchange id
    const [US, MYX, CHINA, IDX] = await Promise.all([
      // US
      // returnEmptyData(CONFIG.US.exchanges),
      import('./ex_US.mjs').then((m) => m.default()),

      // MALAYSIA
      // returnEmptyData(CONFIG.MYX.exchanges),
      import('./ex_MYX.mjs').then((m) => m.default()),

      // CHINA
      // returnEmptyData(CONFIG.CHINA.exchanges),
      import('./ex_CHINA.mjs').then((m) => m.default()),

      // IDX
      // returnEmptyData(CONFIG.IDX.exchanges),
      import('./ex_IDX.mjs').then((m) => m.default()),
    ])

    await delay(1)

    const { data: US_DATA, human: US_HUMAN } = US
    const { data: MYX_DATA, human: MYX_HUMAN } = MYX
    const { data: IDX_DATA, human: IDX_HUMAN } = IDX
    const { data: CHINA_DATA, human: CHINA_HUMAN } = CHINA

    // sort stock by company name > code > exchange
    const sortedHuman = []
      .concat(MYX_HUMAN, US_HUMAN, CHINA_HUMAN, IDX_HUMAN, CONFIG.whitelist)
      .sort(([a1, a2, a3], [b1, b2, b3]) => {
        if (a2 === b2 && a3 === b3) return a1 > b1 ? 1 : a1 < b1 ? -1 : 0 // sort by exchange
        if (a3 === b3) return a2 > b2 ? 1 : a2 < b2 ? -1 : 0 // sort by code
        return a3 > b3 ? 1 : a3 < b3 ? -1 : 0 // by default use company name to sort
      })
      .filter(([, code]) => code)

    console.log('\n')
    if (isSameWithPreviousData(sortedHuman)) {
      console.log('Previous data and current data is same, hence skip commit')
      process.exit()
    }

    const data = { ...US_DATA, ...CHINA_DATA, ...MYX_DATA, ...IDX_DATA }

    // this should be depended on the exchange shape, I'm too lazy atm.
    // whitelist data will merge into stock-list.json according to exchange
    CONFIG.whitelist.forEach(([exchange, name]) => {
      if (Object.hasOwn(data, exchange)) {
        data[exchange].list[name] = [1]
      } else {
        // if not exist then create new
        data[exchange] = { list: { [name]: [1] } }
      }
    })

    logCount(data)

    await writeToFile(CONFIG.mainOutput, JSON.stringify(data))
    await writeToFile(
      CONFIG.humanOutput,
      await prettierJSON(
        JSON.stringify({
          data: sortedHuman,

          // pluck all updatedAt data from each exchanges
          metadata: Object.entries(data).reduce((acc, [exchange, detail]) => {
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
    console.error('Something wrong with the whole process', e)
    process.exit(1)
  }
})()
