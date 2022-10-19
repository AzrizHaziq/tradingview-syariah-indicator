import fetch from 'node-fetch'
import { CONFIG } from './config.mjs'
import { delay, pipe } from './utils.mjs'
import { chromium, Page } from 'playwright-chromium'
import { PromisePool } from '@supercharge/promise-pool'
import 'error-cause/auto'
import { stringify } from 'querystring'
import { ScrapeResult as ScrapeResult } from './model.mjs'
import { URLSearchParams } from 'url'
import { parse as parseHtml } from 'node-html-parser'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })

/**
 * @param {{s: 1, code: string, stockName: string}[]} stocks - Fetching company fullname in a page(50 items) {s:1, code: '0012', '3A' }[]
 * @returns {Promise<Object<string, {s: 1, code: string, stockName: string, fullname; string}>>} - {'0012': {s:1, code: '0012', '3A', fullName: 'Three-A Resources Berhad' }}
 */
async function addCompanyFullname(stocks: {code: string, stockName: string}[]):
    Promise<{[id: string]: {code: string, stockName: string, fullname: string}}> {

  async function getCompanyFullname(id: string): Promise<string> {
    const res = await fetch(`https://www.bursamalaysia.com/api/v1/equities_prices/sneak_peek?stock_id=${id}`)
    const json: any = await res.json()
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
      throw new Error(`failed fetch getCompanyFullName`, { cause: errors })
    }

    return results.reduce((acc: any, curr) => {
      acc[curr.code] = curr
      return acc
    }, {})
  } catch (e) {
    throw new Error(`Failed at getCompanyName`, { cause: e })
  }
}

const scrapeUrl = (p: { perPage: number, page: number }) =>
  `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${p.page}&per_page=${p.perPage}`


async function scrapeList(page: Page): Promise<{code: string, stockName: string}[]> {
  return await page.evaluate(() => {
    const pipe =
      (...fn: Function[]) =>
      (initialVal: any) =>
        fn.reduce((acc, fn) => fn(acc), initialVal)
    const removeSpaces = pipe((name: any) => name.replace(/\s/gm, ''))
    const removeSpacesAndShariah = pipe(removeSpaces, (name: any) => name.replace(/\[S\]/gim, ''))

    return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr')).reduce((acc: any, tr) => {
      const s = tr.querySelector(':nth-child(2)')?.textContent
      const stockCode = tr.querySelector(':nth-child(3)')?.textContent

      const code = removeSpaces(stockCode)
      const stockName = removeSpacesAndShariah(s)
      return [...acc, { code, stockName }]
    }, [])
  })
}


async function scrapeBursaMalaysia2(): Promise<{[p: string]: {code: string, stockName: string, fullname: string}}> {
  function paginationTextToMaxPageNumber(text: string): number | null {
    const doc = parseHtml(text)
    const val = doc.querySelector('#total_page')?.getAttribute('data-val')
    return val ? parseInt(val) : null
  }

  // First page is 1
  async function fetchStockList(page: number): Promise<{code: string, stockName: string}[]> {
    const url = 'https://api.webscraping.ai/selected?' + new URLSearchParams({
      'url': scrapeUrl({ page, perPage: 50 }),
      'selector': '#DataTables_Table_0 tbody',
      'api_key': CONFIG.webscrapingApiKey
    })
    const dataText = await fetch(url).then(v => v.text())

    return tableDataToStocks(dataText)
  }

  function tableDataToStocks(dataText: string): {code: string, stockName: string}[] {
    const pipe =
      (...fn: Function[]) =>
      (initialVal: any) =>
        fn.reduce((acc, fn) => fn(acc), initialVal)
    const removeSpaces = pipe((name: any) => name.replace(/\s/gm, ''))
    const removeSpacesAndShariah = pipe(removeSpaces, (name: any) => name.replace(/\[S\]/gim, ''))

    const tbody = parseHtml(dataText)
    return Array.from(tbody.querySelectorAll('tr')).reduce((acc: any, tr) => {
      // console.log(tr.innerHTML)
      const s = tr.querySelector('td:nth-child(2)')?.textContent
      const stockCode = tr.querySelector('td:nth-child(3)')?.textContent

      const code = removeSpaces(stockCode)
      const stockName = removeSpacesAndShariah(s)

      // console.log('code', code)
      // console.log('stockName', stockName)

      return [...acc, { code, stockName }]
    }, [])
  }
  // .pagination li.page-item [data-dt-idx='1'] returns 4 possible values, so not possible

  async function extractFirstInfo(): Promise<{maxPageNumber: number, dataText: string}> {
    const url = 'https://api.webscraping.ai/selected-multiple?' + new URLSearchParams({
      'url': scrapeUrl({ page: 1, perPage: 50 }),
      'selectors': [
                    '.pagination',
                    '#DataTables_Table_0 tbody'
                    ],
      'api_key': CONFIG.webscrapingApiKey
    })
    const response = await fetch(url).then(v => v.json() as {})
  // const response = [
  //   [
  //     "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">1</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\n3A [S]\n</td>\n<td>0012</td>\n<td class=\"nowrap\"></td>\n<td>\n0.880\n</td>\n<td>0.875</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+0.57\n</div>\n</td>\n<td>1,565</td>\n<td>780</td>\n<td>0.875</td>\n<td>0.880</td>\n<td>14</td>\n<td>\n0.880\n</td>\n<td>\n0.875\n</td>\n<td class=\"stock-id hidden\">0012</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">2</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAASIA [S]\n</td>\n<td>7054</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.110</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>2,500</td>\n<td>0.100</td>\n<td>0.110</td>\n<td>1,536</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">7054</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">3</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nAAX [S]\n</td>\n<td>5238</td>\n<td class=\"nowrap\"></td>\n<td>\n0.415\n</td>\n<td>0.400</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.015\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+3.75\n </div>\n</td>\n<td>211</td>\n<td>123</td>\n<td>0.410</td>\n<td>0.415</td>\n<td>694</td>\n<td>\n0.420\n</td>\n<td>\n0.410\n</td>\n<td class=\"stock-id hidden\">5238</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">4</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nABLEGLOB [S]\n</td>\n<td>7167</td>\n<td class=\"nowrap\"></td>\n<td>\n1.330\n</td>\n<td>1.280</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.050\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+3.91\n</div>\n</td>\n<td>1,638</td>\n<td>42</td>\n<td>1.320</td>\n<td>1.330</td>\n<td>420</td>\n<td>\n1.330\n</td>\n<td>\n1.290\n</td>\n<td class=\"stock-id hidden\">7167</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">5</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nABLEGRP [S]\n</td>\n<td>7086</td>\n<td class=\"nowrap\"></td>\n<td>\n0.105\n</td>\n<td>0.110</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-4.55\n</div>\n</td>\n<td>100</td>\n<td>1,100</td>\n<td>0.110</td>\n<td>0.115</td>\n<td>723</td>\n<td>\n0.105\n</td>\n<td>\n0.105\n</td>\n<td class=\"stock-id hidden\">7086</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">6</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nACEINNO [S]\n</td>\n<td>03028</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.350</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>-</td>\n<td>-</td>\n<td>-</td>\n<td>-</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">03028</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">7</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nACME [S]\n</td>\n<td>7131</td>\n<td class=\"nowrap\"></td>\n<td>\n0.190\n</td>\n<td>0.185</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+2.70\n</div>\n</td>\n<td>3,983</td>\n<td>1,290</td>\n<td>0.180</td>\n<td>0.185</td>\n<td>329</td>\n<td>\n0.190\n</td>\n<td>\n0.185\n</td>\n<td class=\"stock-id hidden\">7131</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">8</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nACME-WA [S]\n</td>\n<td>7131WA</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.085</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>660</td>\n<td>0.075</td>\n<td>0.085</td>\n<td>4,000</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">7131WA</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">9</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nACO [S]\n</td>\n<td>0218</td>\n<td class=\"nowrap\"></td>\n<td>\n0.205\n</td>\n<td>0.205</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>1,230</td>\n<td>3,255</td>\n<td>0.200</td>\n<td>0.205</td>\n<td>366</td>\n<td>\n0.205\n</td>\n<td>\n0.205\n</td>\n<td class=\"stock-id hidden\">0218</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">10</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nADVCON [S]\n</td>\n<td>5281</td>\n<td class=\"nowrap\"></td>\n<td>\n0.245\n</td>\n<td>0.240</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+2.08\n</div>\n</td>\n<td>100</td>\n<td>800</td>\n<td>0.245</td>\n<td>0.250</td>\n<td>120</td>\n<td>\n0.245\n</td>\n<td>\n0.245\n</td>\n<td class=\"stock-id hidden\">5281</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">11</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nADVENTA [S]\n</td>\n<td>7191</td>\n<td class=\"nowrap\"></td>\n<td>\n0.725\n</td>\n<td>0.720</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+0.69\n</div>\n</td>\n<td>16,130</td>\n<td>300</td>\n<td>0.725</td>\n<td>0.730</td>\n<td>1,178</td>\n <td>\n0.750\n</td>\n<td>\n0.715\n</td>\n<td class=\"stock-id hidden\">7191</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">12</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nADVPKG [S]\n</td>\n<td>9148</td>\n<td class=\"nowrap\"></td>\n<td>\n2.550\n</td>\n<td>2.520</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.030\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+1.19\n</div>\n</td>\n<td>150</td>\n<td>100</td>\n<td>2.520</td>\n<td>2.550</td>\n<td>50</td>\n<td>\n2.550\n</td>\n<td>\n2.550\n</td>\n<td class=\"stock-id hidden\">9148</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">13</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAEM [S]\n</td>\n<td>7146</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.020</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>2,133</td>\n<td>0.015</td>\n<td>0.020</td>\n<td>93,377</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">7146</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">14</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAEM-WB [S]\n</td>\n<td>7146WB</td>\n<td class=\"nowrap\"></td>\n<td>\n0.005\n</td>\n<td>0.005</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>400</td>\n<td>-</td>\n<td>-</td>\n<td>0.005</td>\n<td>976</td>\n<td>\n0.005\n</td>\n<td>\n0.005\n</td>\n<td class=\"stock-id hidden\">7146WB</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">15</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAEMULUS [S]\n</td>\n<td>0181</td>\n<td class=\"nowrap\">s</td>\n<td>\n0.335\n</td>\n<td>0.345</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.010\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-2.90\n</div>\n</td>\n<td>38,734</td>\n<td>8,912</td>\n<td>0.335</td>\n<td>0.340</td>\n<td>2,972</td>\n<td>\n0.355\n</td>\n<td>\n\n0.335\n</td>\n<td class=\"stock-id hidden\">0181</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">16</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAEON [S]\n</td>\n<td>6599</td>\n<td class=\"nowrap\">s</td>\n<td>\n1.400\n</td>\n<td>1.410</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.010\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-0.71\n</div>\n</td>\n<td>1,933</td>\n<td>3,219</td>\n<td>1.400</td>\n<td>1.410</td>\n<td>1,514</td>\n<td>\n1.410\n</td>\n<td>\n1.400\n</td>\n<td class=\"stock-id hidden\">6599</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">17</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAFUJIYA [S]\n</td>\n<td>5198</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.410</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>170</td>\n<td>0.370</td>\n<td>0.405</td>\n<td>250</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">5198</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">18</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAGES [S]\n</td>\n<td>7145</td>\n<td class=\"nowrap\"></td>\n<td>\n0.265\n</td>\n<td>0.270</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-1.85\n</div>\n</td>\n<td>6,421</td>\n<td>2,129</td>\n<td>0.260</td>\n<td>0.265</td>\n<td>500</td>\n<td>\n0.275\n</td>\n<td>\n0.260\n</td>\n<td class=\"stock-id hidden\">7145</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">19</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAHB [S]\n</td>\n<td>7315</td>\n<td class=\"nowrap\"></td>\n<td>\n0.110\n</td>\n<td>0.115</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-4.35\n</div>\n</td>\n<td>6,750</td>\n<td>32,651</td>\n<td>0.110</td>\n<td>0.115</td>\n<td>22,705</td>\n<td>\n0.115\n</td>\n<td>\n0.110\n </td>\n<td class=\"stock-id hidden\">7315</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">20</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAHEALTH [S]\n</td>\n<td>7090</td>\n<td class=\"nowrap\">s</td>\n<td>\n3.220\n</td>\n<td>3.240</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.020\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-0.62\n</div>\n</td>\n<td>343</td>\n<td>19</td>\n<td>3.210</td>\n<td>3.250</td>\n<td>87</td>\n<td>\n3.220\n</td>\n<td>\n3.220\n</td>\n<td class=\"stock-id hidden\">7090</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">21</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAIM [S]\n</td>\n<td>0122</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.070</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>1,500</td>\n<td>0.075</td>\n<td>0.090</td>\n<td>901</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">0122</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">22</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nAIMFLEX [S]\n</td>\n<td>0209</td>\n<td class=\"nowrap\"></td>\n<td>\n0.140\n</td>\n<td>0.135</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+3.70\n</div>\n</td>\n<td>52,742</td>\n<td>75,508</td>\n<td>0.135</td>\n<td>0.140</td>\n<td>12,489</td>\n<td>\n0.140\n</td>\n<td>\n0.135\n</td>\n<td class=\"stock-id hidden\">0209</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">23</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nAJI [S]\n</td>\n<td>2658</td>\n<td class=\"nowrap\"></td>\n<td>\n11.100\n</td>\n<td>11.020</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.080\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+0.73\n</div>\n</td>\n<td>83</td>\n<td>31</td>\n<td>11.000</td>\n<td>11.100</td>\n<td>15</td>\n<td>\n11.100\n</td>\n<td>\n11.000\n</td>\n<td class=\"stock-id hidden\">2658</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">24</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAJIYA [S]\n</td>\n<td>7609</td>\n<td class=\"nowrap\"></td>\n<td>\n1.180\n</td>\n<td>1.180</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>2,276</td>\n<td>203</td>\n<td>1.180</td>\n<td>1.190</td>\n<td>1,892</td>\n<td>\n1.190\n</td>\n<td>\n1.180\n</td>\n<td class=\"stock-id hidden\">7609</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">25</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nALAM [S]\n</td>\n<td>5115</td>\n<td class=\"nowrap\"></td>\n<td>\n0.030\n</td>\n<td>0.030</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>14,484</td>\n<td>793,649</td>\n<td>0.025</td>\n<td>0.030</td>\n<td>1,045</td>\n<td>\n0.030\n</td>\n<td>\n0.030\n</td>\n<td class=\"stock-id hidden\">5115</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">26</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nALAQAR [S]\n</td>\n<td>5116</td>\n<td class=\"nowrap\">s</td>\n<td>\n1.200\n</td>\n<td>1.200</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>503</td>\n<td>679</td>\n<td>1.190</td>\n<td>1.200</td>\n<td>405</td>\n<td>\n1.200\n</td>\n<td>\n1.200\n</td>\n<td class=\"stock-id hidden\">5116</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">27</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nALRICH [S]\n</td>\n<td>0079</td>\n<td class=\"nowrap\"></td>\n<td>\n0.030\n</td>\n<td>0.030</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>24,868</td>\n<td>6,482</td>\n<td>0.030</td>\n<td>0.035</td>\n<td>21,126</td>\n<td>\n0.035\n</td>\n<td>\n0.030\n</td>\n<td class=\"stock-id hidden\">0079</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">28</td>\n<td class=\"text-left pl-4 bold\">\n\n<span class=\"down\"></span>\nALSREIT [S]\n</td>\n<td>5269</td>\n<td class=\"nowrap\"></td>\n<td>\n0.400\n</td>\n<td>0.415</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.015\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-3.61\n</div>\n</td>\n<td>8</td>\n<td>10</td>\n<td>0.410</td>\n<td>0.415</td>\n<td>26</td>\n<td>\n0.400\n</td>\n<td>\n0.400\n</td>\n<td class=\"stock-id hidden\">5269</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">29</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAME [S]\n</td>\n<td>5293</td>\n<td class=\"nowrap\">s</td>\n<td>\n1.350\n</td>\n<td>1.350</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>1,702</td>\n<td>277</td>\n<td>1.340</td>\n<td>1.350</td>\n<td>916</td>\n<td>\n1.360\n</td>\n<td>\n1.350\n</td>\n<td class=\"stock-id hidden\">5293</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">30</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nAME-WA [S]\n</td>\n<td>5293WA</td>\n<td class=\"nowrap\"></td>\n<td>\n0.090\n</td>\n<td>0.070</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.020\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+28.57\n</div>\n</td>\n<td>1</td>\n<td>10</td>\n<td>0.085</td>\n<td>0.090</td>\n<td>1,200</td>\n<td>\n0.090\n</td>\n<td>\n0.090\n</td>\n<td class=\"stock-id hidden\">5293WA</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">31</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAMEDIA [S]\n</td>\n<td>0159</td>\n<td class=\"nowrap\"></td>\n<td>\n0.185\n</td>\n<td>0.190</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-2.63\n</div>\n</td>\n<td>1,265</td>\n<td>2,640</td>\n<td>0.185</td>\n<td>0.190</td>\n<td>2,540</td>\n<td>\n0.195\n</td>\n<td>\n0.185\n</td>\n<td class=\"stock-id hidden\">0159</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">32</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAMEREIT [S]\n</td>\n<td>5307</td>\n<td class=\"nowrap\"></td>\n<td>\n1.170\n</td>\n<td>1.170</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>1,917</td>\n<td>2</td>\n<td>1.170</td>\n<td>1.180</td>\n<td>1,313</td>\n<td>\n1.180\n</td>\n<td>\n1.160\n</td>\n<td class=\"stock-id hidden\">5307</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">33</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAMLEX [S]\n</td>\n<td>03011</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.420</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>200</td>\n<td>0.400</td>\n<td>0.500</td>\n<td>2,000</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">03011</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">34</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAMTEL [S]\n</td>\n<td>7031</td>\n<td class=\"nowrap\"></td>\n<td>\n0.820\n</td>\n<td>0.820</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>4,778</td>\n<td>80</td>\n<td>0.815</td>\n<td>0.820</td>\n<td>87</td>\n<td>\n0.825\n</td>\n<td>\n0.810\n</td>\n<td class=\"stock-id hidden\">7031</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">35</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAMTEL-WA [S]\n</td>\n<td>7031WA</td>\n<td class=\"nowrap\"></td>\n<td>\n0.250\n</td>\n<td>0.255</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-1.96\n</div>\n</td>\n<td>84</td>\n<td>200</td>\n<td>0.235</td>\n<td>0.250</td>\n<td>607</td>\n<td>\n0.255\n</td>\n<td>\n0.250\n</td>\n<td class=\"stock-id hidden\">7031WA</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">36</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nAMWAY [S]\n</td>\n<td>6351</td>\n<td class=\"nowrap\"></td>\n<td>\n4.880\n</td>\n<td>4.890</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.010\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-0.20\n</div>\n</td>\n<td>40</td>\n<td>11</td>\n<td>4.870</td>\n<td>4.880</td>\n<td>10</td>\n<td>\n4.880\n</td>\n<td>\n4.880\n</td>\n<td class=\"stock-id hidden\">6351</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">37</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nANCOMLB [S]\n</td>\n<td>0048</td>\n<td class=\"nowrap\"></td>\n<td>\n0.125\n</td>\n<td>0.095</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.030\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+31.58\n</div>\n</td>\n<td>88,206</td>\n<td>1,245</td>\n<td>0.120</td>\n<td>0.125</td>\n<td>941</td>\n<td>\n0.130\n</td>\n<td>\n0.095\n</td>\n<td class=\"stock-id hidden\">0048</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">38</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nANCOMNY [S]\n</td>\n<td>4758</td>\n<td class=\"nowrap\">s</td>\n<td>\n0.985\n</td>\n<td>0.975</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.010\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+1.03\n</div>\n</td>\n<td>4,788</td>\n<td>999</td>\n<td>0.980</td>\n<td>0.990</td>\n<td>1,808</td>\n<td>\n0.995\n</td>\n<td>\n0.980\n</td>\n<td class=\"stock-id hidden\">4758</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">39</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nANCOMNY-WB [S]\n</td>\n<td>4758WB</td>\n<td class=\"nowrap\"></td>\n<td>\n0.700\n</td>\n<td>0.705</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-0.71\n</div>\n</td>\n<td>70</td>\n<td>32</td>\n<td>0.700</td>\n<td>0.705</td>\n<td>30</td>\n<td>\n0.720\n</td>\n<td>\n0.700\n</td>\n<td class=\"stock-id hidden\">4758WB</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">40</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nANEKA [S]\n</td>\n<td>0226</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.155</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n -\n</div>\n</td>\n<td>-</td>\n<td>500</td>\n<td>0.150</td>\n<td>0.165</td>\n<td>888</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">0226</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">41</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nANEKA-WA [S]\n</td>\n<td>0226WA</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.025</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>6,832</td>\n<td>0.025</td>\n<td>0.030</td>\n<td>5,468</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">0226WA</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">42</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nANNJOO [S]\n</td>\n<td>6556</td>\n<td class=\"nowrap\">s</td>\n<td>\n0.950\n</td>\n<td>0.930</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.020\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+2.15\n</div>\n</td>\n<td>5,358</td>\n<td>256</td>\n<td>0.945</td>\n<td>0.950</td>\n<td>63</td>\n<td>\n0.955\n</td>\n<td>\n0.935\n</td>\n<td class=\"stock-id hidden\">6556</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">43</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nANNUM [S]\n</td>\n<td>5082</td>\n<td class=\"nowrap\"></td>\n<td>\n0.275\n</td>\n<td>0.280</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-1.79\n</div>\n</td>\n<td>4,885</td>\n<td>188</td>\n<td>0.275</td>\n<td>0.280</td>\n<td>891</td>\n<td>\n0.280\n</td>\n<td>\n0.270\n</td>\n<td class=\"stock-id hidden\">5082</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">44</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nANZO [S]\n</td>\n<td>9342</td>\n<td class=\"nowrap\"></td>\n<td>\n0.010\n</td>\n<td>0.010</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>2,032</td>\n<td>661,483</td>\n <td>0.005</td>\n<td>0.010</td>\n<td>838</td>\n<td>\n0.010\n</td>\n<td>\n0.010\n</td>\n<td class=\"stock-id hidden\">9342</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">45</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nANZO-WB [S]\n</td>\n<td>9342WB</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>0.010</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>-</td>\n<td>-</td>\n<td>0.010</td>\n<td>1,198</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">9342WB</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">46</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAORB [S]\n</td>\n<td>03051</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>2.820</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>-</td>\n<td>-</td>\n<td>-</td>\n<td>-</td>\n<td>\n-\n</td>\n<td>\n-\n</td>\n<td class=\"stock-id hidden\">03051</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">47</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"up\"></span>\nAPB [S]\n</td>\n<td>5568</td>\n<td class=\"nowrap\"></td>\n<td>\n1.240\n</td>\n<td>1.230</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-success\">\n+0.010\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-success\">\n+0.81\n</div>\n</td>\n<td>3,688</td>\n<td>94</td>\n<td>1.240</td>\n<td>1.250</td>\n<td>511</td>\n<td>\n1.250\n</td>\n<td>\n1.230\n</td>\n<td class=\"stock-id hidden\">5568</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">48</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAPM [S]\n</td>\n<td>5015</td>\n<td class=\"nowrap\"></td>\n<td>\n-\n</td>\n<td>1.710</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>-</td>\n<td>40</td>\n<td>1.710</td>\n<td>1.800</td>\n<td>1</td>\n<td>\n-\n</td>\n<td>\n -\n</td>\n<td class=\"stock-id hidden\">5015</td>\n</tr><tr class=\"odd\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">49</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"nochange\"></span>\nAPOLLO [S]\n</td>\n<td>6432</td>\n<td class=\"nowrap\"></td>\n<td>\n3.800\n</td>\n<td>3.800</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center\">\n-\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center\">\n-\n</div>\n</td>\n<td>50</td>\n<td>60</td>\n<td>3.800</td>\n<td>3.810</td>\n<td>220</td>\n<td>\n3.810\n</td>\n<td>\n3.800\n</td>\n<td class=\"stock-id hidden\">6432</td>\n</tr><tr class=\"even\" id=\"data-1\" role=\"row\">\n<td class=\"sorting_1\">50</td>\n<td class=\"text-left pl-4 bold\">\n<span class=\"down\"></span>\nARANK [S]\n</td>\n<td>7214</td>\n<td class=\"nowrap\"></td>\n<td>\n0.515\n</td>\n<td>0.520</td>\n<td class=\"text-dark\">\n<div class=\"stock_change text-center bold text-danger\">\n-0.005\n</div>\n</td>\n<td class=\"text-dark\">\n<div class=\"text-center bold text-danger\">\n-0.96\n</div>\n</td>\n<td>70</td>\n<td>464</td>\n<td>0.515</td>\n<td>0.530</td>\n<td>40</td>\n<td>\n0.515\n</td>\n<td>\n0.515\n</td>\n<td class=\"stock-id hidden\">7214</td>\n</tr>",
  //     "\n<li class=\"paginate_button page-item previous disabled\" id=\"DataTables_Table_0_previous\">\n<a data-val=\"0\" href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"0\" tabindex=\"0\" class=\"page-link footer-page-link\"><i class=\"fas fa-angle-left\"></i></a>\n</li>\n<li class=\"paginate_button page-item active\">\n<a data-val=\"1\" href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"1\" tabindex=\"0\" class=\"page-link footer-page-link\">1</a>\n</li>\n<li class=\"paginate_button page-item \">\n<a data-val=\"2\" href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"1\" tabindex=\"0\" class=\"page-link footer-page-link\">2</a>\n</li>\n<li class=\"paginate_button page-item disabled\">\n<a href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"1\" tabindex=\"0\" class=\"page-link footer-disable-link\">…</a>\n</li>\n<li class=\"paginate_button page-item\">\n<a data-val=\"20\" href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"1\" tabindex=\"0\" class=\"page-link footer-page-link\">20</a>\n</li>\n<li class=\"paginate_button page-item next \" id=\"DataTables_Table_0_next\">\n<a data-val=\"2\" href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"2\" tabindex=\"0\" class=\"page-link footer-page-link\"><i class=\"fas fa-angle-right\"></i></a>\n</li>\n<li id=\"total_page\" data-val=\"20\" style=\"display:none;\"></li>\n"
  //   ]
  // ]

    const paginationText = (response[0][1] as string).trim()
    const maxPageNumber = paginationTextToMaxPageNumber(paginationText) || 0
    let dataText = (response[0][0] as string).trim()

    return {maxPageNumber, dataText}
  }

  let gMaxPageNumber = 0
  let gDataText = ''
  do {
    try {
      const {maxPageNumber, dataText} = await extractFirstInfo()
      gMaxPageNumber = maxPageNumber
      gDataText = dataText
    } catch (e) {
      console.log('Failed to extract first info. Retrying...', e)
    }
  } while (gMaxPageNumber === 0)

  // console.log(gMaxPageNumber)
  progressBar.setTotal(gMaxPageNumber)

  const stocks: {code: string, stockName: string}[] = []


  stocks.push(...tableDataToStocks(gDataText))

  // console.log(stocks)
  const { results, errors } = await PromisePool.for(Array.from({ length: gMaxPageNumber - 1 }))
    .withConcurrency(5) // 5 pages at a time
    .process(async (_, i) => {
      const i2 = i + 1 // Starts from 1 as 0 has been retrieved
      const pageNo = `${i2 + 1}`.padStart(2, '0')

      let shariahList = await fetchStockList(i2 + 1)
      while (shariahList.length <= 0) {
        await delay(1)
        progressBar.increment(0, { stats: `Page ${pageNo}: retry` })
        shariahList = await fetchStockList(i2 + 1)
      }

      progressBar.increment(0.5, { stats: `Page ${pageNo}: scraped` })
      const shariahListWithFullname = await addCompanyFullname(shariahList)

      progressBar.increment(0.5, { stats: `Page ${pageNo}: done` })

      return shariahListWithFullname
    })

  // TODO: fixme if there is error in pool
  if (errors.length) {
    console.log(errors, 'MYX, promise pool scrape failed', errors, results)
    throw new Error(`failed to scrape stock in pages`, { cause: errors })
  }

  return results.reduce((acc, chunk) => ({ ...acc, ...chunk }), {})
}

async function scrapeBursaMalaysia(): Promise<{[p: string]: {code: string, stockName: string, fullname: string}}> {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })

  try {
    const ctx = await browser.newContext()
    const initPage = await ctx.newPage()
    await initPage.goto(scrapeUrl({ page: 1, perPage: 50 }))

    await initPage.evaluate(() => console.log('This message is inside an alert box'))

    // getting max size of syariah list by grabbing the value in pagination btn
    const maxPageNumbers = await (CONFIG.isDev
      ? Promise.resolve(1)
      : initPage.evaluate(() => {
          const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
            .map((i) => i.textContent)
            .map(i => {
              return i
            })
            .flatMap(s => s ? [s] : [])
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
        await page.goto(scrapeUrl({ page: i + 1, perPage: 50 }), { waitUntil: 'networkidle' })

        // this does the work as of retry scrapping function
        // sometime scrape return 0 items
        let shariahList = await scrapeList(page)
        while (shariahList.length <= 0) {
          await delay(1)
          progressBar.increment(0, { stats: `Page ${pageNo}: retry` })
          shariahList = await scrapeList(page)
        }

        progressBar.increment(0.5, { stats: `Page ${pageNo}: scraped` })
        const shariahListWithFullname = await addCompanyFullname(shariahList)

        progressBar.increment(0.5, { stats: `Page ${pageNo}: done` })

        return shariahListWithFullname
      })

    // TODO: fixme if there is error in pool
    if (errors.length) {
      console.log(errors, 'MYX, promise pool scrape failed', errors, results)
      throw new Error(`failed to scrape stock in pages`, { cause: errors })
    }

    return results.reduce((acc, chunk) => ({ ...acc, ...chunk }), {})
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to scrape MYX data', e)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

/**
 * Main MYX scrape function
 **/
export default async function(): Promise<ScrapeResult> {
  try {
    const stockList = await scrapeBursaMalaysia2()
    const stockSimplifiedList: {code: string, name: string}[] = pipe(Object.values,
                      (values: any) => values.map((val: any) => {
                        return {code: val.stockName, name: val.fullname}
                      }))(
        stockList
    )

    return {MYX: { stocks: stockSimplifiedList, updatedAt: new Date(), market: CONFIG.MYX.market}}
  } catch (e) {
    throw new Error(`Error generating MYX`, { cause: e })
  }
}
