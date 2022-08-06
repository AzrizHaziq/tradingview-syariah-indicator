import {
  createIcon,
  waitForElm,
  getStockStat,
  deleteShariahIcon,
  setStockListInMap,
  isShariahIconExist,
  observeNodeChanges,
} from '../helper'

// eslint-disable-next-line @typescript-eslint/no-empty-function
let obs = () => {}

const largeResoSelector = '.tv-symbol-header .tv-symbol-header__second-line .tv-symbol-header__exchange'
const smallResoSelector = '.tv-symbol-header.tv-symbol-header--mobile .tv-symbol-header__first-line'

waitForElm('.tv-main .tv-content')
  .then(setStockListInMap)
  .then(() => waitForElm('.tv-category-header__title'))
  .then(observeDom)
  .then(symbolScript)

function observeDom() {
  // have to target dom like below since this is the most top parent dom that didn't remove/delete
  obs = observeNodeChanges(document.querySelector('.tv-main .tv-content'), symbolScript)
}

function symbolScript() {
  const { s: isShariah } = getStockStat(getSymbol())
  const smallResoDom = document.querySelector(smallResoSelector)
  const largeResoDom = document.querySelector(largeResoSelector)

  if (isShariah) {
    if (isShariahIconExist(smallResoDom) || isShariahIconExist(largeResoDom.parentElement)) {
      // if icon already exist don't do anything
    } else {
      // have to disconnect current observer so that it doesn't create loop
      // because below we create icon and insert into div which trigger again observer.
      obs()

      const icon1 = createIcon()
      icon1.style.position = 'relative'
      icon1.style.bottom = '10px'
      icon1.style.marginLeft = '5px'
      smallResoDom.insertAdjacentElement('beforeend', icon1)

      const icon2 = createIcon({ width: 15, height: 15 })
      icon2.style.marginLeft = '5px'
      largeResoDom.insertAdjacentElement('afterend', icon2)

      observeDom()
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
