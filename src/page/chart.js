/* global tsi */
tsi.addStaticSyariahIcon()
tsi.waitForElm('[data-name="legend-series-item"]').then(mainScript)

function mainScript() {
  // have to target dom like below since this is the most top parent
  const symbolNode = document.querySelector('[data-name="legend-series-item"]')
  tsi.observeNodeChanges(symbolNode, chartScript)
}

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0].trim() // also cover syntax like warrant
}

async function chartScript() {
  const { parentElement } = document.querySelector('[data-name="legend-source-title"]')
  const { s: isShariah, msc = 0 } = await tsi.lookForStockCode(`${tsi.TRADING_VIEW_MYR}:${getSymbolsFromTitle()}`)

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

  if (msc) {
    if (tsi.isMSCIconExist(parentElement.parentElement)) {
      // if icon already exist dont do anything
    } else {
      const mscIcon = tsi.createMSCIcon()
      mscIcon.style.marginLeft = '5px'
      parentElement.querySelector('[data-name="legend-source-title"]').insertAdjacentElement('beforebegin', mscIcon)
    }
  } else {
    tsi.deleteMSCIcon(parentElement)
  }
}
