import {
  waitForElm,
  createIcon,
  getStockStat,
  deleteShariahIcon,
  setStockListInMap,
  isShariahIconExist,
  observeNodeChanges,
} from '../helper'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const obs = () => {}
const selectors = {
  mainChartStockSeriesEl: '[data-name="legend-series-item"]', // dom that contain every item (name, country, OHLC)
  mainChartStockNameEl: '[data-name="legend-series-item"] [data-name="legend-source-title"]', // dom that only contain stock name

  // the whole chart
  rootChartEl:
    'body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center > div.chart-container.single-visible.top-full-width-chart.active > div.chart-container-border',
}

waitForElm(selectors.mainChartStockSeriesEl)
  .then(setStockListInMap)
  .then(() => waitForElm(selectors.rootChartEl)) // need to wait, due to network and spinner
  .then((rootChartEl) => {
    obs()
    observeNodeChanges(rootChartEl, chartScript) // anytime rootChart changes
  })

async function chartScript(): Promise<void> {
  const parentElement = document.querySelector(selectors.mainChartStockNameEl)?.parentElement
  if (!parentElement) return

  // getting cssInJS hash like titleWrapper-1WIwNaDF -> 1WIwNaDF
  const cssInJsHash = parentElement.className
    .split(' ')
    .find((i) => i.startsWith('titleWrapper-'))
    .replace('titleWrapper-', '')

  const currentExchange = parentElement.querySelector(`.exchangeTitle-${cssInJsHash}`)?.textContent.trim() ?? ''

  const { s: isShariah } = getStockStat(`${currentExchange}:${getSymbolsFromTitle()}`)

  if (isShariah) {
    if (isShariahIconExist(parentElement)) {
      // if icon already exist don't do anything
    } else {
      const span = createIcon({ width: 15, height: 15 })
      span.style.display = 'flex'
      parentElement.prepend(span)
    }
  } else {
    // if not syariah delete all icon
    deleteShariahIcon(parentElement)
  }
}

/**
 *  also cover syntax like warrant and &
 *  D&O, CTOS-WC, S&FCAP-WC
 */
function getSymbolsFromTitle(): string {
  const domTittleName = document.getElementsByTagName('title')[0].innerText
  return /\w+([&-]?\w+)+/.exec(domTittleName)[0].trim()
}
