const fs = require('fs')
const fetch = require('node-fetch')
const STOCK_LIST_FILENAME = 'stock-list.json'
const TRADING_VIEW_MYR = 'MYX';

(async function () {
  try {
    const res = await fetch('http://www.bursamarketplace.com/bin/json/stockheatmap.json')
    const { children } = await res.json()
    const stockList = children.map(({ id, $shariah, $board }) => ({
      id: `${ TRADING_VIEW_MYR }:${ id }`,
      board: $board,
      syariah: $shariah === 'Yes',
    }))

    fs.writeFile(STOCK_LIST_FILENAME, JSON.stringify(stockList, null, 2), function (err) {
      if (err) {
        throw Error(`Unable to write to file ${ STOCK_LIST_FILENAME }`)
      }
    })
  } catch (e) {
    console.error(e, 'Something when wrong')
  }
})()

