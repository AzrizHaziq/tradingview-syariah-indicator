const fs = require('fs');
const { chromium } = require('playwright');

const STOCK_LIST_FILENAME = 'stock-list.json'
const TRADING_VIEW_MYR = 'MYX'
const SAVE_STOCK_PATH = `background/${STOCK_LIST_FILENAME}`;

(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(initUrl({ page: 1, per_page: 50 }))

  // getting max size of syariah list by grabbing the value in pagination btn
  const maxPageNumbers = await page.evaluate(() => {
    const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
      .map(i => i.textContent)
      .filter(Boolean)
      .map(parseFloat)

    return Math.max(...paginationBtn)
  })

  const syariahList = []

  // grab all syariah list and navigate to each pages.
  for(let i = 1; i <= maxPageNumbers; i++) {
    await page.goto(initUrl({ page: i, per_page: 50 }))

    const temp = await page.evaluate(() => {
      const pipe = (...fn) => (initialVal) => fn.reduce((acc, fn) => fn(acc), initialVal)

      const removeSpacesAndSyariahSymbol = pipe(
        name => name.replace(/\s/gm, ''),
        name => name.replace(/\[S\]/igm, '')
      )

      return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr :nth-child(2)'))
        .map(name => removeSpacesAndSyariahSymbol(name.textContent))
    })

    syariahList.push(...temp)
  }

  await browser.close()

  console.log("found: ", syariahList.length)
  console.log(syariahList)

  const SYARIAH_LIST = syariahList.reduce((acc, name) => {
    return {
      ...acc,
      [`${TRADING_VIEW_MYR}:${name}`]: true
    }
  }, {})

  fs.writeFile(SAVE_STOCK_PATH, JSON.stringify(SYARIAH_LIST, null, 2), function (err) {
    if (err) {
      throw Error(`Unable to write to file ${ STOCK_LIST_FILENAME }`)
    }
  })

})()

const initUrl = ({ per_page, page } = { per_page: 50, page: 1 }) =>
  `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${ page }&per_page=${ per_page }`
