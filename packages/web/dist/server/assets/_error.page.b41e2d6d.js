'use strict';

exports[Symbol.toStringTag] = 'Module';

var web = require('solid-js/web');

const _tmpl$ = ["<h1", ">404 Page Not Found</h1>"],
      _tmpl$2 = ["<p", ">This page could not be found.</p>"],
      _tmpl$3 = ["<h1", ">500 Internal Server Error</h1>"],
      _tmpl$4 = ["<p", ">Something went wrong.</p>"];
function Page({
  is404
}) {
  if (is404) {
    return [web.ssr(_tmpl$, web.ssrHydrationKey()), web.ssr(_tmpl$2, web.ssrHydrationKey())];
  } else {
    return [web.ssr(_tmpl$3, web.ssrHydrationKey()), web.ssr(_tmpl$4, web.ssrHydrationKey())];
  }
}

exports.Page = Page;
