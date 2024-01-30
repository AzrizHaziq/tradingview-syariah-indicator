import fetch from 'node-fetch'
import { CONFIG } from './CONFIG.mjs'
import { delay, getRandomInt, pipe } from './utils.mjs'
import { chromium, Page } from 'playwright-chromium'
import { PromisePool } from '@supercharge/promise-pool'
import { ExchangeDetail, MAIN_DEFAULT_EXPORT, RESPONSE_FROM_JSON } from '@app/shared'
// @ts-ignore
import currentStockListHumanJson from './../stock-list-human.json'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })
type tempMYX = { [code: string]: { s: 1 | 0; code: string; stockName: string; fullname: string } }
type InterimMyxType = { s: 0 | 1; code: string; stockName: string }

const userAgentStrings = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.2228.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
]

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
    const ctx = await browser.newContext({
      userAgent: userAgentStrings[Math.floor(Math.random() * userAgentStrings.length)],
    })

    await ctx.addInitScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
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
          progressBar.increment(0, { stats: `[MYX]: ${pageNo} page retry` })
          scrapped = await scrapeList()
        }

        progressBar.increment(0.5, { stats: `[MYX]: ${pageNo} page scrapped` })
        await page.close()

        return scrapped
      })

    //  * Fetching company fullname in a page(50 items) {s:1, code: '0012', '3A' }[]
    //  * output example: {'0012': {s:1, code: '0012', '3A', fullName: 'Three-A Resources Berhad' }}
    const { results: _r, errors: _e } = await PromisePool.for(results.flat())
      .withConcurrency(5) // 5 stock at a time
      .process(async (stock, i) => {
        try {
          await delay(getRandomInt(3, 7)) // 3-7s. cloudflare detect us being bot
          const url = `https://www.bursamalaysia.com/api/v1/equities_prices/sneak_peek?stock_id=${stock.code}`
          const res = await fetch(url, {
            headers: { 'User-Agent': userAgentStrings[Math.floor(Math.random() * userAgentStrings.length)] },
          })

          const json = (await res.json()) as { data: { company_info: { name: string } } }
          progressBar.increment(0.02, { stats: `[MYX]: ${stock.stockName} fullname fetched` }) // 50 item per page === 1 increment,

          return { ...stock, fullname: json?.data?.company_info?.name ?? 'na' }
        } catch (e) {
          progressBar.increment(0.02, { stats: `[MYX]: ${stock.stockName} use previous fullname` })
          const found = currentStockListHumanJson.data.find(
            ([exchange, stockShortName, stockFullname]) => exchange === 'MYX' && stockShortName === stock.code
          )

          return { ...stock, fullname: found?.[2] ?? 'na' }
        }
      })

    if (_e.length) {
      console.log(errors, 'MYX, promise pool scrape failed', _e)
      throw Error(`MYX, promise pool scrape failed`, { cause: _e })
    }

    return _r.reduce((acc, chunk) => {
      acc[chunk.code] = chunk
      return acc
    }, {})
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
