/* global tsi */
tsi.addStaticSyariahIcon()
tsi.retryFn()(observeChartChanges)
browser.runtime.onMessage.addListener(chartScript)

const symbolNode = document.querySelector('[data-name="legend-series-item"]')
tsi.forceMutationChanges(symbolNode)

function observeChartChanges() {
  // have to target dom like below since this is the most top parent
  const symbolNode = document.querySelector('[data-name="legend-series-item"]')

  tsi.observeNodeChanges(symbolNode, chartScript)
  tsi.forceMutationChanges(symbolNode)
}

function chartScript() {
  const { s: isShariah } = tsi.lookForStockCode(`${ tsi.TRADING_VIEW_MYR }:${ getSymbolsFromTitle() }`)

  if (!isShariah) {
    // didnt found symbol within malaysian stocks
    tsi.deleteSyariahIcon()
    return
  }

  if (isShariah) {
    const element = document.querySelector('[data-name="legend-source-title"]')

    // if icon already exist dont do anything
    if (tsi.isSyariahIconExist(element.parentElement)) {
      return
    }

    element.parentElement.prepend(tsi.createIcon({ width: 15, height: 15 }))
  } else {
    // if not syariah delete all icon
    tsi.deleteSyariahIcon()
  }
}

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0].trim()  // also cover syntax like warrant
}
