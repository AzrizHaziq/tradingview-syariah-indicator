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
  const element = document.querySelector('[data-name="legend-source-title"]')
  const { s: isShariah, msc = 0 } = tsi.lookForStockCode(`${ tsi.TRADING_VIEW_MYR }:${ getSymbolsFromTitle() }`)

  if (isShariah) {
    if (tsi.isSyariahIconExist(element.parentElement)) {
      // if icon already exist dont do anything
    } else {
      element.parentElement.prepend(tsi.createIcon({ width: 15, height: 15 }))
    }
  } else {
    // if not syariah delete all icon
    tsi.deleteSyariahIcon()
  }

  if (msc) {
    if (tsi.isMSCIconExist(element.parentElement)) {
      // if icon already exist dont do anything
    } else {
      const mscIcon = tsi.createMSCIcon(element.parentElement)
      mscIcon.style.marginLeft = '5px'
      element.insertAdjacentElement('beforebegin', mscIcon)
    }
  } else {
    tsi.deleteMSCIcon(element.parentElement)
  }
}

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0].trim()  // also cover syntax like warrant
}
