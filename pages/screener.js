/* global addStaticSyariahIcon isSyariahIconExist deleteSyariahIcon createIcon */
/* global extensionName attributeName */

const ONLY_VALID_COUNTRIES = ['my']
const checkBoxAttribute = `${ attributeName }-filter-checkbox`
const checkBoxExtension = `${ attributeName }-filter-checkbox`
const syariahIconAttribute = `${ attributeName }-filter-icon`
const syariahIconValue = `${ extensionName }-filter-icon`
const uniqueKey = `${ checkBoxAttribute }-${ checkBoxExtension }`

let SYARIAH_COMPLIANCE_LIST = {}
let onlyFilterSyariahStocks = false

if (browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('SCREENER: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

async function receiveSignalFromBgScript({ list }) {
  try {
    const {
      [`${ extensionName }`]: {
        onlyFilterSyariahStocks: bool,
      } = {
        onlyFilterSyariahStocks: false,  // default value
      },
    } = await browser.storage.local.get(extensionName)

    onlyFilterSyariahStocks = bool
    SYARIAH_COMPLIANCE_LIST = list

    // waiting for table to fully rendered
    const tempTimeout = setTimeout(() => {
      addStaticSyariahIcon()
      observedTableChanges()
      setupFilterSyariahBtn()
      observedCountryFlagChanges()
      forceMutationChanges()

      clearTimeout(tempTimeout)
    }, 500)
  } catch (e) {
    console.error('Error read storage', e)
  }
}

function setupFilterSyariahBtn() {
  // check if filter btn already exist or not
  if (document.querySelector(`label[${ checkBoxAttribute }=${ checkBoxExtension }]`)) {
    return
  }

  addStyle(`
    [${ checkBoxAttribute }=${ checkBoxExtension }] svg {
     opacity: 0.4;
    }

    input:checked + [data-indicator-filter-checkbox="data-indicator-filter-checkbox"] svg {
      opacity: 1
    }
  `)

  const refreshDomeNode = document.querySelector('.tv-screener-toolbar__button--refresh')

  // create a checkbox filter btn
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.style.display = 'none'
  checkbox.checked = onlyFilterSyariahStocks
  checkbox.setAttribute('id', uniqueKey)

  // create a filter btn
  const syariahFilterNode = document.createElement('label')
  syariahFilterNode.style.padding = '0'
  syariahFilterNode.style.display = 'flex'
  syariahFilterNode.style.alignItems = 'center'
  syariahFilterNode.style.justifyContent = 'center'
  syariahFilterNode.className = refreshDomeNode.className
  syariahFilterNode.setAttribute('for', uniqueKey)
  syariahFilterNode.setAttribute(checkBoxAttribute, checkBoxExtension)
  syariahFilterNode.title = onlyFilterSyariahStocks ? 'Syariah: ON' : 'Syariah: OFF'

  checkbox.addEventListener('change', async function (e) {
    try {
      onlyFilterSyariahStocks = e.target.checked
      await browser.storage.local.set({
        [`${ extensionName }`]: {
          onlyFilterSyariahStocks: e.target.checked,
        },
      })

      syariahFilterNode.title = onlyFilterSyariahStocks ? 'Syariah: ON' : 'Syariah: OFF'

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
    } catch (e) {
      console.error('Error set localStorage', e)
    }
  })

  const icon = createIcon({ width: 17, height: 17 })
  icon.removeAttribute(attributeName)
  icon.setAttribute(syariahIconAttribute, syariahIconValue)

  syariahFilterNode.prepend(icon)
  refreshDomeNode.parentElement.prepend(checkbox, syariahFilterNode)

  if (!ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)) {
    syariahFilterNode.style.display = 'none'
  }
}

function forceMutationChanges() {
  // have to put this to trigger the first mutationObserver
  const tempInterval = setInterval(() => {
    const fakeDiv = document.createElement('div')
    document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody').append(fakeDiv)
    fakeDiv.remove()

    // assume that if  more than X number of syariah icon, then stop mutating dom
    if (document.querySelectorAll(`[${ attributeName }="${ extensionName }"]`).length > 10) {
      clearInterval(tempInterval)
    }
  }, 200)
}

function observedTableChanges() {
  let observer

  if (observer) {
    console.log('Already observe table changes')
    observer.disconnect()
  }

  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  observer = new MutationObserver(([mutation]) => {
    if (!ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)) {
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
        tr.style.display = 'none'
      }
    })
  })

  // Start observing the target node for configured mutations
  observer.observe(tableNode, { childList: true })
}

function observedCountryFlagChanges() {
  let observer

  if (observer) {
    console.log('Already observe flag changes')
    observer.disconnect()
  }

  const countryMarketDropdown = document.querySelector('.tv-screener-market-select')

  observer = new MutationObserver(() => {
    const filterBtnNode = document.querySelector(`label[${ checkBoxAttribute }=${ checkBoxExtension }]`)
    const isCountriesExisted = ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)

    if (isCountriesExisted) {
      filterBtnNode.style.display = 'flex'
    } else {
      filterBtnNode.style.display = 'none'
    }
  })

  // Start observing the target node for configured mutations
  observer.observe(countryMarketDropdown, { childList: true, subtree: true })
}

function getCurrentSelectedFlag(countryKey) {
  return document.querySelector(`.tv-screener-market-select__button > img.tv-flag-country.tv-flag-country--${ countryKey }`)
}
