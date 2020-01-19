const TRADING_VIEW_MYR = 'MYX'
const attributeName = 'data-indicator'
const extensionName = 'tradingview-syariah-indicator'

function getSymbols() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+/.exec(domTittleName)[0]
}

function isSyariahIconExist(element) {
  return element.querySelector(`[${ attributeName }="${ extensionName }"]`)
}

function deleteSyariahIcon() {
  document.querySelectorAll(`[${ attributeName }="${ extensionName }"]`).forEach(img => img.remove())
}

function syariahIcon({ width = 15, top = '0', marginLeft = '3px', position = 'relative', marginRight = '0'}) {
  const img = document.createElement('img')
  img.setAttribute(attributeName, extensionName)
  img.src = browser.extension.getURL('assets/syariah-icon.svg')
  img.alt = 'Syariah Compliance'
  img.title = 'Syariah Compliance'

  img.width = width
  img.style.top = top
  img.style.position = position
  img.style.marginLeft = marginLeft
  img.style.marginRight = marginRight

  return img
}
