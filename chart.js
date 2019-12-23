const TRADING_VIEW_MYR = 'MYX'
const attributeName = 'data-indicator'
const extensionName = 'tradingview-syariah-indicator'

const span = document.createElement('span')
span.setAttribute(attributeName, extensionName)
span.style.color = '#1abc9c'
span.innerText = '[s]'

const img = document.createElement('img')
img.src = browser.extension.getURL('syariah-icon.svg')
img.alt = 'Malaysian Syariah Compliance'
img.width = 15

if (browser.runtime.onMessage.hasListener(receiveDataFromBackground)) {
  console.log('CHART: Registered listener')
  browser.runtime.onMessage.removeListener(receiveDataFromBackground)
}

browser.runtime.onMessage.addListener(receiveDataFromBackground)

function receiveDataFromBackground({ list: SYARIAH_COMPLIANCE_LIST }) {
  const element = document.querySelector('[data-name="legend-source-title"]')

  if (!element) {
    return
  }

  const domTittleName = document.getElementsByTagName('title')[0].innerText
  const currentChartStockId = /\w+/.exec(domTittleName)[0]
  const found = SYARIAH_COMPLIANCE_LIST.find(i => i.id === `${ TRADING_VIEW_MYR }:${ currentChartStockId }`)

  const { previousElementSibling, parentElement } = element

  if (!found) {
    // didnt found stockId within malaysian stocks
    previousElementSibling.remove()
    return
  }

  if (found.syariah) {
    if (previousElementSibling && previousElementSibling.getAttribute(attributeName) === extensionName) {
      console.log('duplicated indicator')
    } else {
      parentElement.prepend(img)
    }
  } else {
    previousElementSibling.remove()
  }
}
