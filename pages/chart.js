/* global TRADING_VIEW_MYR */
/* global lookForShariah addStaticSyariahIcon isSyariahIconExist deleteSyariahIcon createIcon */

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

addStaticSyariahIcon()

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0].trim()  // also cover syntax like warrant
}

function receiveSignalFromBgScript() {
  const { s: isShariah } = lookForShariah(`${ TRADING_VIEW_MYR }:${ getSymbolsFromTitle() }`)

  if (!isShariah) {
    // didnt found symbol within malaysian stocks
    deleteSyariahIcon()
    return
  }

  if (isShariah) {
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
