/* global tsi */
if (browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('SYMBOLS: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

tsi.addStaticSyariahIcon()

function getSymbol() {
  return document.querySelector('.tv-category-header__price-line.js-header-symbol-quotes')
    .getAttribute('data-symbol').trim()
}

function receiveSignalFromBgScript() {
  const { s: isShariah } = tsi.lookForShariah(getSymbol())

  if (isShariah) {
    const largeResoDom = document.querySelector('.tv-symbol-header__short-title.tv-symbol-header__short-title--with-icon')
    const smallResoDom = document.querySelector('.tv-symbol-header__text-group--mobile .tv-symbol-header__short-title.tv-symbol-header__short-title--with-icon')

    if (tsi.isSyariahIconExist(smallResoDom)) {
      // if icon already exist dont do anything
    } else {
      const icon = tsi.createIcon()
      icon.style.marginLeft = '5px'
      icon.style.display = 'inline'
      icon.style.position = 'relative'
      icon.style.bottom = '10px'

      smallResoDom.insertAdjacentElement('beforeend', icon)
    }

    if (tsi.isSyariahIconExist(largeResoDom.parentElement)) {
      // if icon already exist dont do anything
    } else {
      const icon = tsi.createIcon({ width: 15, height: 15 })
      icon.style.marginLeft = '5px'
      largeResoDom.insertAdjacentElement('afterend', icon)
    }

  } else {
    tsi.deleteSyariahIcon()
  }
}
