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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var CONFIG_mjs_1 = require("./CONFIG.mjs");
var utils_mjs_1 = require("./utils.mjs");
var playwright_chromium_1 = require("playwright-chromium");
var promise_pool_1 = require("@supercharge/promise-pool");
var progressBar = CONFIG_mjs_1.CONFIG.progressBar.create(100, 0, { stats: '' });
/**
 * @param {{s: 1, code: string, stockName: string}[]} stocks - Fetching company fullname in a page(50 items) {s:1, code: '0012', '3A' }[]
 * @returns {Promise<Object<string, {s: 1, code: string, stockName: string, fullname; string}>>} - {'0012': {s:1, code: '0012', '3A', fullName: 'Three-A Resources Berhad' }}
 */
function getCompanyName(stocks) {
    return __awaiter(this, void 0, void 0, function () {
        /**
         * @param {string} code
         * @returns {Promise<string>}
         */
        function getCompanyFullname(code) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var res, json;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, (0, node_fetch_1.default)("https://www.bursamalaysia.com/api/v1/equities_prices/sneak_peek?stock_id=".concat(code))];
                        case 1:
                            res = _c.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            json = _c.sent();
                            return [2 /*return*/, (_b = (_a = json.data) === null || _a === void 0 ? void 0 : _a.company_info) === null || _b === void 0 ? void 0 : _b.name];
                    }
                });
            });
        }
        var _a, results, errors, e_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promise_pool_1.PromisePool.for(stocks) // mostly stocks will have 50 items based on per_page
                            .withConcurrency(25) // fetch company fullname 25 items at a time
                            .process(function (stock) { return __awaiter(_this, void 0, void 0, function () {
                            var fullname;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getCompanyFullname(stock.code)];
                                    case 1:
                                        fullname = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, stock), { fullname: fullname })];
                                }
                            });
                        }); })];
                case 1:
                    _a = _b.sent(), results = _a.results, errors = _a.errors;
                    if (errors.length) {
                        throw Error("failed fetch getCompanyFullName", { cause: errors });
                    }
                    return [2 /*return*/, results.reduce(function (acc, curr) {
                            acc[curr.code] = curr;
                            return acc;
                        }, {})];
                case 2:
                    e_1 = _b.sent();
                    throw Error("Failed at getCompanyName", { cause: e_1 });
                case 3: return [2 /*return*/];
            }
        });
    });
}
var scrapUrl = function (_a) {
    var perPage = _a.perPage, page = _a.page;
    return "https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=".concat(page, "&per_page=").concat(perPage);
};
/** @returns {Promise<{[p: string]: {s: 1, code: string, stockName: string, fullname, string}}>} */
function scrapBursaMalaysia() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, ctx_1, initPage, maxPageNumbers, _a, results, errors, e_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, playwright_chromium_1.chromium.launch({ headless: !CONFIG_mjs_1.CONFIG.isDev })];
                case 1:
                    browser = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 9, 10, 12]);
                    return [4 /*yield*/, browser.newContext()];
                case 3:
                    ctx_1 = _b.sent();
                    return [4 /*yield*/, ctx_1.newPage()];
                case 4:
                    initPage = _b.sent();
                    return [4 /*yield*/, initPage.goto(scrapUrl({ page: 1, perPage: 50 }))
                        // getting max size of syariah list by grabbing the value in pagination btn
                    ];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (CONFIG_mjs_1.CONFIG.isDev
                            ? Promise.resolve(1)
                            : initPage.evaluate(function () {
                                var paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
                                    .map(function (i) { return i.textContent; })
                                    .filter(Boolean)
                                    .map(parseFloat);
                                return Math.max.apply(Math, paginationBtn);
                            }))];
                case 6:
                    maxPageNumbers = _b.sent();
                    progressBar.setTotal(maxPageNumbers);
                    return [4 /*yield*/, initPage.close()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, promise_pool_1.PromisePool.for(Array.from({ length: maxPageNumbers }))
                            .withConcurrency(5) // 5 pages at a time
                            .process(function (_, i) { return __awaiter(_this, void 0, void 0, function () {
                            var page, pageNo, scrapeList, shariahList;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx_1.newPage()];
                                    case 1:
                                        page = _a.sent();
                                        pageNo = "".concat(i + 1).padStart(2, '0');
                                        return [4 /*yield*/, page.goto(scrapUrl({ page: i + 1, perPage: 50 }), { waitUntil: 'networkidle' })
                                            /** @returns {Promise<{s: 1, code: string, stockName: string}[]>} */
                                        ];
                                    case 2:
                                        _a.sent();
                                        scrapeList = function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, page.evaluate(function () {
                                                            var pipe = function () {
                                                                var fn = [];
                                                                for (var _i = 0; _i < arguments.length; _i++) {
                                                                    fn[_i] = arguments[_i];
                                                                }
                                                                return function (initialVal) {
                                                                    return fn.reduce(function (acc, fn) { return fn(acc); }, initialVal);
                                                                };
                                                            };
                                                            var removeSpaces = pipe(function (name) { return name.replace(/\s/gm, ''); });
                                                            var removeSpacesAndShariah = pipe(removeSpaces, function (name) { return name.replace(/\[S\]/gim, ''); });
                                                            return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr')).reduce(function (acc, tr) {
                                                                var s = tr.querySelector(':nth-child(2)').textContent;
                                                                var stockCode = tr.querySelector(':nth-child(3)').textContent;
                                                                var code = removeSpaces(stockCode);
                                                                var stockName = removeSpacesAndShariah(s);
                                                                return __spreadArray(__spreadArray([], acc, true), [{ s: 1, code: code, stockName: stockName }], false);
                                                            }, []);
                                                        })
                                                        // this does the work as of retry scrapping function
                                                        // sometime scrape return 0 items
                                                    ];
                                                    case 1: return [2 /*return*/, _a.sent()
                                                        // this does the work as of retry scrapping function
                                                        // sometime scrape return 0 items
                                                    ];
                                                }
                                            });
                                        }); };
                                        return [4 /*yield*/, scrapeList()];
                                    case 3:
                                        shariahList = _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        if (!(shariahList.length <= 0)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, (0, utils_mjs_1.delay)(1)];
                                    case 5:
                                        _a.sent();
                                        progressBar.increment(0, { stats: "Page ".concat(pageNo, ": retry") });
                                        return [4 /*yield*/, scrapeList()];
                                    case 6:
                                        shariahList = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 7:
                                        progressBar.increment(0.5, { stats: "Page ".concat(pageNo, ": scrapped") });
                                        return [4 /*yield*/, getCompanyName(shariahList)];
                                    case 8:
                                        shariahList = _a.sent();
                                        progressBar.increment(0.5, { stats: "Page ".concat(pageNo, ": done") });
                                        return [2 /*return*/, shariahList];
                                }
                            });
                        }); })
                        // TODO: fixme if there is error in pool
                    ];
                case 8:
                    _a = _b.sent(), results = _a.results, errors = _a.errors;
                    // TODO: fixme if there is error in pool
                    if (errors.length) {
                        console.log(errors, 'MYX, promise pool scrape failed', errors, results);
                        throw Error("failed scrape stock in pages", { cause: errors });
                    }
                    return [2 /*return*/, results.reduce(function (acc, chunk) { return (__assign(__assign({}, acc), chunk)); }, {})];
                case 9:
                    e_2 = _b.sent();
                    // eslint-disable-next-line no-console
                    console.error('Error scrap MYX data', e_2);
                    process.exit(1);
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, browser.close()];
                case 11:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
/**
 * Main MYX scrape function
 * @returns {Promise<MAIN_DEFAULT_EXPORT>}
 * */
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var shariahList, human, sortedList, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, scrapBursaMalaysia()];
                case 1:
                    shariahList = _a.sent();
                    human = (0, utils_mjs_1.pipe)(Object.values, function (values) { return values.map(function (val) { return ['MYX', val.stockName, val.fullname]; }); })(shariahList);
                    sortedList = (0, utils_mjs_1.pipe)(Object.values, function (entries) { return entries.sort(function (_a, _b) {
                        var keyA = _a.stockName;
                        var keyB = _b.stockName;
                        return (keyA < keyB ? -1 : keyA > keyB ? 1 : 0);
                    }); }, function (items) {
                        return items.reduce(function (acc, _a) {
                            var _b;
                            var code = _a.code, stockName = _a.stockName, fullname = _a.fullname, res = __rest(_a, ["code", "stockName", "fullname"]);
                            return (__assign(__assign({}, acc), (_b = {}, _b[stockName] = Object.values(res), _b)));
                        }, {});
                    })(shariahList);
                    return [2 /*return*/, {
                            human: human,
                            data: {
                                MYX: {
                                    updatedAt: Date.now(),
                                    list: sortedList,
                                    shape: CONFIG_mjs_1.CONFIG.MYX.shape,
                                    market: CONFIG_mjs_1.CONFIG.MYX.market,
                                },
                            },
                        }];
                case 2:
                    e_3 = _a.sent();
                    throw Error("Error generating MYX", { cause: e_3 });
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
