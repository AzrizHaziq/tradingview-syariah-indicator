const TRADING_VIEW_MYR = 'MYX';
let SYARIAH_COMPLIANCE_LIST;

console.log('Send msg to bg script');
// get the list of syariah compliance list
browser.runtime.sendMessage(null)

browser.runtime.onMessage.addListener(receiveDataFromBackground);

/**
 * TODO: remove this handler when user close tabs or not in active window
 * @param data
 */
function receiveDataFromBackground({ list }) {
  SYARIAH_COMPLIANCE_LIST = list;
}

const malaysianStockList = Array.from(document.querySelectorAll(`[data-symbol^=${ TRADING_VIEW_MYR }]`));

malaysianStockList.forEach(stock => {
    const stockName = stock.getAttribute('data-symbol')
                           .replace(new RegExp(`^${ TRADING_VIEW_MYR }:`), '');
});

