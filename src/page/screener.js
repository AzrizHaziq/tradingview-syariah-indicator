/* global tsi */
const ONLY_VALID_COUNTRIES = ['my']
const msc = {
  type: 'MSC',
  currentState: false,
  checkBoxId: 'msc-checkbox-id',
  checkBoxAttrName: tsi.attributeName,
  checkBoxAttrValue: 'msc-checkbox',
  createIcon: () => tsi.createMSCIcon(),
  onClick: wrapperElement => async e => {
    try {
      msc.currentState = e.target.checked

      await browser.storage.local.set({ IS_FILTER_MSC: e.target.checked })

      wrapperElement.setAttribute('title', msc.status[`${msc.currentState}`])
    } catch (e) {
      console.error('Error set MSC in localStorage ', e)
    }
  },
  status: {
    true: browser.i18n.getMessage('js_screener_filter_btn_msc_on'),
    false: browser.i18n.getMessage('js_screener_filter_btn_msc_off'),
  },
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
    icon.setAttribute(`${tsi.attributeName}-filter-icon`, `${tsi.extensionName}-filter-icon`)

    return icon
  },
  onClick: wrapperElement => async e => {
    try {
      shariah.currentState = e.target.checked

      await browser.storage.local.set({ IS_FILTER_SHARIAH: e.target.checked })

      wrapperElement.setAttribute('title', shariah.status[`${shariah.currentState}`])
    } catch (e) {
      console.error('Error set Shariah in localStorage', e)
    }
  },
  status: {
    true: browser.i18n.getMessage('js_screener_filter_btn_shariah_on'),
    false: browser.i18n.getMessage('js_screener_filter_btn_shariah_off'),
  },
}

browser.runtime.sendMessage({
  type: 'ga',
  subType: 'pageview',
  payload: getCurrentPathname(),
})

// if both icon exist, then add margin-left
tsi.addStyle(`
  [${tsi.attributeName}="${tsi.extensionName}"] +
  [${tsi.attributeName}="${tsi.mscAttribute}"] {
    margin-left: 5px;
  }
`)

tsi
  .waitForElm('.tv-screener__content-pane table tbody.tv-data-table__tbody')
  .then(tsi.setStockListInMap)
  .then(mainScreenerScript)

async function mainScreenerScript() {
  try {
    const { IS_FILTER_MSC } = await browser.storage.local.get('IS_FILTER_MSC')
    const { IS_FILTER_SHARIAH } = await browser.storage.local.get('IS_FILTER_SHARIAH')

    msc.currentState = IS_FILTER_MSC || false
    shariah.currentState = IS_FILTER_SHARIAH || false

    tsi.addStaticSyariahIcon()
    setupFilterBtn(msc)
    setupFilterBtn(shariah)
    observedTableChanges()
    observedCountryFlagChanges()
  } catch (e) {
    console.error('Error running mainScreenerScript', e)
  }
}

function observedTableChanges() {
  let observer

  if (observer) {
    console.log('Already observe table changes')
    observer.disconnect()
  }

  const tableNode = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')

  observer = new MutationObserver(() => {
    if (!ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)) {
      tsi.deleteSyariahIcon(tableNode.parentElement)
      return
    }

    Array.from(tableNode.children).forEach(tr => {
      const rowSymbol = tr.getAttribute('data-symbol')
      const { s: isSyariah, msc: isMsc } = tsi.getStockStat(rowSymbol)

      const firstColumn = tr.querySelector('td div')
      const mscIcon = tsi.createMSCIcon()
      const shariahIcon = tsi.createIcon({ width: 10, height: 10 })

      if (isMsc) {
        if (tsi.isMSCIconExist(firstColumn)) {
          // if icon already exist don't do anything
        } else {
          // this query need to be the same in /screener  & /chart's stock screener
          const domToBeAdded = firstColumn.querySelector('.tv-screener__symbol')
          domToBeAdded.insertAdjacentElement('afterend', mscIcon)
        }
      }

      if (isSyariah) {
        if (tsi.isSyariahIconExist(firstColumn)) {
          // if icon already exist don't do anything
        } else {
          // this query need to be the same in /screener  & /chart's stock screener
          const domToBeAdded = firstColumn.querySelector('.tv-screener__symbol')
          domToBeAdded.insertAdjacentElement('afterend', shariahIcon)
        }
      }

      shouldDisplayRow(tr, { isSyariah, isMsc })
    })
  })

  // Start observing the target node for configured mutations
  observer.observe(tableNode, { childList: true, subtree: true })
}

function observedCountryFlagChanges() {
  let observer

  if (observer) {
    console.log('Already observe flag changes')
    observer.disconnect()
  }

  const countryMarketDropdown = document.querySelector('.tv-screener-market-select')

  observer = new MutationObserver(() => {
    const isCountriesExisted = ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)
    const mscFilterBtn = document.querySelector(`label[${msc.checkBoxAttrName}=${msc.checkBoxAttrValue}]`).parentElement
    const shariahFilterBtn = document.querySelector(`label[${shariah.checkBoxAttrName}=${shariah.checkBoxAttrValue}]`)
      .parentElement

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
  return document.querySelector(
    `.tv-screener-market-select__button > img.tv-flag-country.tv-flag-country--${countryKey}`
  )
}

function setupFilterBtn(state) {
  // check if filter btn already exist or not
  if (document.querySelector(`label[${state.checkBoxAttrName}=${state.checkBoxAttrValue}]`)) {
    return
  }

  tsi.addStyle(`
    [${state.checkBoxAttrName}=${state.checkBoxAttrValue}] {
     opacity: 0.4;
     transition: opacity .5s ease;
    }

    input:checked + [${state.checkBoxAttrName}=${state.checkBoxAttrValue}] {
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
  wrapper.setAttribute('title', state.status[`${state.currentState}`])
  wrapper.className = document.querySelector('.tv-screener-toolbar__button--refresh').className // copy refresh btn class
  wrapper.style.paddingTop = '0'
  wrapper.style.width = state.type === 'MSC' ? '36px' : '33px'

  labelElement.prepend(iconElement)
  wrapper.prepend(checkbox, labelElement)

  document.querySelector('.tv-screener-toolbar').prepend(wrapper)

  wrapper.addEventListener('change', async function (e) {
    try {
      await state.onClick(wrapper)(e)

      browser.runtime.sendMessage({
        type: 'ga',
        subType: 'event',
        payload: {
          eventCategory: getCurrentPathname(),
          eventAction: state.type,
          eventLabel: `${state.currentState}`,
        },
      })

      const trs = document.querySelectorAll('.tv-screener__content-pane table tbody.tv-data-table__tbody tr')

      Array.from(trs).forEach(tr => {
        const rowSymbol = tr.getAttribute('data-symbol')
        const { s: isSyariah, msc: isMsc } = tsi.getStockStat(rowSymbol)
        shouldDisplayRow(tr, { isSyariah, isMsc })
      })
    } catch (error) {
      console.log('Error post click action', e)
    }
  })

  if (!ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)) {
    wrapper.style.display = 'none'
  }
}

function shouldDisplayRow(rowElement, { isSyariah, isMsc }) {
  // BOTH
  if (shariah.currentState && msc.currentState) {
    if (isSyariah && isMsc) {
      rowElement.style.display = 'table-row'
    } else {
      rowElement.style.display = 'none'
    }

    // SHARIAH
  } else if (shariah.currentState && !msc.currentState) {
    if (isSyariah) {
      rowElement.style.display = 'table-row'
    } else {
      rowElement.style.display = 'none'
    }

    // MSC
  } else if (msc.currentState && !shariah.currentState) {
    if (isMsc) {
      rowElement.style.display = 'table-row'
    } else {
      rowElement.style.display = 'none'
    }

    // BOTH is currently OFF
  } else {
    rowElement.style.display = 'table-row'
  }
}

function getCurrentPathname() {
  return window.location.pathname.replace(/\//g, '') === 'screener' ? 'screener' : 'chart-screener'
}
