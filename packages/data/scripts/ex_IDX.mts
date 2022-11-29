import xlsx from 'xlsx'
import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import extract from 'extract-zip'
import { chromium } from 'playwright-chromium'
import { ExchangeDetail, MAIN_DEFAULT_EXPORT, RESPONSE_FROM_JSON } from '@app/shared'

import { pipe } from './utils.mts'
import { CONFIG } from './CONFIG.mts'

type tempIdx = { stockCode: string; fullname: string[] }
const progressBar = CONFIG.progressBar.create(3, 0, { stats: '' })

/** Main IDX scrape function */
export default async function (): Promise<MAIN_DEFAULT_EXPORT> {
  try {
    const shariahList = await fetchShariahList()

    const human: MAIN_DEFAULT_EXPORT['human'] = pipe(Object.values, (values) =>
      values.map((val) => ['IDX', val.stockCode, val.fullname])
    )(shariahList)

    const sortedList: ExchangeDetail['list'] = pipe(
      Object.values,
      (entries) => entries.sort(({ stockCode: keyA }, { stockCode: keyB }) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)),
      (items) =>
        items.reduce((acc, { code, stockCode, fullname, ...res }) => ({ ...acc, [stockCode]: Object.values(res) }), {})
    )(shariahList)

    return {
      human,
      data: {
        IDX: {
          updatedAt: Date.now(),
          list: sortedList,
          shape: CONFIG.IDX.shape,
          market: CONFIG.IDX.market,
        },
      } as RESPONSE_FROM_JSON,
    }
  } catch (e) {
    throw Error(`Error generating IDX`, { cause: e })
  }
}

async function fetchShariahList(): Promise<tempIdx[]> {
  const browser = await chromium.launch({ headless: false })

  try {
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'

    const ctx = await browser.newContext({ userAgent })
    const page = await ctx.newPage()
    await page.goto(CONFIG.IDX.home_page)

    // Download the latest ISSI (Indeks Saham Syariah Indonesia) zip file
    const temp = async () => {
      if (!(await page.locator('#vs1__combobox').isVisible())) {
        await page.waitForTimeout(1000)
        await page.reload()
        progressBar.increment(1, { stats: 'IDX reloading' })
        await temp()
      }
    }
    await temp() // have to do this because they just update the UI and break few stuff

    await page.locator('#vs1__combobox').click()
    await page.locator('#vs1__listbox').getByText('ISSI').click()

    // Wait for the page to response and show the expected widgets
    await page.waitForResponse(
      (resp) => resp.status() < 400 && ['/GetStockIndex', 'code=ISSI'].every((str) => resp.url().includes(str))
    )

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page
        .locator('#vgt-table > tbody', {
          hasText: new RegExp(
            'As\\s+of\\s+\\d{1,2}\\s+(January|February|March|April|Mei|Jun|July|August|September|October|November|December)\\s+\\d{4}',
            'i'
          ),
        })
        .locator('a[href$="zip"]')
        .first()
        .click(), // find the first zip file in table
    ])

    // Wait for the download process to complete
    const zipPath = await download.path()
    progressBar.increment(1, { stats: 'Successfully retrieved zip file from Indonesian exchange official website' })

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

/** Return: string e.g. /tmp/file.xlsx */
async function getXlsxFile(filePath: string): Promise<string> {
  // Unzip the file
  const extractionDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tvidx'))
  await extract(filePath, { dir: extractionDir })

  const xlsxFile = fs.readdirSync(extractionDir).find((file) => new RegExp('.*ISSI.*.(.xlsx)', 'ig').test(file)) ?? ''

  if (!xlsxFile) throw Error('IDX xlsx file empty')
  return path.resolve(extractionDir, xlsxFile)
}

function extractFromXlsxFile(xlsxFile: string): Promise<tempIdx[]> {
  const workbook = xlsx.readFile(xlsxFile)

  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 })

  let codeColIdx = -1

  return data
    .flatMap((row) => {
      if (codeColIdx != -1) {
        const stockCode = row[codeColIdx]
        const fullname = row[codeColIdx + 1]

        if (stockCode && stockCode.match(/^([A-Z]{4})$/)) {
          return { s: 1, stockCode, fullname } // s:1 is Shariah
        }
      } else {
        codeColIdx = findCodeColumnIndex(row)
      }

      return null
    })
    .filter(Boolean)
}

function findCodeColumnIndex(colValues: string[]): number {
  for (let i = 0; i < colValues.length; i++) {
    const value = colValues[i]
    if (value && value.toString().toLowerCase().includes('kode')) {
      return i
    }
  }

  return -1
}
