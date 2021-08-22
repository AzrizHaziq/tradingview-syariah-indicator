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
    const US_INFO = await US()
    const MYX_INFO = await MYX()

    await writeToFile(
      CONFIG.mainOutput,

      // Please make sure the key is unique and taken from TV exchange id
      JSON.stringify(merge(MYX_INFO, US_INFO))
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
