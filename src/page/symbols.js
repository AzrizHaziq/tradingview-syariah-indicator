/* global tsi */
tsi.addStaticSyariahIcon()
tsi.retryFn()(observeSymbolChanges)
browser.runtime.onMessage.addListener(symbolScript)

const symbolNode = document.querySelector('.tv-main .tv-content')
tsi.forceMutationChanges(symbolNode)

function observeSymbolChanges() {
  // have to target dom like below since this is the most top parent dom that didn't remove/delete
  const symbolNode = document.querySelector('.tv-main .tv-content')

  tsi.observeNodeChanges(symbolNode, symbolScript)
  tsi.forceMutationChanges(symbolNode)
}

function getSymbol() {
  return document.querySelector('.tv-category-header__price-line.js-header-symbol-quotes')
    .getAttribute('data-symbol').trim()
}

function symbolScript() {
  const { s: isShariah, msc } = tsi.lookForStockCode(getSymbol())

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

  if (msc) {
    const largeResoDom = document.querySelector('.tv-symbol-header__text-group.tv-symbol-header__text-group--adaptive-tablet')
    const smallResoDom = document.querySelector('.tv-symbol-header__text-group--mobile .tv-symbol-header__short-title.tv-symbol-header__short-title--with-icon')

    if (tsi.isMSCIconExist(largeResoDom.parentElement)) {
      // if icon already exist dont do anything
    } else {
      const mscLargeResoIcon = tsi.createMSCIcon(largeResoDom)
      mscLargeResoIcon.style.marginLeft = '5px'
      largeResoDom.insertAdjacentElement('beforeend', mscLargeResoIcon)
    }

    if (tsi.isMSCIconExist(smallResoDom)) {
      // if icon already exist dont do anything
    } else {
      const mscSmallResoIcon = tsi.createMSCIcon(smallResoDom)
      mscSmallResoIcon.style.top = '-14px'
      mscSmallResoIcon.style.marginLeft = '5px'
      mscSmallResoIcon.style.position = 'relative'
      smallResoDom.append(mscSmallResoIcon)
    }
  } else {
    tsi.deleteMSCIcon()
  }
}
