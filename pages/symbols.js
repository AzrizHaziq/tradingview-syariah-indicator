if (browser.runtime.onMessage.hasListener(receiveSignalFromBgScript)) {
  console.log('SYMBOLS: Registered listener')
  browser.runtime.onMessage.removeListener(receiveSignalFromBgScript)
}

browser.runtime.onMessage.addListener(receiveSignalFromBgScript)

function receiveSignalFromBgScript({ list: SYARIAH_COMPLIANCE_LIST }) {
  const found = SYARIAH_COMPLIANCE_LIST.find(i => i.id === `${ TRADING_VIEW_MYR }:${ getSymbols() }`)

  if (found.syariah) {
    const largeResoDom = document.querySelector('h1 div.tv-symbol-header__short-title')
    const smallResoDom = document.querySelector('.tv-symbol-header__text-group--mobile .tv-symbol-header__short-title')

    if (isSyariahIconExist(smallResoDom)) {
      // if icon already exist dont do anything
    } else {
      smallResoDom.insertAdjacentElement('beforeend', syariahIcon({
        top: '-15px',
        marginLeft: '3px',
        position: 'relative',
      }))
    }

    if (isSyariahIconExist(largeResoDom)) {
      // if icon already exist dont do anything
    } else {
      largeResoDom.insertAdjacentElement('beforeend', syariahIcon({
        top: '2px',
        marginLeft: '3px',
        position: 'relative',
      }))
    }

  } else {
    deleteSyariahIcon()
  }
}
