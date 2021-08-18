'use strict';

exports[Symbol.toStringTag] = 'Module';

var fetch = require('node-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

const doNotPrerender = true;
async function onBeforeRender(pageContext) {
  const res = await fetch__default["default"]("https://raw.githubusercontent.com/AzrizHaziq/tradingview-syariah-indicator/lerna-init/packages/data/stock-list-human.json");
  const { data, metadata } = await res.json();
  const queryParams = pageContext.url.replace(/\/list(\?)?/g, "").split("&").reduce((acc, i) => {
    const [key, value] = i.split("=");
    return acc.hasOwnProperty(key) ? Array.isArray(acc[key]) ? { ...acc, [key]: [...acc[key], value] } : { ...acc, [key]: [acc[key], value] } : { ...acc, [key]: value };
  }, {});
  return {
    pageContext: {
      pageProps: {
        data,
        metadata,
        queryParams,
        exchangesList: Array.isArray(queryParams.exchange) ? queryParams.exchange : typeof queryParams.exchange === "string" ? [queryParams.exchange] : Object.keys(metadata)
      }
    }
  };
}

exports.doNotPrerender = doNotPrerender;
exports.onBeforeRender = onBeforeRender;
