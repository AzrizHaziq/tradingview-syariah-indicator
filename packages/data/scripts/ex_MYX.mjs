import fetch from 'node-fetch'
import { pipe } from './utils.mjs'
import { CONFIG } from './CONFIG.mjs'
import { chromium } from 'playwright-chromium'

let progressBar = CONFIG.progressBar.create(100)

async function getCompanyName(temp) {
  try {
    const fetchCompanyName = async code => {
      const {
        data: {
          company_info: { name },
        },
      } = await fetch(`https://www.bursamalaysia.com/api/v1/equities_prices/sneak_peek?stock_id=${code}`).then(r =>
        r.json()
      )

      return name
    }

    const resolved = await Promise.all(
      temp.map(item => fetchCompanyName(item.code).then(fullname => ({ ...item, fullname })))
    )

    return resolved.reduce((acc, curr) => {
      acc[curr.code] = curr
      return acc
    }, {})

    // sequentially
    // temp = await Object.entries(temp).reduce(async (p, [k, v]) => {
    //   return p.then(acc => {
    //     return getCompanyName(k).then(fullname => ({
    //       ...acc,
    //       [k]: { ...v, fullname },
    //     }))
    //   })
    // }, Promise.resolve({}))
  } catch (e) {
    throw Error(`Failed at getCompanyName: ${e}`)
  }
}

async function scrapBursaMalaysia() {
  const scrapUrl = ({ per_page, page }) =>
    `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${page}&per_page=${per_page}`

  try {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(scrapUrl({ page: 1, per_page: 50 }))

    // getting max size of syariah list by grabbing the value in pagination btn
    let maxPageNumbers = await page.evaluate(() => {
      const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
        .map(i => i.textContent)
        .filter(Boolean)
        .map(parseFloat)

      return Math.max(...paginationBtn)
    })

    let syariahList = {}
    progressBar.setTotal(maxPageNumbers)

    // grab all syariah list and navigate to each pages.
    for (let i = 1; i <= maxPageNumbers; i++) {
      await page.goto(scrapUrl({ page: i, per_page: 50 }), { waitUntil: 'networkidle' })

      let temp = await page.evaluate(() => {
        const pipe = (...fn) => initialVal => fn.reduce((acc, fn) => fn(acc), initialVal)
        const removeSpaces = pipe(name => name.replace(/\s/gm, ''))
        const removeSpacesAndShariah = pipe(removeSpaces, name => name.replace(/\[S\]/gim, ''))

        return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr')).reduce((acc, tr) => {
          const s = tr.querySelector(':nth-child(2)').textContent
          const stockCode = tr.querySelector(':nth-child(3)').textContent

          const code = removeSpaces(stockCode)
          const stockName = removeSpacesAndShariah(s)
          return [...acc, { s: 1, code, stockName }]
        }, [])
      })

      progressBar.increment(0.5)
      temp = await getCompanyName(temp)
      syariahList = { ...syariahList, ...temp }
      progressBar.increment(0.5)
    }

    await browser.close()
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

    const human = pipe(Object.values, values =>
      values.map(val => ({ code: `MYX-${val.stockName}`, fullname: val.fullname }))
    )(shariahList)

    const sortedList = pipe(
      Object.values,
      entries => entries.sort(({ stockName: keyA }, { stockName: keyB }) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)),
      items =>
        items.reduce((acc, { code, stockName, fullname, ...res }) => ({ ...acc, [stockName]: Object.values(res) }), {})
    )(shariahList)

    return {
      human,
      data: {
        MYX: {
          shape: [{ 0: 'non-s', 1: 's', default: '' }],
          list: sortedList,
        },
      },
    }
  } catch (e) {
    throw `Error generating MYX: ${e}`
  }
}
