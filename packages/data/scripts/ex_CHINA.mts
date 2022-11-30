import fetch from 'node-fetch'
import { PdfReader } from 'pdfreader'
import { chromium } from 'playwright-chromium'
import { MAIN_DEFAULT_EXPORT } from '@app/shared'
import { PromisePool } from '@supercharge/promise-pool'

import { CONFIG } from './CONFIG.mjs'
import { pipe, map, delay } from './utils.mjs'

const progressBar = CONFIG.progressBar.create(2, 0, { stats: '' })

/** Main SSE & SZSE scrape function */
export default async function (): Promise<MAIN_DEFAULT_EXPORT> {
  try {
    const { updatedAt, pdfUrl } = await getUpdatedAtAndPdfUrl()
    progressBar.increment(1, { stats: 'Success retrieved updatedAt and pdfUrl' })

    let companyNames = await parsePdf(pdfUrl)
    progressBar.increment(1, { stats: 'Success parse pdf' })

    companyNames = CONFIG.isDev ? companyNames.slice(0, 30) : companyNames
    progressBar.update(0)
    progressBar.setTotal(companyNames.length)

    const human = await getCompanyExchangeAndCode(companyNames)

    return {
      human,
      data: human.reduce((acc, [exchange, code]) => {
        // some stock failed to get exchange and code
        if (exchange === '') return acc

        // eslint-disable-next-line no-prototype-builtins
        if (acc.hasOwnProperty(exchange)) {
          acc[exchange].list[code] = [1]
        } else {
          acc = {
            ...acc,
            [exchange]: {
              updatedAt,
              list: {},
              shape: CONFIG.CHINA.shape,
              market: CONFIG.CHINA.market,
            },
          }
        }
        return acc
      }, {}) as unknown as MAIN_DEFAULT_EXPORT['data'],
    }
  } catch (e) {
    throw Error(`Failed scrape CHINA`, { cause: e })
  }
}

async function parsePdf(pdfUrl): Promise<string[]> {
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

/**
 * launch multi-tabs of pages and scrape company name in google.com/search?q={companyname}.
 * and then return Array<[exchange: string, code: string, companyName: string]>
 * remap(google exchange to TV exchange): SHE === 'SZSE', SHA === 'SSE'
 * @param {string[]} stockNames
 * @returns {Promise<*[]>}
 */
async function getCompanyExchangeAndCode(stockNames: string[]): Promise<MAIN_DEFAULT_EXPORT['human']> {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })
  const ctx = await browser.newContext()

  const searchInGoogleFinance = async (name: string): Promise<MAIN_DEFAULT_EXPORT['human'][0]> => {
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
        const bool = await page.isVisible(noMatches)
        if (!bool) {
          await page.focus(mainInputBox)
          await page.keyboard.down('Enter')
          await delay(2)

          // getting stock code and exchange in url
          let [code, exchange] = await page.evaluate(async () => {
            const split = location.pathname.split('/')
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
    } finally {
      await page.close()
    }
  }

  try {
    const { results } = await PromisePool.for(stockNames).process(searchInGoogleFinance)
    return results
  } catch (e) {
    throw Error(`Error getCompanyExchangeAndCode`, { cause: e })
  } finally {
    await browser.close()
  }
}

// click the first "NET ASSET VALUE / INDICATIVE OPTIMUM PORTFOLIO VALUE" row at 4th columns.
async function getUpdatedAtAndPdfUrl(): Promise<{ updatedAt: string; pdfUrl: string }> {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })
  const page = await browser.newPage()

  try {
    await page.goto(CONFIG.CHINA.home_page)
    await page.getByText('CHINA100-MYR [S]').first().click()

    const firstAnnouncement = await page.getByText('NET ASSET VALUE / INDICATIVE OPTIMUM PORTFOLIO VALUE').first()
    await page.goto(await firstAnnouncement.evaluate((el: HTMLAnchorElement) => el.href))

    let iframeUrl = await page.locator('iframe#bm_ann_detail_iframe').evaluate((el: HTMLIFrameElement) => el.src)
    iframeUrl = iframeUrl.split('#')[0]

    const iframePage = await browser.newPage()
    await iframePage.goto(iframeUrl)

    const dateTextEl = await iframePage.getByText('Date Announced')
    const dateEl = await dateTextEl.evaluate((td: HTMLElement) => td.nextElementSibling.textContent)
    const updatedAt = pipe(
      map((text) => text.trim()),
      map((date) => Date.parse(date))
    )(dateEl)

    const pdfUrl = await iframePage.locator('.att_download_pdf a').evaluate((a: HTMLAnchorElement) => a.href)
    return { updatedAt, pdfUrl }
  } catch (e) {
    throw Error(`Error (getUpdatedAtAndPdfUrl)`, { cause: e })
  } finally {
    await browser.close()
  }
}
