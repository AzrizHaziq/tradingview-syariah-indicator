/* global tsi */
window.addEventListener('load', function onLoad() {
  browser.runtime.sendMessage({ init: 'page-screener' }).then(() => {
    tsi.retryFn()(screenerScript)
    this.removeEventListener('load', onLoad)
  })
})

const ONLY_VALID_COUNTRIES = ['my']
const msc = {
  type: 'MSC',
  currentState: false,
  checkBoxId: 'msc-checkbox-id',
  checkBoxAttrName: tsi.attributeName,
  checkBoxAttrValue: 'msc-checkbox',
  createIcon: () => tsi.createMSCIcon(),
  onClick: wrapperElement => async(e) => {
    try {
      msc.currentState = e.target.checked

      await browser.storage.local.set({ 'IS_FILTER_MSC': e.target.checked })

      wrapperElement.setAttribute('title', msc.status[`${ msc.currentState }`])
    } catch (e) {
      console.error('Error set MSC in localStorage ', e)
    }
  },
  status: {
    true: browser.i18n.getMessage('js_screener_filter_btn_msc_on'),
    false: browser.i18n.getMessage('js_screener_filter_btn_msc_off'),
  }
}
const shariah = {
  type: 'SHARIAH',
  currentState: false,
  checkBoxId: 'shariah-checkbox-id',
  checkBoxAttrName: tsi.attributeName,
  checkBoxAttrValue: 'shariah-checkbox',
  createIcon: () => {
    const icon = tsi.createIcon({ width: 17, height: 17 })
    icon.style.cursor = 'pointer'
    icon.removeAttribute(tsi.attributeName)
    icon.setAttribute(`${ tsi.attributeName }-filter-icon`, `${ tsi.extensionName }-filter-icon`)

    return icon
  },
  onClick: wrapperElement => async(e) => {
    try {
      shariah.currentState = e.target.checked

      await browser.storage.local.set({ 'IS_FILTER_SHARIAH': e.target.checked })

      wrapperElement.setAttribute('title', shariah.status[`${ shariah.currentState }`])
    } catch (e) {
      console.error('Error set Shariah in localStorage', e)
    }
  },
  status: {
    true: browser.i18n.getMessage('js_screener_filter_btn_shariah_on'),
    false: browser.i18n.getMessage('js_screener_filter_btn_shariah_off'),
  }
}

// if both icon exist, then add margin-left
tsi.addStyle(`
  [${ tsi.attributeName }="${ tsi.extensionName }"] +
  [${ tsi.attributeName }="${ tsi.mscAttribute }"] {
    margin-left: 5px;
  }
`)

async function screenerScript() {
  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  // if table not found then dont run rest of the scripts
  if (!tableNode) {
    return
  }

  try {
    const { IS_FILTER_MSC } = (await browser.storage.local.get('IS_FILTER_MSC'))
    const { IS_FILTER_SHARIAH } = (await browser.storage.local.get('IS_FILTER_SHARIAH'))

    msc.currentState = IS_FILTER_MSC || false
    shariah.currentState = IS_FILTER_SHARIAH || false

    // waiting for table to fully rendered
    const tempTimeout = setTimeout(() => {
      tsi.addStaticSyariahIcon()
      observedTableChanges()
      setupFilterBtn(msc)
      setupFilterBtn(shariah)
      observedCountryFlagChanges()
      forceMutationChanges()

      clearTimeout(tempTimeout)
    }, 500)
  } catch (e) {
    console.error('Error read storage', e)
  }
}

function forceMutationChanges() {
  // have to put this to trigger the first mutationObserver
  const tempInterval = setInterval(() => {
    const fakeDiv = document.createElement('div')
    document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody').append(fakeDiv)
    fakeDiv.remove()

    // assume that if more than X number of syariah icon, then stop mutating dom, in this case is 10
    if (document.querySelectorAll(`[${ tsi.attributeName }="${ tsi.extensionName }"]`).length > 10) {
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
      tsi.deleteSyariahIcon()
      return
    }

    Array.from(mutation.target.children).forEach(tr => {
      const rowSymbol = tr.getAttribute('data-symbol')

      const { s: isSyariah, msc: isMsc } = tsi.lookForStockCode(rowSymbol)

      if (isMsc) {
        const firstColumn = tr.querySelector('td div')
        if (tsi.isMSCIconExist(firstColumn)) {
          // if icon already exist don't do anything
        } else {
          // this query need to be the same in /screener  & /chart's stock screener
          const domToBeAdded = firstColumn.querySelector('.tv-screener__symbol')
          domToBeAdded.insertAdjacentElement('afterend', tsi.createMSCIcon())
        }
      } else if (msc.currentState) {
        tr.style.display = 'none'
      }

      if (isSyariah) {
        const firstColumn = tr.querySelector('td div')
        if (tsi.isSyariahIconExist(firstColumn)) {
          // if icon already exist don't do anything
        } else {
          // this query need to be the same in /screener  & /chart's stock screener
          const domToBeAdded = firstColumn.querySelector('.tv-screener__symbol')
          const shariahIcon = tsi.createIcon({ width: 10, height: 10 })
          domToBeAdded.insertAdjacentElement('afterend', shariahIcon)
        }
      } else if (shariah.currentState) {
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
    const mscFilterBtn = document.querySelector(`label[${ msc.checkBoxAttrName }=${ msc.checkBoxAttrValue }]`).parentElement
    const shariahFilterBtn = document.querySelector(`label[${ shariah.checkBoxAttrName }=${ shariah.checkBoxAttrValue }]`).parentElement
    const isCountriesExisted = ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)

    if (isCountriesExisted) {
      mscFilterBtn.style.display = 'block'
      shariahFilterBtn.style.display = 'block'
    } else {
      mscFilterBtn.style.display = 'none'
      shariahFilterBtn.style.display = 'none'
    }
  })

  // Start observing the target node for configured mutations
  observer.observe(countryMarketDropdown, { childList: true, subtree: true })
}

function getCurrentSelectedFlag(countryKey) {
  return document.querySelector(`.tv-screener-market-select__button > img.tv-flag-country.tv-flag-country--${ countryKey }`)
}

function setupFilterBtn(state) {
  // check if filter btn already exist or not
  if (document.querySelector(`label[${ state.checkBoxAttrName }=${ state.checkBoxAttrValue }]`)) {
    return
  }

  tsi.addStyle(`
    [${ state.checkBoxAttrName }=${ state.checkBoxAttrValue }] {
     opacity: 0.4;
     transition: opacity .5s ease;
    }

    input:checked + [${ state.checkBoxAttrName }=${ state.checkBoxAttrValue }] {
      opacity: 1
    }
  `)

  // create a checkbox filter btn
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.style.display = 'none'
  checkbox.checked = state.currentState
  checkbox.setAttribute('id', state.checkBoxId)

  // create a filter btn
  const labelElement = document.createElement('label')
  labelElement.style.padding = '0'
  labelElement.style.height = '100%'
  labelElement.style.display = 'flex'
  labelElement.style.alignItems = 'center'
  labelElement.style.justifyContent = 'center'
  labelElement.setAttribute('for', state.checkBoxId)
  labelElement.setAttribute(state.checkBoxAttrName, state.checkBoxAttrValue)

  // shariah icon
  const iconElement = state.createIcon()
  iconElement.style.cursor = 'pointer'

  // div wrapper, just copy paste from refresh btn
  const wrapper = document.createElement('div')
  wrapper.setAttribute('title', state.status[`${ state.currentState }`])
  wrapper.className = document.querySelector('.tv-screener-toolbar__button--refresh').className // copy refresh btn class
  wrapper.style.paddingTop = '0'
  wrapper.style.width = state.type === 'MSC' ? '36px' : '33px'

  labelElement.prepend(iconElement)
  wrapper.prepend(checkbox, labelElement)

  console.log(document.querySelector('.tv-screener-toolbar'), wrapper)
  document.querySelector('.tv-screener-toolbar').prepend(wrapper)

  wrapper.addEventListener('change', async function (e) {
    try {
      await state.onClick(wrapper)(e)

      const trs = document.querySelectorAll('.tv-screener__content-pane table tbody.tv-data-table__tbody tr')

      Array.from(trs).forEach(tr => {
        const rowSymbol = tr.getAttribute('data-symbol')
        const { s: isSyariah, msc: isMsc } = tsi.lookForStockCode(rowSymbol)

        // BOTH
        if (shariah.currentState && msc.currentState) {
          if (isSyariah && isMsc) {
            tr.style.display = 'table-row'
          } else {
            tr.style.display = 'none'
          }

          // SHARIAH
        } else if (shariah.currentState && !msc.currentState) {
          if (isSyariah) {
            tr.style.display = 'table-row'
          } else {
            tr.style.display = 'none'
          }

          // MSC
        } else if (msc.currentState && !shariah.currentState) {
          if (isMsc) {
            tr.style.display = 'table-row'
          } else {
            tr.style.display = 'none'
          }

          // BOTH is currently OFF
        } else {
          tr.style.display = 'table-row'
        }
      })
    } catch (error) {
      console.log('Error post click action', e)
    }
  })

  if (!ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)) {
    wrapper.style.display = 'none'
  }
}
