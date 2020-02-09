let isObservingTableChanges = false
let SYARIAH_COMPLIANCE_LIST = []

if (browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('SCREENER: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

addStaticSyariahIcon()

// turn from array of stock list into object { [MYX:Symbol]: boolean }.
function receiveSignalFromBgScript({ list }) {
  SYARIAH_COMPLIANCE_LIST = list.reduce((acc, cur) => ({
    ...acc,
    [cur.id]: cur.syariah,
  }), {})

  observedTableChanges()
}

function observedTableChanges() {
  if (isObservingTableChanges) {
    console.log('Already observe table changes')
    return
  }

  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  const observer = new MutationObserver(([mutation]) => {
    const MYFlagNode = document.querySelector('.tv-flag-country.tv-flag-country--my[alt="my"]')

    if (!MYFlagNode) {
      deleteSyariahIcon()
      return
    }

    Array.from(mutation.target.children).forEach(child => {
      const rowSymbol = child.getAttribute('data-symbol')
      const isSyariah = SYARIAH_COMPLIANCE_LIST[rowSymbol]

      if (isSyariah) {
        const dom = child.querySelector('.tv-screener-table__symbol-right-part')
        if (isSyariahIconExist(dom)) {
          // if icon already exist dont do anything
        } else {
          const domToBeAdded = child.querySelector('.tv-screener-table__symbol-right-part a.tv-screener__symbol')
          domToBeAdded.insertAdjacentElement('afterend', createIcon({ width: 10, height: 10 }))
        }
      }
    })
  })

  // Start observing the target node for configured mutations
  observer.observe(tableNode, { childList: true })

  isObservingTableChanges = true
}
