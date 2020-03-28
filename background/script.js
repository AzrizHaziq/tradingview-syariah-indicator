const extensionName = 'tradingview-syariah-indicator'

fetch('https://raw.githubusercontent.com/AzrizHaziq/tradingview-syariah-indicator/master/background/stock-list.json')
  .then(i => i.json())
  .then(async list => {
    await browser.storage.local.set({
      [`${ extensionName }`]: {
        SYARIAH_COMPLIANCE_LIST: list,
      },
    })

  })
  .catch(e => console.error('Something when wrong', e))

browser.tabs.onUpdated.addListener(listener);

async function listener(id) {
  try {
    const {
      [`${ extensionName }`]: {
        SYARIAH_COMPLIANCE_LIST,
      } = {
        SYARIAH_COMPLIANCE_LIST: {},  // default value
      },
    } = await browser.storage.local.get(extensionName)

    browser.tabs.sendMessage(id, { list: SYARIAH_COMPLIANCE_LIST })
  } catch (e) {
    console.error('Error Send message', e)
  }
}

