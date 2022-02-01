import {
  createIcon,
  waitForElm,
  getStockStat,
  deleteShariahIcon,
  setStockListInMap,
  isShariahIconExist,
  observeNodeChanges,
} from '../helper'

const largeResoSelector = '.tv-symbol-header .tv-symbol-header__second-line .tv-symbol-header__exchange'
const smallResoSelector = '.tv-symbol-header.tv-symbol-header--mobile .tv-symbol-header__first-line'

waitForElm('.tv-main .tv-content')
  .then(setStockListInMap)
  .then(() => waitForElm('.tv-category-header__title'))
  .then(mainScript)

function mainScript() {
  symbolScript()

  // have to target dom like below since this is the most top parent dom that didn't remove/delete
  const symbolNode = document.querySelector('.tv-category-header__title')
  observeNodeChanges(symbolNode, symbolScript)
}

function symbolScript() {
  const { s: isShariah } = getStockStat(getSymbol())
  const smallResoDom = document.querySelector(smallResoSelector)
  const largeResoDom = document.querySelector(largeResoSelector)

  if (isShariah) {
    if (isShariahIconExist(smallResoDom)) {
      // if icon already exist don't do anything
    } else {
      const icon = createIcon()
      icon.style.position = 'relative'
      icon.style.bottom = '10px'
      smallResoDom.insertAdjacentElement('beforeend', icon)
    }

    if (isShariahIconExist(largeResoDom.parentElement)) {
      // if icon already exist don't do anything
    } else {
      const icon = createIcon({ width: 15, height: 15 })
      largeResoDom.insertAdjacentElement('afterend', icon)
    }
  } else {
    deleteShariahIcon()
  }
}

function getSymbol() {
  return document
    .querySelector('.tv-category-header__price-line.js-header-symbol-quotes')
    .getAttribute('data-symbol')
    .trim() as `${string}:${string}`
}
