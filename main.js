const TRADING_VIEW_MYR = 'MYX';
let SYARIAH_COMPLIANCE_LIST;

browser.runtime.onMessage.addListener(receiveDataFromBackground);

/**
 * TODO: remove this handler when user close tabs or not in active window
 * @param data
 */
function receiveDataFromBackground(data) {
  const { json } = data;
  SYARIAH_COMPLIANCE_LIST = json;
}

const malaysianStockList = Array.from(document.querySelectorAll(`[data-symbol^=${ TRADING_VIEW_MYR }]`));

malaysianStockList.forEach(stock => {
    const stockName = stock.getAttribute('data-symbol')
                           .replace(new RegExp(`^${ TRADING_VIEW_MYR }:`), '');


});

