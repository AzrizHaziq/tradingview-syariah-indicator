/* global addStaticSyariahIcon isSyariahIconExist deleteSyariahIcon createIcon */
/* global TRADING_VIEW_MYR */

if (browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('CHART: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

addStaticSyariahIcon()

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0]  // also cover syntax like warrant
}

function receiveSignalFromBgScript({ list: SYARIAH_COMPLIANCE_LIST }) {
  const isSyariah = SYARIAH_COMPLIANCE_LIST[`${ TRADING_VIEW_MYR }:${ getSymbolsFromTitle() }`]

  if (!isSyariah) {
    // didnt found symbol within malaysian stocks
    deleteSyariahIcon()
    return
  }

  if (isSyariah) {
    const element = document.querySelector('[data-name="legend-source-title"]')

    // if icon already exist dont do anything
    if (isSyariahIconExist(element.parentElement)) {
      return
    }

    element.parentElement.prepend(createIcon({ width: 15, height: 15 }))
  } else {
    // if not syariah delete all icon
    deleteSyariahIcon()
  }
}
