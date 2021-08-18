'use strict';

exports[Symbol.toStringTag] = 'Module';

var web = require('solid-js/web');
var store = require('solid-js/store');
var solidJs = require('solid-js');
require('./analytics.876cfeac.js');
require('analytics');
require('@analytics/google-analytics');

const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x);
const TArrayConcat = (a, c) => [...a, c];
const TFilter = (predicate) => (step) => (a, c) => predicate(c) ? step(a, c) : a;

var list = '';

const _tmpl$ = ["<button", " class=\"ml-auto text-green-500\">Clear All</button>"],
      _tmpl$2 = ["<div", " class=\"max-w-full mx-auto md:max-w-3xl\"><svg class=\"hidden\"><symbol id=\"link-icon\" stroke=\"currentColor\" stroke-width=\"0\" class=\"fill-current text-gray-300 hover:text-green-200\" viewBox=\"0 0 1024 1024\"><path d=\"M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z\"></path></symbol></svg><input type=\"text\" placeholder=\"Tesla, TOPGLOV, MYX, SZSE, NYSE, MYX, intel\" value=\"", "\" class=\"w-full rounded h-10 px-2 mb-5 \"><div class=\"flex gap-2 mb-4\"><!--#-->", "<!--/--><!--#-->", "<!--/--></div><!--#-->", "<!--/--></div>"],
      _tmpl$3 = ["<label", " class=\"exchange\"><input type=\"checkbox\" class=\"hidden\"", "><span>", "</span></label>"],
      _tmpl$4 = ["<div", " class=\"ml-auto\"></div>"],
      _tmpl$5 = ["<li", " class=\"flex group items-center gap-x-1\" role=\"listitem\"><p class=\"text-white opacity-80 group-hover:opacity-100\"><span class=\"inline sm:hidden mr-2 font-bold\">", " </span><!--#-->", "<!--/--></p><a target=\"_blank\" href=\"", "\"><svg height=\"1em\" width=\"1em\"><use href=\"#link-icon\"></use></svg></a><!--#-->", "<!--/--></li>"],
      _tmpl$6 = ["<span", " class=\"", "\"><!--#-->", "<!--/-->-<!--#-->", "<!--/--></span>"],
      _tmpl$7 = ["<ul", " class=\"flex gap-1 flex-col\">", "</ul>"];
const staticExchangeColors = ['text-red-600 bg-red-100 border-red-500', 'text-yellow-800 bg-yellow-100 border-yellow-500', 'text-blue-700 bg-blue-100 border-blue-500', 'text-green-700 bg-green-200 border-green-700', 'text-pink-800 bg-pink-100 border-pink-500', 'text-indigo-500 bg-indigo-200 border-indigo-500', 'text-gray-900 bg-gray-100 border-gray-900'];
const Page = pageProps => {
  const {
    data: originalData,
    metadata,
    exchangesList,
    queryParams
  } = pageProps;
  const [store$1, setStore] = store.createStore({
    data: originalData,
    runFilter: () => {
      setStore('data', transducerFilter());
    },
    metadata,
    search: web.isServer ? queryParams.q ?? '' : new URL(location.href).searchParams.get('q'),
    currentExchange: {
      _data: exchangesList,

      add(exchange) {
        const s = new Set(this._data);
        s.add(exchange);
        setStore('currentExchange', '_data', [...s]);
      },

      delete(exchange) {
        setStore('currentExchange', '_data', this._data.filter(ex => ex !== exchange));
      },

      has(exchange) {
        return this._data.includes(exchange);
      }

    }
  });
  const exchangeStyle = Object.keys(metadata).reduce((acc, key, i) => ({ ...acc,
    [key]: staticExchangeColors[i % staticExchangeColors.length]
  }), {});

  const showSearch = item => {
    if (!store$1.search) return true;
    const searchRegex = new RegExp(store$1.search, 'ig');
    return item.some(i => searchRegex.test(i));
  };

  const showExchange = ([exchange]) => store$1.currentExchange.has(exchange);

  const transducerFilter = solidJs.createMemo(() => originalData.reduce(pipe(TFilter(showExchange), TFilter(showSearch))(TArrayConcat), []));

  return web.ssr(_tmpl$2, web.ssrHydrationKey(), web.escape(store$1.search, true), web.escape(web.createComponent(solidJs.For, {
    get each() {
      return Object.keys(metadata);
    },

    children: exchange => web.ssr(_tmpl$3, web.ssrHydrationKey(), web.ssrBoolean("checked", store$1.currentExchange.has(exchange)), web.escape(exchange))
  })), web.escape(web.createComponent(solidJs.Show, {
    get when() {
      return store$1.search || store$1.currentExchange._data.length < Object.keys(metadata).length;
    },

    get fallback() {
      return web.ssr(_tmpl$4, web.ssrHydrationKey());
    },

    get children() {
      return web.ssr(_tmpl$, web.ssrHydrationKey());
    }

  })), web.escape(web.createComponent(solidJs.Show, {
    get when() {
      return store$1.data.length;
    },

    fallback: 'Please search or select any filter anything',

    get children() {
      return web.createComponent(List, {
        get data() {
          return transducerFilter();
        },

        exchangeStyle: exchangeStyle
      });
    }

  })));
};

const ListItem = props => {
  const [exchange, code, name] = props.item;
  return web.ssr(_tmpl$5, web.ssrHydrationKey(), web.escape(exchange), web.escape(name), `https://www.tradingview.com/symbols/${web.escape(exchange, true)}-${web.escape(code, true)}`, exchange && web.escape(web.createComponent(solidJs.Show, {
    when: exchange,

    get children() {
      return web.ssr(_tmpl$6, web.ssrHydrationKey(), `hidden sm:block text-sm py-1 px-2 border rounded ml-auto opacity-80 group-hover:opacity-100 ${web.escape(props.exchangeColor, true)}`, web.escape(exchange), web.escape(code));
    }

  })));
};

const List = props => {
  return web.ssr(_tmpl$7, web.ssrHydrationKey(), web.escape(web.createComponent(solidJs.For, {
    get each() {
      return props.data;
    },

    children: item => web.createComponent(ListItem, {
      item: item,

      get exchangeColor() {
        return props.exchangeStyle[item[0]];
      }

    })
  })));
};

exports.Page = Page;
