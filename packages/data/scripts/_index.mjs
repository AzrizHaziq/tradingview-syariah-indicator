import { CONFIG } from './CONFIG.mjs'
import { commitChangesIfAny, delay, isSameWithPreviousData, logCount, prettierJSON, writeToFile } from './utils.mjs'

const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

// eslint-disable-next-line no-extra-semi
;(async () => {
  try {
    // Please make sure the key is unique and taken from TV exchange id
    const [_US, _MYX, _CHINA] = await Promise.all([
      import('./ex_US.mjs').then((m) => m.US()),
      import('./ex_MYX.mjs').then((m) => m.MYX()),
      import('./ex_CHINA.mjs').then((m) => m.CHINA()),
    ])

    await delay(1)

    const { data: US_DATA, human: US_HUMAN } = _US
    const { data: MYX_DATA, human: MYX_HUMAN } = _MYX
    const { data: CHINA_DATA, human: CHINA_HUMAN } = _CHINA
    const data = { ...MYX_DATA, ...US_DATA, ...CHINA_DATA }

    const sortedHuman = []
      .concat(MYX_HUMAN, US_HUMAN, CHINA_HUMAN)
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
