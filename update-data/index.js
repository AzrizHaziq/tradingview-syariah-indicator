import git from 'simple-git'
import merge from 'lodash.merge'
import { writeToFile } from './writeToFile.js'
import { MYX, MYX_FILENAME, myxFilenameTransformer } from './MYX.js'

const MAIN_STOCK_LIST_FILENAME = 'stock-list.json'
const isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron

async function commitChangesIfAny() {
  try {
    await git()
      .add([MAIN_STOCK_LIST_FILENAME])
      .commit('[STOCK_LIST] script_bot: Update with new changes')
  } catch (e) {
    console.error('Error: commit and push stock list changes', e)
    process.exit(1)
  }
}

;(async () => {
  try {
    const MALAYSIA_INFO = await MYX()

    // write to MYX
    await writeToFile(MYX_FILENAME, myxFilenameTransformer(MALAYSIA_INFO))

    // write MAIN_LIST
    await writeToFile(
      MAIN_STOCK_LIST_FILENAME,
      JSON.stringify(merge(MALAYSIA_INFO)) // Please make sure the key is unique and taken from TV flag id
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
