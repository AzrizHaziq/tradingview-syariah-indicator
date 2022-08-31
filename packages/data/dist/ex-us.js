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
var utils_mjs_1 = require("./utils.mjs");
var CONFIG_mjs_1 = require("./CONFIG.mjs");
var promise_pool_1 = require("@supercharge/promise-pool");
var progressBar = CONFIG_mjs_1.CONFIG.progressBar.create(100, 0, { stats: '' });
function transformToTickersAndSymbols(data) {
    return data // get tickers & symbols
        .reduce(function (acc, item) {
        var _a = item.split(','), ticker = _a[2], fullname = _a[4];
        // remove non stock item (sukuk)
        if (CONFIG_mjs_1.CONFIG.US.blackListItems.some(function (i) { return new RegExp(i, 'i').test(ticker); })) {
            return acc;
        }
        return __spreadArray(__spreadArray([], acc, true), [{ ticker: ticker, fullname: fullname }], false);
    }, []);
}
function prettierCSV(csv) {
    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }
    return (csv
        .split('\n')
        .filter(Boolean)
        // remove not valid data (eg column header
        .reduce(function (acc, item) {
        var firstCol = item.split(',')[0];
        return isValidDate(new Date(firstCol)) ? acc.concat(item) : acc;
    }, []));
}
// https://www.tradingview.com/symbols/NYSE-A/
var getExchange = function (item) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, exchange, response, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = CONFIG_mjs_1.CONFIG.US.exchanges;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    exchange = _a[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("https://www.tradingview.com/symbols/".concat(exchange, "-").concat(item.ticker, "/"))
                        // console.log(response.status === 200 ? '\x1b[31m' : '\x1b[36m'`${response.status}:${item.ticker}:${exchange}`)
                        // only expect status code to be 200 and 404
                    ];
                case 3:
                    response = _b.sent();
                    // console.log(response.status === 200 ? '\x1b[31m' : '\x1b[36m'`${response.status}:${item.ticker}:${exchange}`)
                    // only expect status code to be 200 and 404
                    if (![200, 404].includes(response.status)) {
                        reject(new Error("Failed (getExchanged): status code diff than 200 & 404: ".concat(exchange, ":").concat(item.ticker)));
                    }
                    if (response.status === 200) {
                        progressBar.increment(1, { stats: "".concat(exchange, "-").concat(item.ticker) });
                        resolve(__assign(__assign({}, item), { exchange: exchange }));
                        return [3 /*break*/, 6];
                        // if all exchanges failed, then search that stock if it is really exist
                    }
                    else if (exchange === CONFIG_mjs_1.CONFIG.US.exchanges[CONFIG_mjs_1.CONFIG.US.exchanges.length - 1]) {
                        return [3 /*break*/, 5];
                        // reject(new Error(`Failed (getExchanged): all exchanges failed: ${exchange}:${item.ticker}`))
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    reject(new Error("Failed (getExchanged): ".concat(exchange, ":").concat(item.ticker, ": ").concat(e_1)));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    }); });
};
function runTaskSequentially(tasks) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, results, errors, e_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promise_pool_1.PromisePool.for(tasks).process(function (item) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getExchange(item)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 1:
                    _a = _b.sent(), results = _a.results, errors = _a.errors;
                    if (errors.length) {
                        throw Error("failed runTaskSequentially", { cause: errors });
                    }
                    return [2 /*return*/, results.reduce(function (acc, item) {
                            // shape final output
                            acc.data[item.exchange][item.ticker] = [1];
                            acc.human.push([item.exchange, item.ticker, item.fullname]);
                            return acc;
                        }, { human: [], data: CONFIG_mjs_1.CONFIG.US.exchanges.reduce(function (acc, exchange) {
                                var _a;
                                return (__assign(__assign({}, acc), (_a = {}, _a[exchange] = {}, _a)));
                            }, {}) })];
                case 2:
                    e_2 = _b.sent();
                    console.error(e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var finalOutput = function (updatedAt) { return function (p) {
    return p.then(function (_a) {
        var data = _a.data, human = _a.human;
        return ({
            human: human,
            data: Object.entries(data).reduce(function (acc, _a) {
                var _b;
                var k = _a[0], v = _a[1];
                return (__assign(__assign({}, acc), (Object.keys(v).length
                    ? (_b = {},
                        _b[k] = {
                            updatedAt: updatedAt,
                            list: v,
                            shape: CONFIG_mjs_1.CONFIG.US.shape,
                            market: CONFIG_mjs_1.CONFIG.US.market,
                        },
                        _b) : {})));
            }, {}),
        });
    });
}; };
/**
 * Main NYSE & NASDAQ & AMAX & OTC scrape function
 * @returns {Promise<MAIN_DEFAULT_EXPORT>}
 * */
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseText, updatedAt, _a, m, d, y, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(CONFIG_mjs_1.CONFIG.US.wahedHoldingUrl)];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    responseText = _b.sent();
                    updatedAt = prettierCSV(responseText)[0].split(',')[0];
                    _a = updatedAt.split('/'), m = _a[0], d = _a[1], y = _a[2];
                    updatedAt = new Date(y, m - 1, d).getTime();
                    return [4 /*yield*/, (0, utils_mjs_1.pipe)(prettierCSV, transformToTickersAndSymbols, function (data) { return data.slice(0, CONFIG_mjs_1.CONFIG.isDev ? 10 : data.length); }, function (data) {
                            progressBar.setTotal(data.length);
                            return data;
                        }, runTaskSequentially, finalOutput(updatedAt))(responseText)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    e_3 = _b.sent();
                    throw Error("Error generating US stock", { cause: e_3 });
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
