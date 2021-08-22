import merge from 'lodash.merge'
import { pipe } from './utils.mjs'
import { CONFIG } from './CONFIG.mjs'
import cliProgress from 'cli-progress'
import { chromium } from 'playwright-chromium'

CONFIG.progressBar = new cliProgress.SingleBar({}, CONFIG.progressBarType)

async function scrapBursaMalaysia() {
  const scrapUrl = ({ per_page, page }) =>
    `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${page}&per_page=${per_page}`

  try {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(scrapUrl({ page: 1, per_page: 50 }))

    // getting max size of syariah list by grabbing the value in pagination btn
    const maxPageNumbers = await page.evaluate(() => {
      const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
        .map(i => i.textContent)
        .filter(Boolean)
        .map(parseFloat)

      return Math.max(...paginationBtn)
    })

    let syariahList = {}
    CONFIG.progressBar.start(maxPageNumbers, 0)

    // grab all syariah list and navigate to each pages.
    for (let i = 1; i <= maxPageNumbers; i++) {
      await page.goto(scrapUrl({ page: i, per_page: 50 }), { waitUntil: 'networkidle' })

      const temp = await page.evaluate(() => {
        const pipe = (...fn) => initialVal => fn.reduce((acc, fn) => fn(acc), initialVal)
        const removeSpaces = pipe(name => name.replace(/\s/gm, ''))
        const removeSpacesAndShariah = pipe(removeSpaces, name => name.replace(/\[S\]/gim, ''))

        return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr')).reduce((acc, tr) => {
          const s = tr.querySelector(':nth-child(2)').textContent
          const stockCode = tr.querySelector(':nth-child(3)').textContent

          const code = removeSpaces(stockCode)
          const stockName = removeSpacesAndShariah(s)
          return {
            ...acc,
            [code]: {
              s: 1,
              code,
              stockName,
            },
          }
        }, {})
      })

      syariahList = { ...syariahList, ...temp }
      CONFIG.progressBar.increment()
    }

    await browser.close()

    // eslint-disable-next-line no-console
    console.log('\n\nMYX Found: ', Object.keys(syariahList).length)

    return syariahList
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error scrap data', e)
    process.exit(1)
  }
}

export async function MYX() {
  try {
    const shariahList = await scrapBursaMalaysia()

    const sortedList = pipe(
      Object.values,
      entries => entries.sort(({ stockName: keyA }, { stockName: keyB }) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)),
      items => items.reduce((acc, { code, stockName, ...res }) => ({ ...acc, [stockName]: Object.values(res) }), {})
    )(merge(shariahList)) // merge by stock code

    return {
      MYX: {
        updatedAt: new Date(),
        shape: [{ 0: 'non-s', 1: 's', default: '' }],
        list: sortedList,
      },
    }
  } catch (e) {
    throw `Error generating MYX: ${e}`
  }
}
