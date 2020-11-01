import fs from 'fs'
import ExcelJS from 'exceljs'
import git from 'simple-git'
import merge from 'lodash.merge'
import playWright from 'playwright'
import cliProgress from 'cli-progress'

const TRADING_VIEW_MYR = 'MYX'
const STOCK_LIST_FILENAME = 'stock-list.json'
const STOCK_LIST_READ_ONLY_FILENAME = 'stock-readonly-list.json'
const isCommitSKip = process.argv.slice(2).includes('skip-commit')  // for github-action cron
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

async function scrapBursaMalaysia() {
  const { chromium } = playWright

  const scrapUrl = ({ per_page, page }) =>
    `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${ page }&per_page=${ per_page }`

  try {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(scrapUrl({ page: 1, per_page: 50 }))

    // getting max size of syariah list by grabbing the value in pagination btn
    const maxPageNumbers = await page.evaluate(() => {
      const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
        .map(i => i.textContent)
        .filter(Boolean)
        .map(parseFloat)

      return Math.max(...paginationBtn)
    })

    const syariahList = []
    progressBar.start(maxPageNumbers, 0)

    // grab all syariah list and navigate to each pages.
    for (let i = 1; i <= maxPageNumbers; i++) {
      await page.goto(scrapUrl({ page: i, per_page: 50 }))

      const temp = await page.evaluate(() => {
        const pipe = (...fn) => (initialVal) => fn.reduce((acc, fn) => fn(acc), initialVal)

        const removeSpacesAndSyariahSymbol = pipe(
          name => name.replace(/\s/gm, ''),
          name => name.replace(/\[S\]/igm, '')
        )

        return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr :nth-child(2)'))
          .map(name => removeSpacesAndSyariahSymbol(name.textContent))
      })

      syariahList.push(...temp)
      progressBar.increment()
    }

    await browser.close()

    console.log('\n\nFound: ', syariahList.length)

    return syariahList
  } catch (e) {
    console.error('Error scrap data', e)
    process.exit(1)
  }
}

async function writeToFile(filename, data) {
  try {
    fs.writeFileSync(filename, data, { encoding: 'utf-8' }, function (err) {
      if (err) {
        console.log(err)
        throw Error(`Unable to write to file ${ STOCK_LIST_FILENAME }`)
      }
    })

    console.log(`Saved in: ${ filename }`)
  } catch (e) {
    console.error('Error write data', e)
    process.exit(1)
  }
}

function generateShariah(SYARIAH_LIST) {
  try {
    return SYARIAH_LIST.reduce((acc, name) => ({
      ...acc,
      [`${ TRADING_VIEW_MYR }:${ name }`]: {
        s: 1
      }
    }), {})
  } catch (e) {
    console.error('Error merge data', e)
    process.exit(1)
  }
}

async function generateMidSmallCap() {
  let excelFile
  const workbook = new ExcelJS.Workbook()

  try {
    excelFile = await workbook.xlsx.readFile('./msc.xlsx')
  } catch (e) {
    console.error('Error generateMidSmallCap data', e)
    process.exit(1)
  }

  const sheet = excelFile.getWorksheet(1)

  const mscAt = sheet.getCell(1, 1).value
  const mscLink = sheet.getCell(2, 1).value.text

  let firstRowItem
  sheet.getColumn(1).eachCell((i, rowNumber) => {
    // getting the first item in the list, which ignore all table headers etc
    if (i.value === 1) {
      firstRowItem = rowNumber
    }
  })

  return {
    mscAt,
    mscLink,
    mscList: sheet.getColumn(4).values
      .slice(firstRowItem)
      .reduce((acc, stockCode) => ({
        ...acc,
        [`${ TRADING_VIEW_MYR }:${ stockCode }`]: {
          msc: 1
        }
      }), {})
  }
}

async function commitChangesIfAny() {
  try {
    await git()
      .add([
        STOCK_LIST_FILENAME,
        STOCK_LIST_READ_ONLY_FILENAME
      ])
      .commit('[STOCK_LIST] script_bot: Update with new changes')
  } catch (e) {
    console.error('Error: commit and push stock list changes', e)
    process.exit(1)
  }
}

(async() => {
  try {
    const SYARIAH_LIST = await scrapBursaMalaysia()
    const { mscAt, mscLink, mscList } = await generateMidSmallCap()

    const mergedShariahAndMSCList = {
      mscAt,
      mscLink,
      updatedAt: new Date(),
      list: merge(
        generateShariah(SYARIAH_LIST),
        mscList,
      )
    }

    await writeToFile(STOCK_LIST_FILENAME, JSON.stringify(mergedShariahAndMSCList))
    await writeToFile(STOCK_LIST_READ_ONLY_FILENAME, JSON.stringify(mergedShariahAndMSCList, null, 2))

    if (!isCommitSKip) {
      await commitChangesIfAny()
    }

    process.exit()
  } catch (e) {
    console.error('Something wrong with the whole process', e)
    process.exit(1)
  }
})()
