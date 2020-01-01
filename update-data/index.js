const fs = require('fs')
const fetch = require('node-fetch')
const STOCK_LIST_FILENAME = 'stock-list.json'
const TRADING_VIEW_MYR = 'MYX'
const SAVE_STOCK_PATH = `background/${STOCK_LIST_FILENAME}`;

(async function () {
  try {
    const res = await fetch('http://www.bursamarketplace.com/bin/json/stockheatmap.json')
    const { children } = await res.json()
    const stockList = children.map(({ id, $shariah, $board }) => ({
      id: `${ TRADING_VIEW_MYR }:${ id }`,
      board: $board,
      syariah: $shariah === 'Yes',
    }))

    fs.writeFile(SAVE_STOCK_PATH, JSON.stringify(stockList, null, 2), function (err) {
      if (err) {
        throw Error(`Unable to write to file ${ STOCK_LIST_FILENAME }`)
      }
    })
  } catch (e) {
    console.error(e, 'Something when wrong')
  }
})()

