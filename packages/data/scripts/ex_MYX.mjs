import fetch from 'node-fetch'
import { CONFIG } from './CONFIG.mjs'
import { delay, pipe } from './utils.mjs'
import { chromium } from 'playwright-chromium'
import { PromisePool } from '@supercharge/promise-pool'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })

/**
 * @param {{s: 1, code: string, stockName: string}[]} stocks - Fetching company fullname in a page(50 items) {s:1, code: '0012', '3A' }[]
 * @returns {Promise<Object<string, {s: 1, code: string, stockName: string, fullname; string}>>} - {'0012': {s:1, code: '0012', '3A', fullName: 'Three-A Resources Berhad' }}
 */
async function getCompanyName(stocks) {
  /**
   * @param {string} code
   * @returns {Promise<string>}
   */
  async function getCompanyFullname(code) {
    const res = await fetch(`https://www.bursamalaysia.com/api/v1/equities_prices/sneak_peek?stock_id=${code}`)
    const json = await res.json()
    return json.data?.company_info?.name
  }

  try {
    const { results, errors } = await PromisePool.for(stocks) // mostly stocks will have 50 items based on per_page
      .withConcurrency(25) // fetch company fullname 25 items at a time
      .process(async (stock) => {
        const fullname = await getCompanyFullname(stock.code)
        return { ...stock, fullname }
      })

    if (errors.length) {
      throw Error(`failed fetch getCompanyFullName`, { cause: errors })
    }

    return results.reduce((acc, curr) => {
      acc[curr.code] = curr
      return acc
    }, {})
  } catch (e) {
    throw Error(`Failed at getCompanyName`, { cause: e })
  }
}

const scrapUrl = ({ perPage, page }) =>
  `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${page}&per_page=${perPage}`

/** @returns {Promise<{[p: string]: {s: 1, code: string, stockName: string, fullname, string}}>} */
async function scrapBursaMalaysia() {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })

  try {
    const ctx = await browser.newContext()
    const initPage = await ctx.newPage()
    await initPage.goto(scrapUrl({ page: 1, perPage: 50 }))

    // getting max size of syariah list by grabbing the value in pagination btn
    const maxPageNumbers = await (CONFIG.isDev
      ? Promise.resolve(1)
      : initPage.evaluate(() => {
          const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
            .map((i) => i.textContent)
            .filter(Boolean)
            .map(parseFloat)

          return Math.max(...paginationBtn)
        }))

    progressBar.setTotal(maxPageNumbers)
    await initPage.close()

    const { results, errors } = await PromisePool.for(Array.from({ length: maxPageNumbers }))
      .withConcurrency(5) // 5 pages at a time
      .process(async (_, i) => {
        const page = await ctx.newPage()
        const pageNo = `${i + 1}`.padStart(2, '0')
        await page.goto(scrapUrl({ page: i + 1, perPage: 50 }), { waitUntil: 'networkidle' })

        /** @returns {Promise<{s: 1, code: string, stockName: string}[]>} */
        const scrapeList = async () =>
          await page.evaluate(() => {
            const pipe =
              (...fn) =>
              (initialVal) =>
                fn.reduce((acc, fn) => fn(acc), initialVal)
            const removeSpaces = pipe((name) => name.replace(/\s/gm, ''))
            const removeSpacesAndShariah = pipe(removeSpaces, (name) => name.replace(/\[S\]/gim, ''))

            return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr')).reduce((acc, tr) => {
              const s = tr.querySelector(':nth-child(2)').textContent
              const stockCode = tr.querySelector(':nth-child(3)').textContent

              const code = removeSpaces(stockCode)
              const stockName = removeSpacesAndShariah(s)
              return [...acc, { s: 1, code, stockName }]
            }, [])
          })

        // this does the work as of retry scrapping function
        // sometime scrape return 0 items
        let shariahList = await scrapeList()
        while (shariahList.length <= 0) {
          await delay(1)
          progressBar.increment(0, { stats: `Page ${pageNo}: retry` })
          shariahList = await scrapeList()
        }

        progressBar.increment(0.5, { stats: `Page ${pageNo}: scrapped` })
        shariahList = await getCompanyName(shariahList)
        progressBar.increment(0.5, { stats: `Page ${pageNo}: done` })

        return shariahList
      })

    // TODO: fixme if there is error in pool
    if (errors.length) {
      console.log(errors, 'MYX, promise pool scrape failed', errors, results)
      throw Error(`failed scrape stock in pages`, { cause: errors })
    }

    return results.reduce((acc, chunk) => ({ ...acc, ...chunk }), {})
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error scrap MYX data', e)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

/**
 * Main MYX scrape function
 * @returns {Promise<MAIN_DEFAULT_EXPORT>}
 * */
export default async function () {
  try {
    const shariahList = await scrapBursaMalaysia()

    const human = pipe(Object.values, (values) => values.map((val) => ['MYX', val.stockName, val.fullname]))(
      shariahList
    )

    const sortedList = pipe(
      Object.values,
      (entries) => entries.sort(({ stockName: keyA }, { stockName: keyB }) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)),
      (items) =>
        items.reduce((acc, { code, stockName, fullname, ...res }) => ({ ...acc, [stockName]: Object.values(res) }), {})
    )(shariahList)

    return {
      human,
      data: {
        MYX: {
          updatedAt: Date.now(),
          list: sortedList,
          shape: CONFIG.MYX.shape,
          market: CONFIG.MYX.market,
        },
      },
    }
  } catch (e) {
    throw Error(`Error generating MYX`, { cause: e })
  }
}
