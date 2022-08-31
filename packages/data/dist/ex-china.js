"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var pdfreader_1 = require("pdfreader");
var CONFIG_mjs_1 = require("./CONFIG.mjs");
var playwright_chromium_1 = require("playwright-chromium");
var promise_pool_1 = require("@supercharge/promise-pool");
var utils_mjs_1 = require("./utils.mjs");
var progressBar = CONFIG_mjs_1.CONFIG.progressBar.create(2, 0, { stats: '' });
var CHINA_ETF = function (companyCode, title) {
    if (companyCode === void 0) { companyCode = '0838EA'; }
    if (title === void 0) { title = 'NET+ASSET+VALUE+%2F+INDICATIVE+OPTIMUM+PORTFOLIO+VALUE'; }
    return "https://www.bursamalaysia.com/market_information/announcements/company_announcement?company=".concat(companyCode, "&keyword=").concat(title);
};
function parsePdf(pdfUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var companyNames, response, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    companyNames = new Set();
                    return [4 /*yield*/, (0, node_fetch_1.default)(pdfUrl)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.arrayBuffer()];
                case 2:
                    buffer = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var isSedol = false;
                            new pdfreader_1.PdfReader().parseBuffer(buffer, function (err, item) {
                                if (err) {
                                    reject(new Error("Error parsePdf: ".concat(err)));
                                    return;
                                }
                                // pdf read end
                                if (!item)
                                    resolve(Array.from(companyNames));
                                if (isSedol) {
                                    companyNames.add(item.text);
                                    isSedol = false;
                                }
                                // the easiest way to find stock name is with regex the sedol id
                                // and for the next iteration,
                                // add the stock name
                                if ((item === null || item === void 0 ? void 0 : item.text) &&
                                    typeof item.text === 'string' &&
                                    !/[a-z]/.test(item.text) && // discard lower case
                                    /([A-Z]+[0-9]+)+/.test(item.text) && // only grab SEDOL ids
                                    !CONFIG_mjs_1.CONFIG.CHINA.blackListItems.includes(item.text) // remove black list item
                                ) {
                                    isSedol = true;
                                }
                            });
                        })];
            }
        });
    });
}
// click the first "NET ASSET VALUE / INDICATIVE OPTIMUM PORTFOLIO VALUE" row at 4th columns.
function getUpdatedAtAndPdfUrl() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, updatedAt, latestReportSelector, iframeUrl, iframeDomain, pdfUrl, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, playwright_chromium_1.chromium.launch({ headless: !CONFIG_mjs_1.CONFIG.isDev })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 12, 13, 15]);
                    return [4 /*yield*/, page.goto(CHINA_ETF())
                        // get updatedAt at latest report
                    ];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function (_a) {
                            var selector = _a[0], util = _a[1];
                            var pipe = util.pipe, map = util.map, pluck = util.pluck;
                            pipe = new Function("return ".concat(pipe))(); // eslint-disable-line no-new-func
                            map = new Function("return ".concat(map))(); // eslint-disable-line no-new-func
                            pluck = new Function("return ".concat(pluck))(); // eslint-disable-line no-new-func
                            return pipe(function (s) { return document.querySelector(s); }, pluck('textContent'), map(function (text) { return text.trim(); }), map(function (date) { return Date.parse(date); }), map(function (timeStamp) { return Promise.resolve(timeStamp); }))(selector);
                        }, [
                            '#table-announcements tbody td:nth-child(2) .d-none',
                            { pipe: utils_mjs_1.pipe.toString(), map: utils_mjs_1.map.toString(), pluck: utils_mjs_1.pluck.toString() },
                        ])
                        // process of finding pdfUrl
                    ];
                case 5:
                    updatedAt = _a.sent();
                    latestReportSelector = '#table-announcements tbody td:last-child a';
                    return [4 /*yield*/, page.evaluate(function (s) { return document.querySelector(s).removeAttribute('target'); }, [latestReportSelector])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.click(latestReportSelector)
                        // have to put this, otherwise chrome will failed
                    ];
                case 7:
                    _a.sent();
                    // have to put this, otherwise chrome will failed
                    return [4 /*yield*/, (0, utils_mjs_1.delay)(1)];
                case 8:
                    // have to put this, otherwise chrome will failed
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function (s) { return Promise.resolve(document.querySelector(s).getAttribute('src')); }, '#bm_ann_detail_iframe')];
                case 9:
                    iframeUrl = _a.sent();
                    iframeDomain = new URL(iframeUrl).origin;
                    return [4 /*yield*/, page.goto(iframeUrl)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function (s) { return Promise.resolve(document.querySelector(s).getAttribute('href')); }, '.att_download_pdf a')];
                case 11:
                    pdfUrl = _a.sent();
                    return [2 /*return*/, { updatedAt: updatedAt, pdfUrl: "".concat(iframeDomain).concat(pdfUrl) }];
                case 12:
                    e_1 = _a.sent();
                    throw Error("Error getUpdatedAtAndPdfUrl", { cause: e_1 });
                case 13: return [4 /*yield*/, browser.close()];
                case 14:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
/**
 * launch multi-tabs of pages and scrape company name in google.com/search?q={companyname}.
 * and then return Array<[exchange: string, code: string, companyName: string]>
 * remap(google exchange to TV exchange): SHE === 'SZSE', SHA === 'SSE'
 * @param {string[]} stockNames
 * @returns {Promise<*[]>}
 */
function getCompanyExchangeAndCode(stockNames) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, ctx, searchInGoogleFinance, results, e_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, playwright_chromium_1.chromium.launch({ headless: !CONFIG_mjs_1.CONFIG.isDev })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    ctx = _a.sent();
                    searchInGoogleFinance = function (name) { return __awaiter(_this, void 0, void 0, function () {
                        var noMatches, mainInputBox, page, _name, bool, _a, code, exchange;
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    noMatches = 'text=No matches...';
                                    mainInputBox = ":nth-match([aria-label=\"Search for stocks, ETFs & more\"], 2)";
                                    return [4 /*yield*/, ctx.newPage()];
                                case 1:
                                    page = _b.sent();
                                    return [4 /*yield*/, page.goto("https://www.google.com/finance", { waitUntil: 'networkidle' })];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _b.trys.push([3, , 15, 17]);
                                    _name = name;
                                    _b.label = 4;
                                case 4:
                                    _name = _name.slice(0, _name.length - 1);
                                    if (_name.length < 8) {
                                        return [2 /*return*/, ['', '', name]]; // failed to identify this stock and just return it as is.
                                    }
                                    return [4 /*yield*/, page.fill(mainInputBox, _name)];
                                case 5:
                                    _b.sent();
                                    return [4 /*yield*/, (0, utils_mjs_1.delay)(1)];
                                case 6:
                                    _b.sent();
                                    progressBar.update({ stats: "Searching: ".concat(_name) });
                                    return [4 /*yield*/, page.isVisible(noMatches)];
                                case 7:
                                    bool = _b.sent();
                                    if (!!bool) return [3 /*break*/, 12];
                                    return [4 /*yield*/, page.focus(mainInputBox)];
                                case 8:
                                    _b.sent();
                                    return [4 /*yield*/, page.keyboard.down('Enter')];
                                case 9:
                                    _b.sent();
                                    return [4 /*yield*/, (0, utils_mjs_1.delay)(2)
                                        // getting stock code and exchange in url
                                    ];
                                case 10:
                                    _b.sent();
                                    return [4 /*yield*/, page.evaluate(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var split;
                                            return __generator(this, function (_a) {
                                                split = location.pathname.split('/');
                                                return [2 /*return*/, Promise.resolve(split[split.length - 1].split(':'))];
                                            });
                                        }); })
                                        // eslint-disable-next-line no-prototype-builtins
                                    ];
                                case 11:
                                    _a = _b.sent(), code = _a[0], exchange = _a[1];
                                    // eslint-disable-next-line no-prototype-builtins
                                    exchange = CONFIG_mjs_1.CONFIG.CHINA.remapExchangeFromGoogleToTV.hasOwnProperty(exchange)
                                        ? CONFIG_mjs_1.CONFIG.CHINA.remapExchangeFromGoogleToTV[exchange]
                                        : '';
                                    progressBar.increment(1, { stats: "Done: ".concat(exchange, "-").concat(code, "-").concat(name) });
                                    return [2 /*return*/, [exchange, code, name]];
                                case 12: return [4 /*yield*/, page.isVisible(noMatches)];
                                case 13:
                                    if (_b.sent()) return [3 /*break*/, 4];
                                    _b.label = 14;
                                case 14: return [3 /*break*/, 17];
                                case 15: return [4 /*yield*/, page.close()];
                                case 16:
                                    _b.sent();
                                    return [7 /*endfinally*/];
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); };
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, 6, 8]);
                    return [4 /*yield*/, promise_pool_1.PromisePool.for(stockNames).process(searchInGoogleFinance)];
                case 4:
                    results = (_a.sent()).results;
                    return [2 /*return*/, results];
                case 5:
                    e_2 = _a.sent();
                    throw Error("Error getCompanyExchangeAndCode", { cause: e_2 });
                case 6: return [4 /*yield*/, browser.close()];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Main SSE & SZSE scrape function
 * @returns {Promise<MAIN_DEFAULT_EXPORT>}
 * */
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, updatedAt_1, pdfUrl, companyNames, human, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getUpdatedAtAndPdfUrl()];
                case 1:
                    _a = _b.sent(), updatedAt_1 = _a.updatedAt, pdfUrl = _a.pdfUrl;
                    progressBar.increment(1, { stats: 'Success retrieved updatedAt and pdfUrl' });
                    return [4 /*yield*/, parsePdf(pdfUrl)];
                case 2:
                    companyNames = _b.sent();
                    progressBar.increment(1, { stats: 'Success parse pdf' });
                    companyNames = CONFIG_mjs_1.CONFIG.isDev ? companyNames.slice(0, 30) : companyNames;
                    progressBar.update(0);
                    progressBar.setTotal(companyNames.length);
                    return [4 /*yield*/, getCompanyExchangeAndCode(companyNames)];
                case 3:
                    human = _b.sent();
                    return [2 /*return*/, {
                            human: human,
                            data: human.reduce(function (acc, stock) {
                                var _a;
                                var exchange = stock[0], code = stock[1];
                                // some stock failed to get exchange and code
                                if (exchange === '') {
                                    return acc;
                                }
                                // eslint-disable-next-line no-prototype-builtins
                                if (acc.hasOwnProperty(exchange)) {
                                    // this will go to main data file
                                    acc[exchange].list[code] = [1];
                                }
                                else {
                                    acc = __assign(__assign({}, acc), (_a = {}, _a[exchange] = {
                                        updatedAt: updatedAt_1,
                                        list: {},
                                        shape: CONFIG_mjs_1.CONFIG.CHINA.shape,
                                        market: CONFIG_mjs_1.CONFIG.CHINA.market,
                                    }, _a));
                                }
                                return acc;
                            }, {}),
                        }];
                case 4:
                    e_3 = _b.sent();
                    throw Error('Failed scrape CHINA: ' + e_3.message, { cause: e_3 });
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
// main just search thru google search and grab the stock code and exchange
// const _main = async (name) => {
//   progressBar.increment(1, { stats: `Google search: ${name}` })
//
//   const page = await ctx.newPage()
//   const url = `https://google.com/search?q=${encodeURIComponent(name + ' stock price')}`
//   await page.goto(url, { waitUntil: 'networkidle' })
//
//   return await page
//     .evaluate(
//       ([selector, util]) => {
//         let { name, getElementByXPath, remapExchange } = util
//         remapExchange = JSON.parse(remapExchange)
//         getElementByXPath = new Function(`return ${getElementByXPath}`)() // eslint-disable-line no-new-func
//
//         const el = getElementByXPath(selector)
//
//         if (!el) {
//           return Promise.resolve(['', '', name])
//         }
//
//         let [exchange, code] = el.textContent.replace(/\s/g, '').split(':')
//
//         // eslint-disable-next-line no-prototype-builtins
//         if (remapExchange.hasOwnProperty(exchange)) {
//           exchange = remapExchange[exchange]
//         } else throw new Error(`Failed to remap China exchange: ${exchange}:${code}:${name}`)
//
//         return Promise.resolve([exchange, code, name])
//       },
//       [
//         '//*[@id="knowledge-finance-wholepage__entity-summary"]/div/g-card-section/div/g-card-section/div[2]/div[2]/div[1]',
//         {
//           name,
//           getElementByXPath: getElementByXPath.toString(),
//           remapExchange: JSON.stringify(CONFIG.CHINA.remapExchangeFromGoogleToTV),
//         },
//       ]
//     )
//     .finally(async () => await page.close())
// }
