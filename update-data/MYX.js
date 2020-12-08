import ExcelJS from 'exceljs'
import merge from 'lodash.merge'
import { pipe } from './utils.js'
import puppeteer from 'puppeteer'
import cliProgress from 'cli-progress'
import { writeToFile } from './writeToFile.js'

const TRADING_VIEW_MYX = 'MYX'
export const MYX_FILENAME = 'contents/MYX.txt'

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

async function scrapBursaMalaysia() {
  function generateShariah(SYARIAH_LIST) {
    try {
      return SYARIAH_LIST.reduce(
        (acc, name) => ({
          ...acc,
          [name]: {
            s: 1,
          },
        }),
        {}
      )
    } catch (e) {
      console.error('Error generate shariah data', e)
      process.exit(1)
    }
  }

  const scrapUrl = ({ per_page, page }) =>
    `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${page}&per_page=${per_page}`

  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(scrapUrl({ page: 1, per_page: 50 }))

    // getting max size of syariah list by grabbing the value in pagination btn
    const maxPageNumbers = await page.evaluate(() => {
      const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
        .map(i => i.textContent)
        .filter(Boolean)
        .map(parseFloat)

      return Math.max(...paginationBtn)
    })

    const syariahList = []
    progressBar.start(maxPageNumbers, 0)

    // grab all syariah list and navigate to each pages.
    for (let i = 1; i <= maxPageNumbers; i++) {
      await page.goto(scrapUrl({ page: i, per_page: 50 }), {
        waitUntil: 'networkidle2',
      })

      const temp = await page.evaluate(() => {
        const pipe = (...fn) => initialVal => fn.reduce((acc, fn) => fn(acc), initialVal)

        const removeSpacesAndSyariahSymbol = pipe(
          name => name.replace(/\s/gm, ''),
          name => name.replace(/\[S\]/gim, '')
        )

        return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr :nth-child(2)')).map(name =>
          removeSpacesAndSyariahSymbol(name.textContent)
        )
      })

      syariahList.push(...temp)
      progressBar.increment()
    }

    await browser.close()

    console.log('\n\nFound: ', syariahList.length)

    return generateShariah(syariahList)
  } catch (e) {
    console.error('Error scrap data', e)
    process.exit(1)
  }
}

async function generateMidSmallCap() {
  let excelFile
  const workbook = new ExcelJS.Workbook()

  try {
    excelFile = await workbook.xlsx.readFile('./msc.xlsx')
  } catch (e) {
    console.error('Error generateMidSmallCap data', e)
    process.exit(1)
  }

  const sheet = excelFile.getWorksheet(1)

  const mscAt = sheet.getCell(1, 1).value
  const mscLink = sheet.getCell(2, 1).value.text

  let firstRowItem
  sheet.getColumn(1).eachCell((i, rowNumber) => {
    // getting the first item in the list, which ignore all table headers etc
    if (i.value === 1) {
      firstRowItem = rowNumber
    }
  })

  return {
    mscAt,
    mscLink,
    mscList: sheet
      .getColumn(4)
      .values.slice(firstRowItem)
      .reduce(
        (acc, stockCode) => ({
          ...acc,
          [stockCode]: {
            msc: 1,
          },
        }),
        {}
      ),
  }
}

function myxFilenameTransformer(data, flagId = TRADING_VIEW_MYX) {
  const bufferPadRightSize = 1

  const {
    [TRADING_VIEW_MYX]: { list, ...rest },
  } = data

  const maxStockLength = Math.max(...Object.keys(list).map(i => i.length))
  const maxRestLength = Math.max(...Object.keys(rest).map(i => i.length))

  function metaDataDisplayed(key, value) {
    return `${key.padEnd(maxRestLength + bufferPadRightSize, ' ')}: ${value}`
  }

  function listDisplayed(stockName, values) {
    return `${stockName.padEnd(maxStockLength + bufferPadRightSize, ' ')}: ${Object.keys(values).join(', ')}`
  }

  function dash(length = 20, char = '-') {
    return Array.from({ length }, _ => char).join('')
  }

  return `
${flagId}
${Object.entries(rest)
  .reduce((acc, [key, value]) => acc + '\n' + metaDataDisplayed(key, value), '')
  .trim()}
${dash()}
${Object.entries(list).reduce((acc, [key, value]) => acc + '\n' + listDisplayed(key, value), '')}`.trim()
}

export async function MYX() {
  try {
    const shariahList = await scrapBursaMalaysia()
    const { mscAt, mscLink, mscList } = await generateMidSmallCap()

    const sortedList = pipe(
      Object.entries,
      entries => entries.sort(([keyA], [keyB]) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)),
      Object.fromEntries
    )(merge(shariahList, mscList))

    const NEW_MYX_DATA = {
      [TRADING_VIEW_MYX]: {
        mscAt,
        mscLink,
        updatedAt: new Date(),
        list: sortedList,
      },
    }

    // write to MYX
    await writeToFile(MYX_FILENAME, myxFilenameTransformer(NEW_MYX_DATA))

    return NEW_MYX_DATA
  } catch (e) {
    throw `Error generating ${TRADING_VIEW_MYX}`
  }
}
