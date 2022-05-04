import fetch from 'node-fetch'
import { pipe } from './utils.mjs'
import { CONFIG } from './CONFIG.mjs'
import { chromium } from 'playwright-chromium'
import { PromisePool } from '@supercharge/promise-pool'
import xlsx from 'xlsx'
import extract from 'extract-zip'
import fs from 'fs'
import path from 'node:path'
import os from 'os'

const progressBar = CONFIG.progressBar.create(100, 0, { stats: '' })

async function fetchShariahList() {
  try {
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'    

    const browser = await chromium.launch()
    const ctx = await browser.newContext({userAgent})
    const page = await ctx.newPage()
    await page.goto('https://www.idx.co.id/data-pasar/data-saham/indeks-saham/')

    // Download the latest ISSI (Indeks Saham Syariah Indonesia) zip file
    await page.selectOption('select#indexCodeList', 'ISSI')
    await page.locator('text=Cari').click({ timeout: 10000 })
    
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('table#indexConstituentTable tr:nth-child(1) a').click(),
    ])

    // Wait for the download process to complete
    const zipPath = await download.path()
    progressBar.increment(1, { stats: 'Successfully retrieved zip file from Indonesian exchange official website' })
    
    const xlsxFile = await getXlsxFile(zipPath)
    progressBar.increment(1, { stats: 'Successfully found XLSX file containing the ISSI list' })
    
    const shariahList = await extractFromXlsxFile(xlsxFile)
    progressBar.increment(1, { stats: 'Successfully extracted and parsed ISSI list' })

    await browser.close()
    return shariahList
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to download the ISSI list zip file', e)
    process.exit(1)
  }
}

// Return: string e.g. /tmp/file.xlsx
async function getXlsxFile(filePath) {
  // Unzip the file
  const extractionDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tvidx'))
  await extract(filePath, { dir: extractionDir })

  // Get the list file
  let xlsxFile = undefined
  fs.readdirSync(extractionDir)
    .filter(file => file.match(new RegExp(`.*\.(.xlsx)`, 'ig')))
    .forEach(function(file) {
      xlsxFile = path.resolve(extractionDir, file) // Absolute path
    })
	
  return xlsxFile
}

// Returns: {code: string, name: string}[]
function extractFromXlsxFile(xlsxFile) {
  const workbook = xlsx.readFile(xlsxFile)

  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = xlsx.utils.sheet_to_json(sheet)

  const shariaStocks = []
  data.map(row => {
    const codeCandidate = row.__EMPTY
    const nameCandidate = row.__EMPTY_1
    if (codeCandidate && codeCandidate.match(/^([A-Z]{4})$/)) {
      shariaStocks.push({code: codeCandidate, name: nameCandidate})
    }
  })

  return shariaStocks
}

export async function IDX() {
  try {
    const shariahList = await fetchShariahList()

    const human = pipe(Object.values, (values) => values.map((val) => ['IDX', val.code, val.name]))(
      shariahList
    )

    const sortedList = pipe(
      Object.values,
      (entries) => entries.sort(({ stockName: keyA }, { stockName: keyB }) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)),
      (items) =>
        items.reduce((acc, { code, stockName, fullname, ...res }) => ({ ...acc, [stockName]: Object.values(res) }), {})
    )(shariahList)

    return {
      human,
      data: {
        IDX: {
          updatedAt: Date.now(),
          shape: CONFIG.IDX.shape,
          list: sortedList,
        },
      },
    }
  } catch (e) {
    throw Error(`Error generating IDX: ${e}`)
  }
}
