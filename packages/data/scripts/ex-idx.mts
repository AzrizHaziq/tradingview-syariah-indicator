import xlsx from 'xlsx'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import extract from 'extract-zip'
import { CONFIG } from './config.mjs'
import { Browser, chromium } from 'playwright-chromium'
import 'error-cause/auto'
import { ScrapeResult } from './model.mjs'
import { Retryable, BackOffPolicy } from 'typescript-retry-decorator';

const progressBar = CONFIG.progressBar.create(3, 0, { stats: '' })

class ListBuilder {

  private extractionDir: string

  constructor() {
    this.extractionDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tvidx'))
  }

  async build(): Promise<ScrapeResult> {
    const shariahList = await new ListBuilder().fetchShariahList()
    const stocks = shariahList.map(stock => {
      return {code: stock.stockCode, name: stock.fullname}
    })
    return {IDX: { stocks, updatedAt: new Date(), market: CONFIG.IDX.market}}
  }

  private async fetchShariahList(): Promise<{stockCode: string, fullname: string}[]> {
    const zipPath = await this.downloadIndexFile()
    const xlsxFile = await this.getXlsxFileFromZipFile(zipPath)
    progressBar.increment(1, { stats: 'Successfully found XLSX file containing the ISSI list' })

    const shariahList = this.extractListFromXlsxFile(xlsxFile)
    progressBar.increment(1, { stats: 'Successfully extracted and parsed ISSI list' })

    return shariahList
  }

  @Retryable({ maxAttempts: 3 })
  private async downloadIndexFile(): Promise<string> {
    let browser: Browser | undefined = undefined

    try {
      browser = await chromium.launch({ headless: !CONFIG.isDev })

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
      const zipPath = `${this.extractionDir}/issi.zip`
      await download.saveAs(zipPath)
      progressBar.increment(1, { stats: 'Successfully retrieved zip file from Indonesian exchange official website' })

      return zipPath

    } catch (e) {
      // console.error('Failed to fetch or extract the ISSI stock list', e)
      throw new Error('Failed to fetch ISSI stock list', { cause: e })

    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }

  private async getXlsxFileFromZipFile(zipFilePath: string): Promise<string> {
    // Unzip the file
    await extract(zipFilePath, { dir: this.extractionDir })

    // Get the list file
    let xlsxFile = ''
    fs.readdirSync(this.extractionDir)
      .filter((file) => file.match(new RegExp('.*ISSI.*\.(.xlsx)', 'ig')))
      .forEach((file) => {
        xlsxFile = path.resolve(this.extractionDir, file) // Absolute path
      })

    return xlsxFile
  }

  private extractListFromXlsxFile(xlsxFile: string): {stockCode: string, fullname: string}[] {
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
          codeColIdx = this.findCodeColumnIndex(row)
        }

        return []
      })
      .filter(Boolean)
  }

  private findCodeColumnIndex(colValues: any[]): number {
    for (let i = 0; i < colValues.length; i++) {
      const value = colValues[i]
      if (value && value.toString().toLowerCase().includes('kode')) {
        return i
      }
    }

    return -1
  }

}

/**
 * Main IDX scrape function
 **/
export default async function(): Promise<ScrapeResult> {
  try {
    return new ListBuilder().build()
  } catch (e) {
    throw new Error(`Error generating IDX`, { cause: e })
  }
}
