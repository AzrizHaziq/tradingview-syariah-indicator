import browser from 'webextension-polyfill'

import {
  waitForElm,
  createIcon,
  getStockStat,
  deleteShariahIcon,
  setStockListInMap,
  isShariahIconExist,
  observeNodeChanges,
  addStaticShariahIcon,
} from '../helper'
;(async () => {
  await browser.runtime.sendMessage({
    type: 'ga',
    subType: 'pageview',
    payload: 'chart',
  })
})()

addStaticShariahIcon()
waitForElm('[data-name="legend-series-item"]').then(setStockListInMap).then(mainScript)

function mainScript() {
  // have to target dom like below since this is the most top parent
  const symbolNode = document.querySelector('[data-name="legend-series-item"]')
  observeNodeChanges(symbolNode, chartScript)
}

async function chartScript(): Promise<void> {
  const currentExchange = document.querySelector('[class*=title3rd]').textContent
  const { parentElement } = document.querySelector('[data-name="legend-source-title"]')
  const { s: isShariah } = getStockStat(`${currentExchange}:${getSymbolsFromTitle()}`)

  if (isShariah) {
    if (isShariahIconExist(parentElement)) {
      // if icon already exist dont do anything
    } else {
      parentElement.prepend(createIcon({ width: 15, height: 15 }))
    }
  } else {
    // if not syariah delete all icon
    deleteShariahIcon(parentElement)
  }
}

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0].trim() // also cover syntax like warrant
}
