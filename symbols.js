const TRADING_VIEW_MYR = 'MYX'
const attributeName = 'data-indicator'
const extensionName = 'tradingview-syariah-indicator'

if(browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('CHART: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

function receiveSignalFromBgScript({ list: SYARIAH_COMPLIANCE_LIST }) {
  const found = SYARIAH_COMPLIANCE_LIST.find(i => i.id === `${ TRADING_VIEW_MYR }:${ getSymbols() }`)

  if(found.syariah) {
    const largeResoDom = document.querySelector('h1 div.tv-symbol-header__short-title')
    const smallResoDom = document.querySelector('.tv-symbol-header__text-group--mobile .tv-symbol-header__short-title')

    if(isSyariahIconExist(smallResoDom)) {
      // if icon already exist dont do anything
    } else {
      smallResoDom.insertAdjacentElement('beforeend', syariahIcon({
        top: '-15px',
        marginLeft: '3px',
        position: 'relative',
      }))
    }

    if(isSyariahIconExist(largeResoDom)) {
      // if icon already exist dont do anything
    } else {
      largeResoDom.insertAdjacentElement('beforeend', syariahIcon({
        top: '2px',
        marginLeft: '3px',
        position: 'relative',
      }))
    }

  } else {
    deleteSyariahIcon()
  }
}

function isSyariahIconExist(elm) {
  return elm.querySelector(`[${ attributeName }="${ extensionName }"]`)
}

function getSymbols() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+/.exec(domTittleName)[0]
}

function deleteSyariahIcon() {
  document.querySelectorAll(`[${ attributeName }="${ extensionName }"]`).forEach(img => img.remove())
}

function syariahIcon({ width = 15, top = '0', marginLeft = '3px', position = 'relative' }) {
  const img = document.createElement('img')
  img.setAttribute(attributeName, extensionName)
  img.src = browser.extension.getURL('syariah-icon.svg')
  img.alt = 'Malaysia Syariah Compliance'
  img.title = 'Malaysia Syariah Compliance'

  img.width = width
  img.style.top = top
  img.style.marginLeft = marginLeft
  img.style.position = position

  return img
}