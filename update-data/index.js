import fs from 'fs'
import playWright from 'playwright'
import cliProgress from 'cli-progress'

const TRADING_VIEW_MYR = 'MYX'
const STOCK_LIST_FILENAME = 'stock-list.json'
const SAVE_STOCK_PATH = `background/${ STOCK_LIST_FILENAME }`
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

function merged(SYARIAH_LIST) {
  try {
    return {
      updatedAt: new Date(),
      list: SYARIAH_LIST.reduce((acc, name) => ({
        ...acc,
        [`${ TRADING_VIEW_MYR }:${ name }`]: {
          s: true
        }
      }), {})
    }
  } catch (e) {
    console.error('Error merge data', e)
    process.exit(1)
  }
}

async function writeToFile(data) {
  try {
    fs.writeFileSync(SAVE_STOCK_PATH, JSON.stringify(data, null, 2), { encoding: 'utf-8' }, function (err) {
      if (err) {
        console.log(err)
        throw Error(`Unable to write to file ${ STOCK_LIST_FILENAME }`)
      }
    })

    console.log(`Saved in: ${ SAVE_STOCK_PATH }`)
  } catch (e) {
    console.error('Error write data', e)
    process.exit(1)
  }
}

(async () => {
  try {
    const SYARIAH_LIST = await scrapBursaMalaysia()
    await writeToFile(merged(SYARIAH_LIST))
    process.exit()
  } catch (e) {
    console.error('Something wrong with the whole process', e)
    process.exit(1)
  }
})()
