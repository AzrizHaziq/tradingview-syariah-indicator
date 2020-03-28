const extensionName = 'tradingview-syariah-indicator'

fetch('https://raw.githubusercontent.com/AzrizHaziq/tradingview-syariah-indicator/master/background/stock-list.json')
  .then(i => i.json())
  .then(async ({ list, ...others}) => {
    await browser.storage.local.set({
      [`${ extensionName }`]: {
        OTHER_INFORMATION: others,
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
        OTHER_INFORMATION,
        SYARIAH_COMPLIANCE_LIST,
      }
    } = await browser.storage.local.get(extensionName)

    browser.tabs.sendMessage(id, {
      OTHER_INFORMATION,
      SYARIAH_COMPLIANCE_LIST
    })
  } catch (e) {
    console.error('Error Send message', e)
  }
}

