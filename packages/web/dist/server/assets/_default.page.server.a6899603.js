'use strict';

exports[Symbol.toStringTag] = 'Module';

var web = require('solid-js/web');
var imgs = require('./imgs.affe25b7.js');
require('./analytics.876cfeac.js');
var store = require('solid-js/store');
var solidJs = require('solid-js');
var vitePluginSsr = require('vite-plugin-ssr');
require('analytics');
require('@analytics/google-analytics');

var PageLayout$1 = '';

const PageContext = solidJs.createContext([{
  pageContext: null
}, () => {}]);
function PageContextProvider(props) {
  const store$1 = store.createStore({
    pageContext: props.pageContext
  });
  return web.createComponent(PageContext.Provider, {
    value: store$1,

    get children() {
      return props.children;
    }

  });
}
function usePageContext() {
  return solidJs.useContext(PageContext);
}

const _tmpl$ = ["<header", " class=\"text-gray-600 body-font sticky top-0 bg-gray-700 z-10\"><div class=\"container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center\"><a href=\"/\" class=\"flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0\"><img src=\"", "\" height=\"32\" width=\"32\" alt=\"logo\"></a><nav class=\"md:mr-auto md:ml-4 md:py-1 md:pl-4 gap-5 flex flex-wrap items-center text-base justify-center\"><a href=\"/list\" class=\"", "\">Shariah list</a><a href=\"/guideline\" class=\"", "\">Guideline</a><a href=\"/dev\" class=\"", "\">Dev</a></nav></div></header>"],
      _tmpl$2 = ["<main", " class=\"text-gray-600 body-font\"><section class=\"container px-5 py-10 mx-auto\">", "</section></main>"];
const PageLayout = props => {
  const [state] = usePageContext();
  const urlPathname = state.pageContext.urlPathname;
  return [web.ssr(_tmpl$, web.ssrHydrationKey(), web.escape(imgs.IMGS.logo, true), `text-white hover:text-green-500 ${urlPathname === '/list' ? "text-green-300" : ""}`, `text-white hover:text-green-500 ${urlPathname === '/guideline' ? "text-green-300" : ""}`, `text-white hover:text-green-500 ${urlPathname === '/dev' ? "text-green-300" : ""}`), web.ssr(_tmpl$2, web.ssrHydrationKey(), web.escape(props.children))];
};

const name_display = "Tradingview Shariah Indicator";
const description = " Add a small green indicator in tradingview.com. At the moment, only cover Malaysian, NYSE, Nasdaq, Shenzhen, Shanghai at the moment.";

const passToClient = ['pageProps', 'documentProps'];
function render(pageContext) {
  const {
    Page,
    pageProps
  } = pageContext;
  const pageHtml = web.renderToString(() => web.createComponent(PageContextProvider, {
    pageContext: pageContext,

    get children() {
      return web.createComponent(PageLayout, {
        get children() {
          return web.createComponent(Page, pageProps);
        }

      });
    }

  })); // See https://vite-plugin-ssr.com/html-head

  const {
    documentProps
  } = pageContext;
  const title = documentProps && documentProps.title || name_display;
  const descriptions = documentProps && documentProps.description || description;
  return vitePluginSsr.escapeInject`<!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${imgs.IMGS.logo}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${descriptions}" />
        <title>${title}</title>
        ${vitePluginSsr.dangerouslySkipEscape(web.generateHydrationScript())}
      </head>
      <body class="bg-gray-900">
        <div id="tsi-web">${vitePluginSsr.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}

exports.passToClient = passToClient;
exports.render = render;
