const { chromium } = require('playwright');

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

  const temp = []

  // grab all syariah list and navigate to each pages.
  for(let i = 1; i <= maxPageNumbers; i++) {
    await page.goto(initUrl({ page: i, per_page: 50 }))

    const syariahList = await page.evaluate(() => {
      const pipe = (...fn) => (initialVal) => fn.reduce((acc, fn) => fn(acc), initialVal)

      const removeSpacesAndSyariahSymbol = pipe(
        name => name.replace(/\s/gm, ''),
        name => name.replace(/\[S\]/igm, '')
      )

      return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr :nth-child(2)'))
        .map(name => removeSpacesAndSyariahSymbol(name.textContent))
    })

    temp.push(...syariahList)
  }

  console.log(temp, temp.length)

  await browser.close()
})()

const initUrl = ({ per_page, page } = { per_page: 50, page: 1 }) =>
  `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&page=${ page }&per_page=${ per_page }`
