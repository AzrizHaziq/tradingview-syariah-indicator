const TRADING_VIEW_MYR = 'MYX'
const attributeName = 'data-indicator'
const extensionName = 'tradingview-syariah-indicator'

if (browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('CHART: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

function receiveSignalFromBgScript({ list: SYARIAH_COMPLIANCE_LIST }) {
  // check if market is not MY
  if (!document.querySelector('.tv-flag-country.tv-flag-country--my[alt="my"]')) {
    return ;
  }

  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(function (mutations) {
    // Use traditional 'for loops' for IE 11
    console.log('mutations', mutations)

    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.')
      } else if (mutation.type === 'attributes') {
        console.log('The ' + mutation.attributeName + ' attribute was modified.')
      }
    }
  })

  // Start observing the target node for configured mutations
  observer.observe(tableNode, { childList: true, subtree: true })
  console.log('observed')
  // const found = SYARIAH_COMPLIANCE_LIST.find(i => i.id === `${ TRADING_VIEW_MYR }:${ getSymbols() }`)

  // if (!found) {
  //   // didnt found symbol within malaysian stocks
  //   deleteSyariahIcon()
  //   return
  // }
  //
  // if (found.syariah) {
  //   const element = document.querySelector('[data-name="legend-source-title"]')
  //
  //   // if icon already exist dont do anything
  //   if (isSyariahIconExist(element.parentElement)) {
  //     return
  //   }
  //
  //   element.parentElement.prepend(syariahIcon())
  // } else {
  //   // if not syariah delete all icon
  //   deleteSyariahIcon()
  // }
}

function isSyariahIconExist(elm) {
  return elm.querySelector(`[${ attributeName }="${ extensionName }"]`)
}

function getSymbols() {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+/.exec(domTittleName)[0]
}

function syariahIcon(styles = { top: 0, marginLeft: '3px', position: 'relative' }) {
  const img = document.createElement('img')
  img.setAttribute(attributeName, extensionName)
  img.src = browser.extension.getURL('syariah-icon.svg')
  img.alt = 'Malaysia Syariah Compliance'
  img.title = 'Malaysia Syariah Compliance'

  img.width = 15
  img.style.top = styles.top
  img.style.marginLeft = styles.marginLeft
  img.style.position = styles.position

  return img
}

function deleteSyariahIcon() {
  document.querySelectorAll(`[${ attributeName }="${ extensionName }"]`).forEach(img => img.remove())
}
