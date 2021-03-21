import {
  createIcon,
  waitForElm,
  getStockStat,
  deleteSyariahIcon,
  setStockListInMap,
  isSyariahIconExist,
  observeNodeChanges,
} from '../helper'

waitForElm('.tv-main .tv-content').then(setStockListInMap).then(mainScript)

browser.runtime.sendMessage({
  type: 'ga',
  subType: 'pageview',
  payload: 'symbols',
})

function mainScript() {
  // have to target dom like below since this is the most top parent dom that didn't remove/delete
  const symbolNode = document.querySelector('.tv-main .tv-content')
  observeNodeChanges(symbolNode, symbolScript)
}

function symbolScript() {
  const { s: isShariah } = getStockStat(getSymbol())

  const largeResoDom = document.querySelector(
    '.tv-symbol-header .tv-symbol-header__second-line .tv-symbol-header__exchange'
  )

  const smallResoDom = document.querySelector(
    '.tv-symbol-header.tv-symbol-header--mobile .tv-symbol-header__first-line'
  )

  if (isShariah) {
    if (isSyariahIconExist(smallResoDom)) {
      // if icon already exist dont do anything
    } else {
      const icon = createIcon()
      icon.style.marginLeft = '5px'
      icon.style.display = 'inline'
      icon.style.position = 'relative'
      icon.style.bottom = '10px'

      smallResoDom.insertAdjacentElement('beforeend', icon)
    }

    if (isSyariahIconExist(largeResoDom.parentElement)) {
      // if icon already exist dont do anything
    } else {
      const icon = createIcon({ width: 15, height: 15 })
      icon.style.marginLeft = '5px'
      largeResoDom.insertAdjacentElement('afterend', icon)
    }
  } else {
    deleteSyariahIcon()
  }
}

function getSymbol() {
  return document
    .querySelector('.tv-category-header__price-line.js-header-symbol-quotes')
    .getAttribute('data-symbol')
    .trim()
}
