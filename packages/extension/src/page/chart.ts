import {
  waitForElm,
  createIcon,
  getStockStat,
  deleteShariahIcon,
  setStockListInMap,
  isShariahIconExist,
  observeNodeChanges,
} from "../helper";

waitForElm('[data-name="legend-series-item"]')
  .then(setStockListInMap)
  .then(mainScript);

function mainScript() {
  // have to target dom like below since this is the most top parent
  const symbolNode = document.querySelector('[data-name="legend-series-item"]');
  observeNodeChanges(symbolNode, chartScript);
}

async function chartScript(): Promise<void> {
  const { parentElement } = document.querySelector(
    '[data-name="legend-source-title"]'
  );

  // getting cssInJS hash like titleWrapper-1WIwNaDF (1WIwNaDF)
  const cssInJsHash = parentElement.className
    .split(" ")
    .find((i) => i.startsWith("titleWrapper-"))
    .replace("titleWrapper-", "");

  const currentExchange =
    parentElement
      .querySelector(`.exchangeTitle-${cssInJsHash}`)
      ?.textContent.trim() ?? "";

  const { s: isShariah } = getStockStat(
    `${currentExchange}:${getSymbolsFromTitle()}`
  );

  if (isShariah) {
    if (isShariahIconExist(parentElement)) {
      // if icon already exist don't do anything
    } else {
      const span = createIcon({ width: 15, height: 15 });
      span.style.display = "flex";
      parentElement.prepend(span);
    }
  } else {
    // if not syariah delete all icon
    deleteShariahIcon(parentElement);
  }
}

/**
 *  also cover syntax like warrant and &
 *  D&O, CTOS-WC, S&FCAP-WC
 */
function getSymbolsFromTitle(): string {
  const domTittleName = document.getElementsByTagName("title")[0].innerText;
  return /\w+([&-]?\w+)+/.exec(domTittleName)[0].trim();
}
