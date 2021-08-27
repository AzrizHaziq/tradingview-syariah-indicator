import git from 'simple-git'
import merge from 'lodash.merge'
import { US } from './ex_US.mjs'
import { MYX } from './ex_MYX.mjs'
import { CONFIG } from './CONFIG.mjs'
import { writeToFile } from './utils.mjs'

const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

async function commitChangesIfAny() {
  try {
    await git().add([CONFIG.mainOutput]).commit('[STOCK_LIST] script_bot: Update with new changes')
  } catch (e) {
    console.error('Error: commit and push stock list changes', e)
    process.exit(1)
  }
}

// eslint-disable-next-line no-extra-semi
;(async () => {
  try {
    // Please make sure the key is unique and taken from TV exchange id
    const [_US, _MYX] = await Promise.all([US(), MYX()])

    const { data: US_DATA, human: US_HUMAN } = _US
    const { data: MYX_DATA, human: MYX_HUMAN } = _MYX
    const updatedAt = Date.now()

    await writeToFile(
      CONFIG.humanOutput,
      JSON.stringify({ data: [...MYX_HUMAN, ...US_HUMAN], metadata: { updatedAt } })
    )

    await writeToFile(CONFIG.mainOutput, JSON.stringify(merge(MYX_DATA, US_DATA, { metadata: { updatedAt } })))

    if (!isCommitSKip) {
      await commitChangesIfAny()
    }

    process.exit()
  } catch (e) {
    console.error('Something wrong with the whole process', e)
    process.exit(1)
  }
})()
