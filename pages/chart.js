if(browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('CHART: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

function receiveSignalFromBgScript({ list: SYARIAH_COMPLIANCE_LIST }) {

  const found = SYARIAH_COMPLIANCE_LIST.find(i => i.id === `${ TRADING_VIEW_MYR }:${ getSymbols() }`)

  if(!found) {
    // didnt found symbol within malaysian stocks
    deleteSyariahIcon()
    return
  }

  if(found.syariah) {
    const element = document.querySelector('[data-name="legend-source-title"]')

    // if icon already exist dont do anything
    if(isSyariahIconExist(element.parentElement)) {
      return
    }

    element.parentElement.prepend(syariahIcon({ top: 0, marginLeft: '3px', position: 'relative' }))
  } else {
    // if not syariah delete all icon
    deleteSyariahIcon()
  }
}
