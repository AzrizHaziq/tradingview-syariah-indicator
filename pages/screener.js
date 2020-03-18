const checkBoxAttribute = `${ attributeName }-filter-checkbox`
const checkBoxExtension = `${ attributeName }-filter-checkbox`
const syariahIconAttribute = `${ attributeName }-filter-icon`
const syariahIconValue = `${ extensionName }-filter-icon`

let SYARIAH_COMPLIANCE_LIST = {}
let onlyFilterSyariahStocks = false

function receiveSignalFromBgScript({ list }) {
  SYARIAH_COMPLIANCE_LIST = list

  addStaticSyariahIcon()
  setupFilterSyariahBtn()
  observedTableChanges()
}

if (browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('SCREENER: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

// turn from array of stock list into object { [MYX:Symbol]: boolean }.
function observedTableChanges() {
  let observer

  if (observer) {
    console.log('Already observe table changes')
    observer.disconnect()
  }

  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  observer = new MutationObserver(([mutation]) => {
    const MYFlagNode = document.querySelector('.tv-flag-country.tv-flag-country--my[alt="my"]')

    if (!MYFlagNode) {
      deleteSyariahIcon()
      return
    }

    Array.from(mutation.target.children).forEach(tr => {
      const rowSymbol = tr.getAttribute('data-symbol')

      const isSyariah = SYARIAH_COMPLIANCE_LIST[rowSymbol]

      if (isSyariah) {
        const dom = tr.querySelector('.tv-screener-table__symbol-right-part')
        if (isSyariahIconExist(dom)) {
          // if icon already exist dont do anything
        } else {
          const domToBeAdded = tr.querySelector('.tv-screener-table__symbol-right-part a.tv-screener__symbol')
          domToBeAdded.insertAdjacentElement('afterend', createIcon({ width: 10, height: 10 }))
        }
      } else if (onlyFilterSyariahStocks) {
        // hide all non-syariah
        tr.style.display = 'none'
      }
    })
  })

  // Start observing the target node for configured mutations
  observer.observe(tableNode, { childList: true, subtree: true })
}

function setupFilterSyariahBtn() {
  // check if filter btn already exist or not
  if (document.querySelector(`[${ checkBoxAttribute }=${ checkBoxExtension }]`)) {
    return
  }

  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.type = 'text/css'

  style.appendChild(document.createTextNode(`
    [${ checkBoxAttribute }=${ checkBoxExtension }] svg {
     opacity: 0.4;
    }

    input:checked + [data-indicator-filter-checkbox="data-indicator-filter-checkbox"] svg {
      opacity: 1
    }
  `))

  head.appendChild(style)

  const refreshDomeNode = document.querySelector('.tv-screener-toolbar__button--refresh')

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.style.display = 'none'
  checkbox.setAttribute('id', `${ checkBoxAttribute }-${ checkBoxExtension }`)

  checkbox.addEventListener('change', function (e) {
    onlyFilterSyariahStocks = e.target.checked

    const trs = document.querySelectorAll('.tv-screener__content-pane table tbody.tv-data-table__tbody tr')

    Array.from(trs).forEach(tr => {
      const rowSymbol = tr.getAttribute('data-symbol')

      const isSyariah = SYARIAH_COMPLIANCE_LIST[rowSymbol]

      if (onlyFilterSyariahStocks) {
        if (isSyariah) {
          // if it is syariah compliance  don't do anything
        } else {
          tr.style.display = 'none'
        }
      } else {
        // make all visible
        tr.style.display = 'table-row'
      }
    })
  })

  const syariahFilterNode = document.createElement('label')
  syariahFilterNode.style.padding = '0'
  syariahFilterNode.style.display = 'flex'
  syariahFilterNode.style.alignItems = 'center'
  syariahFilterNode.style.justifyContent = 'center'
  syariahFilterNode.className = refreshDomeNode.className
  syariahFilterNode.setAttribute(checkBoxAttribute, checkBoxExtension)
  syariahFilterNode.setAttribute('for', `${ checkBoxAttribute }-${ checkBoxExtension }`)

  const icon = createIcon({ width: 17, height: 17 })
  icon.setAttribute(syariahIconAttribute, syariahIconValue)

  syariahFilterNode.prepend(icon)
  refreshDomeNode.parentElement.prepend(checkbox, syariahFilterNode)
}