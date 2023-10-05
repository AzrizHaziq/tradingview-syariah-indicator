import fetch from 'node-fetch'
import { CONFIG } from './CONFIG.mjs'
import { delay, pipe } from './utils.mjs'
import { chromium, Page } from 'playwright-chromium'
import { PromisePool } from '@supercharge/promise-pool'
import { ExchangeDetail, MAIN_DEFAULT_EXPORT, RESPONSE_FROM_JSON } from '@app/shared'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })
type tempMYX = { [p: string]: { s: 1 | 0; code: string; stockName: string; fullname: string } }
type InterimMyxType = { s: 0 | 1; code: string; stockName: string }

/**
 * Fetching company fullname in a page(50 items) {s:1, code: '0012', '3A' }[]
 * output example: {'0012': {s:1, code: '0012', '3A', fullName: 'Three-A Resources Berhad' }}
 */
async function getCompanyName(stocks: InterimMyxType[]): Promise<tempMYX> {
  async function getCompanyFullName(code: string): Promise<string> {
    const res = await fetch(`https://www.bursamalaysia.com/api/v1/equities_prices/sneak_peek?stock_id=${code}`)
    const json = (await res.json()) as { data: { company_info: { name: string } } }
    return json?.data?.company_info?.name ?? ''
  }

  try {
    const { results, errors } = await PromisePool.for(stocks) // mostly stocks will have 50 items based on per_page
      .withConcurrency(25) // fetch company fullname 25 items at a time
      .process(async (stock) => {
        const fullname = await getCompanyFullName(stock.code)
        return { ...stock, fullname }
      })

    if (errors.length) {
      console.log('>>>>', errors)
      throw Error(`failed fetch getCompanyFullName`, { cause: errors })
    }

    return results.reduce((acc, curr) => {
      acc[curr.code] = curr
      return acc
    }, {})
  } catch (e) {
    throw Error(`Failed at (getCompanyName)`, { cause: e })
  }
}

const bursaScrapeUrl = async (
  pwPage: Page,
  page: number
): Promise<{ recordsTotal: string; data: [row: number, symbolDom: string, symbolCode: string][] }> => {
  return await pwPage.evaluate(async (page) => {
    const params: Record<string, string> = {
      inMarket: 'all',
      category: 'top_active',
      sort_dir: 'asc',
      page: page + '',
      'legend[]': '[S]',
      per_page: '50',
      alphabetical: '',
      keyword: '',
      board: '',
      sector: '',
      sub_sector: '',
      sort_by: '',
    }

    const res = await fetch(
      `https://www.bursamalaysia.com/api/v1/equities_prices/equities_prices?${new URLSearchParams(params)}`,
      { headers: { accept: 'application/json, text/javascript, */*; q=0.01' } }
    )

    return (await res.json()) as unknown as ReturnType<typeof bursaScrapeUrl>
  }, page)
}

async function scrapBursaMalaysia(): Promise<tempMYX> {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })

  try {
    const ctx = await browser.newContext()
    const initPage = await ctx.newPage()

    await initPage.goto(CONFIG.MYX.home_page)

    // getting max size of syariah list by grabbing the value in pagination btn
    const maxPageNumbers = await (CONFIG.isDev
      ? Promise.resolve(1)
      : Math.ceil(parseFloat((await bursaScrapeUrl(initPage, 1)).recordsTotal) / 50))

    if (maxPageNumbers === 0 && typeof maxPageNumbers !== 'number') {
      throw Error(`maxPageNumber error`, { cause: errors })
    }

    progressBar.setTotal(maxPageNumbers)
    await initPage.close()

    const { results, errors } = await PromisePool.for(Array.from({ length: maxPageNumbers }))
      .withConcurrency(5) // 5 pages at a time
      .process(async (_, i) => {
        const page = await ctx.newPage()
        const pageNo = `${i + 1}`.padStart(2, '0')
        const res = await bursaScrapeUrl(page, i + 1)

        const scrapeList = async (): Promise<InterimMyxType[]> =>
          await page.evaluate((symbols) => {
            // symbolDom = <div class='stock_change' style='margin-left: 7px;'><span class="up"></span>ECOWLD [S]</div>
            const parser = new DOMParser()

            return symbols.map(([, symbolDom, symbolCode]) => {
              const doc = parser.parseFromString(symbolDom, 'text/html')

              return {
                s: 1,
                code: symbolCode,
                stockName: /\w+([&-]?\w+)+/.exec(doc.querySelector('.stock_change').textContent)[0].trim(),
              }
            }) as unknown as ReturnType<Awaited<typeof scrapeList>>
          }, res.data)

        // this does the work as of retry scrapping function
        // sometime scrape return 0 items
        let scrapped = await scrapeList()

        while (scrapped.length <= 0) {
          await delay(1)
          progressBar.increment(0, { stats: `Page ${pageNo}: retry` })
          scrapped = await scrapeList()
        }

        progressBar.increment(0.5, { stats: `Page ${pageNo}: scrapped` })
        const shariahList = await getCompanyName(scrapped)
        progressBar.increment(0.5, { stats: `Page ${pageNo}: done` })

        return shariahList
      })

    // TODO: fixme if there is error in pool
    if (errors.length) {
      console.log(errors, 'MYX, promise pool scrape failed', errors)
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

/** Main MYX scrape function */
export default async function (): Promise<MAIN_DEFAULT_EXPORT> {
  try {
    const shariahList = await scrapBursaMalaysia()

    const human = pipe(Object.values, (values) => values.map((val) => ['MYX', val.stockName, val.fullname]))(
      shariahList
    )

    const sortedList: ExchangeDetail['list'] = pipe(
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
      } as RESPONSE_FROM_JSON,
    }
  } catch (e) {
    throw Error(`Error generating MYX`, { cause: e })
  }
}
