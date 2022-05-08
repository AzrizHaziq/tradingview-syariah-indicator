import fetch from 'node-fetch'
import { pipe } from './utils.mjs'
import { CONFIG } from './CONFIG.mjs'
import { chromium } from 'playwright-chromium'
import { PromisePool } from '@supercharge/promise-pool'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })

/**
 * @param {{s: 1, code: string, stockName: string}} stocks - {s:1, code: '0012', '3A' }
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
    const { results } = await PromisePool.for(stocks)
      .withConcurrency(5)
      .process(async (stock) => {
        const fullname = await getCompanyFullname(stock.code)
        return { ...stock, fullname }
      })

    return results.reduce((acc, curr) => {
      acc[curr.code] = curr
      return acc
    }, {})
  } catch (e) {
    throw Error(`Failed at getCompanyName: ${e}`)
  }
}

const scrapUrl = ({ perPage, page }) =>
  `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${page}&per_page=${perPage}`

/** @returns {Promise<RESPONSE_FROM_JSON>} */
async function scrapBursaMalaysia() {
  try {
    const browser = await chromium.launch()
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

    const shariahList = await Promise.all(
      Array.from({ length: maxPageNumbers }).map(async (_, i) => {
        const page = await ctx.newPage()
        await page.goto(scrapUrl({ page: i + 1, perPage: 50 }), { waitUntil: 'networkidle' })

        let temp = await page.evaluate(() => {
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

        const pageNo = `${i + 1}`.padStart(2, '0')
        progressBar.increment(0.5, { stats: `Page ${pageNo}: scrapped` })
        temp = await getCompanyName(temp)
        progressBar.increment(0.5, { stats: `Page ${pageNo}: fetched` })

        return temp
      })
    ).then((results) => results.reduce((acc, chunk) => ({ ...acc, ...chunk }), {}))

    await browser.close()
    return shariahList
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error scrap data', e)
    process.exit(1)
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
          shape: CONFIG.MYX.shape,
          list: sortedList,
        },
      },
    }
  } catch (e) {
    throw Error(`Error generating MYX: ${e}`)
  }
}
