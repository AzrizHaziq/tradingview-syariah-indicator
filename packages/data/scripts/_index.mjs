import { CONFIG } from './CONFIG.mjs'
import { commitChangesIfAny, delay, isSameWithPreviousData, logCount, prettierJSON, writeToFile } from './utils.mjs'

const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

// eslint-disable-next-line no-extra-semi
;(async () => {
  try {
    // Please make sure the key is unique and taken from TV exchange id
    const [_US, _MYX, _CHINA] = await Promise.all([
      import('./ex_US.mjs').then(m => m.US()),
      import('./ex_MYX.mjs').then(m => m.MYX()),
      import('./ex_CHINA.mjs').then(m => m.CHINA()),
    ])

    await delay(1)

    const { data: US_DATA, human: US_HUMAN } = _US
    const { data: MYX_DATA, human: MYX_HUMAN } = _MYX
    const { data: CHINA_DATA, human: CHINA_HUMAN } = _CHINA
    const data = { ...MYX_DATA, ...US_DATA, ...CHINA_DATA }

    const sortedHuman = []
      .concat(MYX_HUMAN, US_HUMAN, CHINA_HUMAN)
      .sort(([, , a], [, , b]) => (a > b ? 1 : a < b ? -1 : 0))

    if (isSameWithPreviousData(sortedHuman)) {
      console.log('Previous data and current data is same, hence skip commit')
      process.exit()
    }

    console.log('\n')
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
