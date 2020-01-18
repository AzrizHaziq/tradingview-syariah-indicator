let isObservingFlagChanges = false
let isObservingTableChanges = false
let SYARIAH_COMPLIANCE_LIST = []

if(browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('SCREENER: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

function observeCurrentMarket() {
  if(isObservingFlagChanges) {
    console.log('Already observe market')
    return
  }

  const MYFlagNode = document.querySelector('.tv-flag-country.tv-flag-country--my[alt="my"]')

  if(MYFlagNode) {
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

  isObservingFlagChanges = true
}

function observedTableChanges() {
  if(isObservingTableChanges) {
    console.log('Already observe table')
    return
  }

  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(([mutation]) => {
    Array.from(mutation.target.children).forEach((child, i) => {
      const rowSymbol = child.getAttribute('data-symbol')
      const isSyariah = SYARIAH_COMPLIANCE_LIST[rowSymbol]

      if(isSyariah) {
        const dom = child.querySelector('.tv-screener-table__symbol-right-part span')
        if(isSyariahIconExist(dom)) {
          // if icon already exist dont do anything
        } else {
          dom.insertAdjacentElement('beforeend', syariahIcon({ width: 10, top: '1px' }))
        }
      }
    })
  })

  // Start observing the target node for configured mutations
  observer.observe(tableNode, { subtree: true, childList: true })

  isObservingTableChanges = true
}

function receiveSignalFromBgScript({ list }) {
  SYARIAH_COMPLIANCE_LIST = list.reduce((acc, cur) => ({
    ...acc,
    [cur.id]: cur.syariah,
  }), {})

  observeCurrentMarket()
}
