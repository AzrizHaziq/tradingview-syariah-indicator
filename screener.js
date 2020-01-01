const TRADING_VIEW_MYR = 'MYX'
const attributeName = 'data-indicator'
const extensionName = 'tradingview-syariah-indicator'

let isObservingFlagChanges = false;
let isObservingTableChanges = false;

if(browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('CHART: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

function observeCurrentMarket() {
  if(isObservingFlagChanges) {
    return ;
  }

  const MYFlagNode = document.querySelector('.tv-flag-country.tv-flag-country--my[alt="my"]')

  if(MYFlagNode) {
    console.log('Already malaysian flag')
    observedTableChanges()
  }

  const observer = new MutationObserver(function(mutations) {
    for(let mutation of mutations) {
      if(mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          // if other dom get fired, ignored it
          if(!node.classList.contains('tv-flag-country')) {
            return
          }

          if(node.classList.contains('tv-flag-country--my')) {
            // console.log('malaysia')
            observedTableChanges()
          } else {
            console.log('delete Syariah icon')
            // deleteSyariahIcon()
          }
        })
      }
    }
  })

  observer.observe(
    document.querySelector('.tv-screener-market-select'),
    {
      childList: true,
      subtree: true,
    },
  )

  isObservingFlagChanges = true;
}

function observedTableChanges() {
  if(isObservingTableChanges) {
    return ;
  }

  console.log('start observe table')

  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(([mutation]) => {
    mutation.target.childNodes.forEach(child => {
      child.children[0].children[0].children[1].childNodes[1].append(syariahIcon({ width: 10, top: '1px' }))
    })
  })

  // Start observing the target node for configured mutations
  observer.observe(tableNode, { childList: true, })

  isObservingTableChanges = true;
}

function receiveSignalFromBgScript({ list: SYARIAH_COMPLIANCE_LIST }) {
  observeCurrentMarket()

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

function syariahIcon({ width = 15, top = '0', marginLeft = '3px', position=  'relative' }) {
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

function deleteSyariahIcon() {
  document.querySelectorAll(`[${ attributeName }="${ extensionName }"]`).forEach(img => img.remove())
}
