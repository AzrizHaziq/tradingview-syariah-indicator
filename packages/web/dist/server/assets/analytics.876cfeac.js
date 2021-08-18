'use strict';

var Analytics = require('analytics');
var googleAnalytics = require('@analytics/google-analytics');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Analytics__default = /*#__PURE__*/_interopDefaultLegacy(Analytics);
var googleAnalytics__default = /*#__PURE__*/_interopDefaultLegacy(googleAnalytics);

console.log("production" === "development", 11);
Analytics__default["default"]({
  app: "tradingview shariah indicator web",
  debug: "production" === "development",
  plugins: [googleAnalytics__default["default"]({ trackingId: "UA-183073441-1" })]
});
