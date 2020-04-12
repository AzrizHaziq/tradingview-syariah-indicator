/* global tsi */
tsi.addStaticSyariahIcon()

const receiveSignal = () => tsi.retryFn()(symbolScript)

browser.runtime.onMessage.addListener(receiveSignal)

window.addEventListener('load', onLoad)

function onLoad() {
  browser.runtime.sendMessage({ init: 'page-symbol' }).then(() => {
    receiveSignal()
    window.removeEventListener('load', onLoad)
  })
}

function getSymbol() {
  return document.querySelector('.tv-category-header__price-line.js-header-symbol-quotes')
    .getAttribute('data-symbol').trim()
}

function symbolScript() {
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
