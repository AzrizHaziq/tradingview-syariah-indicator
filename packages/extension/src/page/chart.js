/* global tsi */
tsi.addStaticSyariahIcon()
tsi.waitForElm('[data-name="legend-series-item"]').then(tsi.setStockListInMap).then(mainScript)

browser.runtime.sendMessage({
  type: 'ga',
  subType: 'pageview',
  payload: 'chart',
})

function mainScript() {
  // have to target dom like below since this is the most top parent
  const symbolNode = document.querySelector('[data-name="legend-series-item"]')
  tsi.observeNodeChanges(symbolNode, chartScript)
}

async function chartScript() {
  const currentExchange = document.querySelector('[class*=title3rd]').textContent
  const { parentElement } = document.querySelector('[data-name="legend-source-title"]')
  const { s: isShariah } = tsi.getStockStat(`${currentExchange}:${getSymbolsFromTitle()}`)

  if (isShariah) {
    if (tsi.isSyariahIconExist(parentElement)) {
      // if icon already exist dont do anything
    } else {
      parentElement.prepend(tsi.createIcon({ width: 15, height: 15 }))
    }
  } else {
    // if not syariah delete all icon
    tsi.deleteSyariahIcon(parentElement)
  }
}

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0].trim() // also cover syntax like warrant
}
