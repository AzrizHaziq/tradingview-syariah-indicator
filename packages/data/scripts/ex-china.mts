import fetch from 'node-fetch'
import { PdfReader } from 'pdfreader'
import { CONFIG } from './config.mjs'
import { chromium } from 'playwright-chromium'
import { PromisePool } from '@supercharge/promise-pool'
import { pipe, pluck, map, delay } from './utils.mjs'
import 'error-cause/auto'
import { ScrapeResult } from './model.mjs'

const progressBar = CONFIG.progressBar.create(2, 0, { stats: '' })

const CHINA_ETF = (companyCode = '0838EA', title = 'NET+ASSET+VALUE+%2F+INDICATIVE+OPTIMUM+PORTFOLIO+VALUE') =>
  `https://www.bursamalaysia.com/market_information/announcements/company_announcement?company=${companyCode}&keyword=${title}`

async function parsePdf(pdfUrl: string): Promise<string[]> {
  const companyNames = new Set<string>()
  const response = await fetch(pdfUrl)
  const buffer = await response.arrayBuffer()

  return new Promise((resolve, reject) => {
    let isSedol = false
    new PdfReader().parseBuffer(buffer, function (err, item) {
      if (err) {
        reject(new Error(`Error parsePdf: ${err}`))
        return
      }

      // pdf read end
      if (!item) resolve(Array.from(companyNames))

      if (isSedol) {
        companyNames.add(item.text)
        isSedol = false
      }

      // the easiest way to find stock name is with regex the sedol id
      // and for the next iteration,
      // add the stock name
      if (
        item?.text &&
        typeof item.text === 'string' &&
        !/[a-z]/.test(item.text) && // discard lower case
        /([A-Z]+[0-9]+)+/.test(item.text) && // only grab SEDOL ids
        !CONFIG.CHINA.blackListItems.includes(item.text) // remove black list item
      ) {
        isSedol = true
      }
    })
  })
}

// click the first "NET ASSET VALUE / INDICATIVE OPTIMUM PORTFOLIO VALUE" row at 4th columns.
async function getUpdatedAtAndPdfUrl() {
  const userAgent =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'

  const browser = await chromium.launch({ headless: !CONFIG.isDev })
  const ctx = await browser.newContext({ userAgent, extraHTTPHeaders: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    // 'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    // 'TE': 'trailers'
  } })
  const page = await ctx.newPage()

  try {
    const scrapeUrl = (p: { perPage: number, page: number }) =>
    `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${p.page}&per_page=${p.perPage}`
    await page.goto(scrapeUrl({perPage: 10, page: 1}))
    const buffer = await page.screenshot();
    console.log('Browser screenshot after equities', buffer.toString('base64'));


    await page.goto(CHINA_ETF(), { waitUntil: 'networkidle' })

    // get updatedAt at latest report
    const updatedAt = await page.locator('#table-announcements tbody td:nth-child(2) .d-none').first().textContent()
    // const updatedAt = new Date().getTime()

    // process of finding pdfUrl
    const latestReportSelector = '#table-announcements tbody td:last-child a'
    await page.evaluate((s: string[]) => document.querySelector(s[0])?.removeAttribute('target'), [latestReportSelector])
    await page.click(latestReportSelector)

    // have to put this, otherwise chrome will failed
    await delay(1)

    const iframeUrl = await page.evaluate(
      (s) => Promise.resolve(document.querySelector(s)?.getAttribute('src')),
      '#bm_ann_detail_iframe'
    )

    if (iframeUrl == null) {
      throw new Error('Failed to get iFrameUrl')
    }
    const iframeDomain = new URL(iframeUrl).origin
    await page.goto(iframeUrl)
    const pdfUrl = await page.evaluate(
      (s) => Promise.resolve(document.querySelector(s)?.getAttribute('href')),
      '.att_download_pdf a'
    )

    return { updatedAt, pdfUrl: `${iframeDomain}${pdfUrl}` }
  } catch (e) {
    const buffer = await page.screenshot();
    console.log('Browser screenshot', buffer.toString('base64'));

    console.log('getUpdatedAtAndPdfUrl error', e)
    throw new Error(`Error getUpdatedAtAndPdfUrl`, { cause: e })
  } finally {
    await browser.close()
  }
}

/**
 * launch multi-tabs of pages and scrape company name in google.com/search?q={companyname}.
 * and then return Array<[exchange: string, code: string, companyName: string]>
 * remap(google exchange to TV exchange): SHE === 'SZSE', SHA === 'SSE'
 */
async function getCompanyExchangeAndCode(stockNames: string[]): Promise<string[][]> {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })
  const ctx = await browser.newContext()

  const searchInGoogleFinance = async (name: string) => {
    const noMatches = 'text=No matches...'
    const mainInputBox = `:nth-match([aria-label="Search for stocks, ETFs & more"], 2)`

    const page = await ctx.newPage()
    await page.goto(`https://www.google.com/finance`, { waitUntil: 'networkidle' })

    try {
      let _name = name
      do {
        _name = _name.slice(0, _name.length - 1)

        if (_name.length < 8) {
          return ['', '', name] // failed to identify this stock and just return it as is.
        }

        await page.fill(mainInputBox, _name)
        await delay(1)
        progressBar.update({ stats: `Searching: ${_name}` })

        // if "No matches..." not exist then press enter and get code and exchange
        const missing = await page.isVisible(noMatches)
        if (!missing) {
          await page.focus(mainInputBox)
          await page.keyboard.down('Enter')
          await delay(2)

          // getting stock code and exchange in url
          let [code, exchange] = await page.evaluate(async () => {
            console.log('within')
            const split = location.pathname.split('/')
            console.log('split', split)
            return Promise.resolve(split[split.length - 1].split(':'))
          })

          // eslint-disable-next-line no-prototype-builtins
          exchange = CONFIG.CHINA.remapExchangeFromGoogleToTV.hasOwnProperty(exchange)
            ? CONFIG.CHINA.remapExchangeFromGoogleToTV[exchange]
            : ''

          progressBar.increment(1, { stats: `Done: ${exchange}-${code}-${name}` })

          return [exchange, code, name]
        }
      } while (await page.isVisible(noMatches))
    } catch (e) {
      console.log(e)
    } finally {
      await page.close()
    }

    return undefined
  }

  try {
    const { results } = await PromisePool.for(stockNames).process(searchInGoogleFinance)
    return results.flatMap(r => r ? [r] : []) // returns [exchange: string, code: string, name: string][]
  } catch (e) {
    throw new Error(`Error getCompanyExchangeAndCode`, { cause: e })
  } finally {
    await browser.close()
  }
}

/**
 * Main SSE & SZSE scrap function
 * */
export default async function(): Promise<ScrapeResult> {
  try {
    const { updatedAt, pdfUrl } = await getUpdatedAtAndPdfUrl()
    progressBar.increment(1, { stats: 'Success retrieved updatedAt and pdfUrl' })

    let companyNames = await parsePdf(pdfUrl)
    progressBar.increment(1, { stats: 'Success parse pdf' })

    companyNames = CONFIG.isDev ? companyNames.slice(0, 30) : companyNames
    progressBar.update(0)
    progressBar.setTotal(companyNames.length)

    const human = await getCompanyExchangeAndCode(companyNames)

    if (updatedAt === null) {

    }
    return human.reduce((acc, stock) => {
        const [exchange, code, name] = stock
        // some stock failed to get exchange and code
        if (exchange === '') {
          return acc
        }

        // eslint-disable-next-line no-prototype-builtins
        if (!acc[exchange]) {
          acc[exchange] = {
            updatedAt: (updatedAt ? new Date(updatedAt) : new Date()),
            stocks: [],
            market: CONFIG.CHINA.market
          }
        }

        acc[exchange].stocks.push({code, name})
        return acc
      }, {})

  } catch (e) {
    console.log(e)
    throw new Error('Failed to scrape CHINA', { cause: e })
  }
}

// main just search thru google search and grab the stock code and exchange
// const _main = async (name) => {
//   progressBar.increment(1, { stats: `Google search: ${name}` })
//
//   const page = await ctx.newPage()
//   const url = `https://google.com/search?q=${encodeURIComponent(name + ' stock price')}`
//   await page.goto(url, { waitUntil: 'networkidle' })
//
//   return await page
//     .evaluate(
//       ([selector, util]) => {
//         let { name, getElementByXPath, remapExchange } = util
//         remapExchange = JSON.parse(remapExchange)
//         getElementByXPath = new Function(`return ${getElementByXPath}`)() // eslint-disable-line no-new-func
//
//         const el = getElementByXPath(selector)
//
//         if (!el) {
//           return Promise.resolve(['', '', name])
//         }
//
//         let [exchange, code] = el.textContent.replace(/\s/g, '').split(':')
//
//         // eslint-disable-next-line no-prototype-builtins
//         if (remapExchange.hasOwnProperty(exchange)) {
//           exchange = remapExchange[exchange]
//         } else throw new Error(`Failed to remap China exchange: ${exchange}:${code}:${name}`)
//
//         return Promise.resolve([exchange, code, name])
//       },
//       [
//         '//*[@id="knowledge-finance-wholepage__entity-summary"]/div/g-card-section/div/g-card-section/div[2]/div[2]/div[1]',
//         {
//           name,
//           getElementByXPath: getElementByXPath.toString(),
//           remapExchange: JSON.stringify(CONFIG.CHINA.remapExchangeFromGoogleToTV),
//         },
//       ]
//     )
//     .finally(async () => await page.close())
// }
