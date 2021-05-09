import * as fs from 'fs'
import fetch from 'node-fetch'

const blackListItems = ['Cash&Other']
const downloadedCSV = 'wahed-holdings.csv'
const wahedHoldingUrl = 'https://funds.wahedinvest.com/etf-holdings.csv'

function readFile() {
  return new Promise((res, rej) => {
    // @ts-ignore
    const reader = fs.createReadStream(downloadedCSV, { encoding: 'UTF-8' })
    reader.on('data', function (chunk) {
      const str = chunk.slice(1, chunk.length)
      res(str)
    })

    reader.on('error', function (err) {
      rej(`Error readFile: ${err}`)
    })
  })
}

function downloadFile(response) {
  const dest = fs.createWriteStream(downloadedCSV)
  response.body.pipe(dest)
}

function getTickersAndSymbols(csv) {
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d)
  }

  return (
    csv
      .split('\n')
      .filter(Boolean)

      // remove not valid data (eg column header
      .reduce((acc, item) => {
        const [firstCol] = item.split(',')
        return isValidDate(new Date(firstCol)) ? acc.concat(item) : acc
      }, [])

      // get tickers & symbols
      .reduce((acc, item) => {
        const [, , ticker, , symbols] = item.split(',')

        // remove non stock item (sukuk)
        if (blackListItems.some(i => new RegExp(i, 'i').test(ticker))) {
          return acc
        }

        return [...acc, { ticker, symbols }]
      }, [])
  )
}

// function scrapeTickersName() {}

;(async () => {
  const response = await fetch(wahedHoldingUrl)
  await downloadFile(response)
  const csv = await readFile()
  const stocks = getTickersAndSymbols(csv)
})()
