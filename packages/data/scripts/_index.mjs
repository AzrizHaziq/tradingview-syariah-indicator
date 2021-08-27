import { CONFIG } from './CONFIG.mjs'
import { gitCommand, logCount, writeToFile } from './utils.mjs'

const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

async function commitChangesIfAny() {
  try {
    await gitCommand('add', 'stock-list*.json')
    await gitCommand('commit', '-m [STOCK_LIST] script_bot: Update with new changes')
  } catch (e) {
    console.error('Error commit', e)
    process.exit(1)
  }
}

// eslint-disable-next-line no-extra-semi
;(async () => {
  try {
    // Please make sure the key is unique and taken from TV exchange id
    const [_MYX, _US] = await Promise.all([
      import('./ex_US.mjs').then(m => m.US()),
      import('./ex_MYX.mjs').then(m => m.MYX()),
    ])

    const updatedAt = Date.now()
    const { data: US_DATA, human: US_HUMAN } = _US
    const { data: MYX_DATA, human: MYX_HUMAN } = _MYX

    console.log('\n')
    logCount(US_DATA)
    logCount(MYX_DATA)

    await writeToFile(
      CONFIG.humanOutput,
      JSON.stringify({ data: [...MYX_HUMAN, ...US_HUMAN], metadata: { updatedAt } })
    )

    await writeToFile(
      CONFIG.mainOutput,
      JSON.stringify({
        ...MYX_DATA,
        ...US_DATA,
        metadata: { updatedAt },
      })
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
