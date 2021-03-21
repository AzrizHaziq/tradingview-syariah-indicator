/* global tsi */
import {
  createIcon,
  waitForElm,
  getStockStat,
  deleteSyariahIcon,
  setStockListInMap,
  isSyariahIconExist,
  addStyle,
  attributeName,
  extensionName,
} from '../helper'

browser.runtime.sendMessage({
  type: 'ga',
  subType: 'pageview',
  payload: getCurrentPathname(),
})

const ONLY_VALID_COUNTRIES = ['my']

const css = {
  main: {
    row: 'js-tsi__main--row',
    body: 'js-tsi__main--body',
  },
  shariah: {
    row: 'js-tsi__shariah--row',
    body: 'js-tsi__shariah--tbody',
  },
}

const shariah = {
  type: 'SHARIAH',
  currentState: false,
  css: {
    row: css.shariah.row,
    body: css.shariah.body,
  },
  checkBoxId: 'shariah-checkbox-id',
  checkBoxAttrName: attributeName,
  checkBoxAttrValue: 'shariah-checkbox',
  createIcon: () => {
    const icon = createIcon({ width: 17, height: 17 })
    icon.style.cursor = 'pointer'
    icon.removeAttribute(attributeName)
    icon.setAttribute(`${attributeName}-filter-icon`, `${extensionName}-filter-icon`)

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

// if both icon exist, then add margin-left
addStyle(`
  //  by default  make all visible
  .${css.main.body} .${css.main.row} {
     display: table-row;
  }
  
  // SHARIAH ON
  .${css.main.body}.${css.shariah.body} .${css.shariah.row} {
     display: table-row;
  }
  
  .${css.main.body}.${css.shariah.body} .${css.main.row}:not(.${css.shariah.row}) {
     display: none;
  }
`)

waitForElm('.tv-screener__content-pane table tbody.tv-data-table__tbody')
  .then(setStockListInMap)
  .then(mainScreenerScript)

async function mainScreenerScript() {
  try {
    const { IS_FILTER_SHARIAH } = await browser.storage.local.get('IS_FILTER_SHARIAH')

    shariah.currentState = IS_FILTER_SHARIAH || false

    setupFilterBtn(shariah)
    setupCssClassName()
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
      deleteSyariahIcon(tableNode.parentElement)
      return
    }

    Array.from(tableNode.children).forEach(tr => {
      const rowSymbol = tr.getAttribute('data-symbol')
      const { s: isSyariah } = getStockStat(rowSymbol)

      const firstColumn = tr.querySelector('td div')
      const shariahIcon = createIcon({ width: 10, height: 10 })

      tr.classList.add(css.main.row)

      if (isSyariah) {
        tr.classList.add(css.shariah.row)

        if (isSyariahIconExist(firstColumn)) {
          // if icon already exist don't do anything
        } else {
          // this query need to be the same in /screener  & /chart's stock screener
          const domToBeAdded = firstColumn.querySelector('.tv-screener__symbol')
          domToBeAdded.insertAdjacentElement('afterend', shariahIcon)
        }
      }
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
    const shariahFilterBtn = document.querySelector(`label[${shariah.checkBoxAttrName}=${shariah.checkBoxAttrValue}]`)
      .parentElement

    if (isCountriesExisted) {
      shariahFilterBtn.style.display = 'block'
    } else {
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

  addStyle(`
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

  // icon
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

      const tbody = document.querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')
      state.currentState ? tbody.classList.add(state.css.body) : tbody.classList.remove(state.css.body)
    } catch (error) {
      console.log('Error post click action', e)
    }
  })

  if (!ONLY_VALID_COUNTRIES.some(getCurrentSelectedFlag)) {
    wrapper.style.display = 'none'
  }
}

function getCurrentPathname() {
  return window.location.pathname.replace(/\//g, '') === 'screener' ? 'screener' : 'chart-screener'
}

function setupCssClassName() {
  document
    .querySelector('.tv-screener__content-pane table tbody.tv-data-table__tbody')
    .classList.add(...[css.main.body, shariah.currentState ? css.shariah.body : ''].filter(Boolean))
}
