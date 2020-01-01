let isObservingFlagChanges = false;
let isObservingTableChanges = false;

if(browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('SCREENER: Registered listener')
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
}
