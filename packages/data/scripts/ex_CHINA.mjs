import fetch from 'node-fetch'
import { CONFIG } from './config.mjs'
import { PdfReader } from 'pdfreader'
import { chromium } from 'playwright-chromium'
import { pipe, pluck, map } from './utils.mjs'

// const progressBar = CONFIG.progressBar.create(100)

// exchanges = SSE, SZSE
const CHINA_ETF = (
  companyCode = '0838EA',
  title = encodeURIComponent('NET ASSET VALUE / INDICATIVE OPTIMUM PORTFOLIO VALUE')
) =>
  `https://www.bursamalaysia.com/market_information/announcements/company_announcement?company=${companyCode}&title=${title}`

// https://www.bursamalaysia.com/market_information/announcements/company_announcement/announcement_details?ann_id=3190249
// https://stockmarketmba.com/symbollookupusingidentifier.php

async function parsePdf(pdfUrl) {
  const SEDOL_IDS = new Set()
  const response = await fetch(pdfUrl)
  const buffer = await response.buffer()

  return new Promise((resolve, reject) => {
    new PdfReader().parseBuffer(buffer, function (err, item) {
      if (err) {
        reject(new Error(`Error parsePdf: ${err}`))
        return
      }

      if (!item) resolve(Array.from(SEDOL_IDS))

      if (
        item?.text &&
        typeof item.text === 'string' &&
        !/[a-z]/.test(item.text) && // discard lower case
        /([A-Z]+[0-9]+)+/.test(item.text) && // only grab SEDOL ids
        !CONFIG.CHINA.blackListItems.includes(item.text) // remove black list item
      ) {
        SEDOL_IDS.add(item.text)
      }
    })
  })
}

async function getUpdatedAtAndPdfUrl() {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })
  const page = await browser.newPage()

  try {
    await page.goto(CHINA_ETF())

    // get updatedAt at latest report
    const updatedAt = await page.evaluate(
      ([selector, util]) => {
        let { pipe, map, pluck } = util
        pipe = new Function(`return ${pipe}`)() // eslint-disable-line no-new-func
        map = new Function(`return ${map}`)() // eslint-disable-line no-new-func
        pluck = new Function(`return ${pluck}`)() // eslint-disable-line no-new-func

        return pipe(
          s => document.querySelector(s),
          pluck('textContent'),
          map(text => text.trim()),
          map(date => Date.parse(date)),
          map(timeStamp => Promise.resolve(timeStamp))
        )(selector)
      },
      [
        '#table-announcements tbody td:nth-child(2) .d-none',
        { pipe: pipe.toString(), map: map.toString(), pluck: pluck.toString() },
      ]
    )

    // process of finding pdfUrl
    const latestReportSelector = '#table-announcements tbody td:last-child a'
    await page.evaluate(s => document.querySelector(s).removeAttribute('target'), [latestReportSelector])
    await page.click(latestReportSelector)

    const iframeUrl = await page.evaluate(
      s => Promise.resolve(document.querySelector(s).getAttribute('src')),
      '#bm_ann_detail_iframe'
    )

    const iframeDomain = new URL(iframeUrl).origin
    await page.goto(iframeUrl)
    const pdfUrl = await page.evaluate(
      s => Promise.resolve(document.querySelector(s).getAttribute('href')),
      '.att_download_pdf a'
    )

    return { updatedAt, pdfUrl: `${iframeDomain}${pdfUrl}` }
  } catch (e) {
    throw Error(`Error getUpdatedAtAndPdfUrl: ${e}`)
  } finally {
    await browser.close()
  }
}

export async function CHINA() {
  try {
    const { updatedAt, pdfUrl } = await getUpdatedAtAndPdfUrl()
    const abc = await parsePdf(pdfUrl)
    // console.log(abc, 111)
    // open the CHINA_ETF url
    // click the first "NET ASSET VALUE / INDICATIVE OPTIMUM PORTFOLIO VALUE" row at 4th columns.
    // open the pdf
  } catch (e) {
    throw Error(`Failed scrape CHINA: ${e}`)
  }
}
