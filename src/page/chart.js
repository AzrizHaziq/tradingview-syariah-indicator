/* global tsi */
tsi.addStaticSyariahIcon()

const receiveSignal = () => tsi.retryFn()(chartScript)

browser.runtime.onMessage.addListener(receiveSignal)

window.addEventListener('load', onLoad)

function onLoad() {
  browser.runtime.sendMessage({ init: 'page-chart' }).then(() => {
    receiveSignal()
    window.removeEventListener('load', onLoad)
  })
}

function getSymbolsFromTitle() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+(-\w+)?/.exec(domTittleName)[0].trim()  // also cover syntax like warrant
}

function chartScript() {
  const { s: isShariah } = tsi.lookForShariah(`${ tsi.TRADING_VIEW_MYR }:${ getSymbolsFromTitle() }`)

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
