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
  const found = SYARIAH_COMPLIANCE_LIST.find(i => i.id === `${ TRADING_VIEW_MYR }:${ getSymbolsFromTitle() }`)

  if (!found) {
    // didnt found symbol within malaysian stocks
    deleteSyariahIcon()
    return
  }

  if (found.syariah) {
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
