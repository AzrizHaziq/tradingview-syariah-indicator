import xlsx from 'xlsx'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import extract from 'extract-zip'
import { pipe } from './utils.mjs'
import { CONFIG } from './config.mjs'
import { chromium } from 'playwright-chromium'
import 'error-cause/auto'
import { ScrapResult } from './model.mjs'

const progressBar = CONFIG.progressBar.create(3, 0, { stats: '' })

async function fetchShariahList(): Promise<{stockCode: string, fullname: string}[]> {
  const browser = await chromium.launch({ headless: !CONFIG.isDev })

  try {
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'

    const ctx = await browser.newContext({ userAgent })
    const page = await ctx.newPage()
    await page.goto('https://www.idx.co.id/data-pasar/data-saham/indeks-saham/')

    // Download the latest ISSI (Indeks Saham Syariah Indonesia) zip file
    await page.selectOption('select#indexCodeList', 'ISSI')
    await page.locator('text=Cari').click({ timeout: 10000 })

    // Wait for the page to response and show the expected widgets
    await page.waitForResponse(
      (resp) => resp.status() < 400 && ['/GetStockIndex', 'code=ISSI'].every((str) => resp.url().includes(str))
    )

    // Download the first ISSI file
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('table#indexConstituentTable tr', { hasText: new RegExp("Per\\s+\\d{1,2}\\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\\s+\\d{4}.", "i") })
          .locator('a[href$="zip"]')
           //.locator('table#indexConstituentTable tr a[href$="zip"]')
          .first().click(), // find the first zip file in table
    ])

    // Wait for the download process to complete
    const zipPath = await download.path()
    progressBar.increment(1, { stats: 'Successfully retrieved zip file from Indonesian exchange official website' })

    if (zipPath == null) {
      throw new Error('Failed to get the zip file')
    }
    const xlsxFile = await getXlsxFile(zipPath)
    progressBar.increment(1, { stats: 'Successfully found XLSX file containing the ISSI list' })

    const shariahList = extractFromXlsxFile(xlsxFile)
    progressBar.increment(1, { stats: 'Successfully extracted and parsed ISSI list' })

    return shariahList
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch or extract the ISSI stock list', e)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

async function getXlsxFile(filePath: string): Promise<string> {
  // Unzip the file
  const extractionDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tvidx'))
  await extract(filePath, { dir: extractionDir })

  // Get the list file
  let xlsxFile = ''
  fs.readdirSync(extractionDir)
    .filter((file) => file.match(new RegExp('.*ISSI.*\.(.xlsx)', 'ig')))
    .forEach((file) => {
      xlsxFile = path.resolve(extractionDir, file) // Absolute path
    })

  return xlsxFile
}

function extractFromXlsxFile(xlsxFile: string): {stockCode: string, fullname: string}[] {
  const workbook = xlsx.readFile(xlsxFile)

  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = xlsx.utils.sheet_to_json<any>(sheet, {header: 1})

  let codeColIdx = -1

  return data
    .flatMap((row: any) => {
      if (codeColIdx != -1) {
        const stockCode = row[codeColIdx]
        const fullname = row[codeColIdx + 1]

        if (stockCode && stockCode.match(/^([A-Z]{4})$/)) {
          return [{ s: 1, stockCode, fullname }] // s:1 is Shariah
        }
      } else {
        codeColIdx = findCodeColumnIndex(row)
      }

      return []
    })
    .filter(Boolean)
}

function findCodeColumnIndex(colValues: any[]): number {
  for (let i = 0; i < colValues.length; i++) {
    const value = colValues[i]
    if (value && value.toString().toLowerCase().includes('kode')) {
      return i
    }
  }

  return -1
}

/**
 * Main IDX scrape function
 **/
export default async function(): Promise<ScrapResult> {

  try {
    const shariahList = await fetchShariahList()
    const stocks = shariahList.map(stock => {
      return {code: stock.stockCode, name: stock.fullname}
    })
    return {IDX: { stocks, updatedAt: new Date()}}
  } catch (e) {
    throw new Error(`Error generating IDX`, { cause: e })
  }
}
