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
var config_1 = require("./config");
var utils_1 = require("./utils");
var isCommitSKip = process.argv.slice(2).includes('skip-commit') // for github-action cron
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var INDEX_CODES, ALL_SHARIAH_LIST, _a, allData_1, allHuman_1, sortedHuman, _b, _c, e_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 8, , 9]);
                INDEX_CODES = ['US', 'MYX', 'CHINA', 'IDX'];
                return [4 /*yield*/, Promise.all(INDEX_CODES.map(function (code) { return Promise.resolve().then(function () { return require("./ex-".concat(code.toLowerCase())); }).then(function (m) { return m.default(); }); }))];
            case 1:
                ALL_SHARIAH_LIST = _d.sent();
                return [4 /*yield*/, (0, utils_1.delay)(1)];
            case 2:
                _d.sent();
                _a = ALL_SHARIAH_LIST.reduce(function (acc, _a) {
                    var human = _a.human, data = _a.data;
                    return ({
                        allData: __assign(__assign({}, acc.allData), data),
                        allHuman: acc.allHuman.concat(human),
                    });
                }, { allData: {}, allHuman: [] }), allData_1 = _a.allData, allHuman_1 = _a.allHuman;
                config_1.CONFIG.whitelist.forEach(function (_a) {
                    var _b;
                    var exchange = _a[0], code = _a[1], fullname = _a[2];
                    allHuman_1.push([exchange, code, fullname]);
                    // whitelist data will merge into stock-list.json according to exchange
                    if (Object.hasOwn(allData_1, exchange)) {
                        allData_1[exchange].list[code] = [1];
                    }
                    else {
                        // if not exist then create new
                        allData_1[exchange] = { list: (_b = {}, _b[code] = [1], _b) };
                    }
                });
                sortedHuman = allHuman_1
                    .sort(function (_a, _b) {
                    var a1 = _a[0], a2 = _a[1], a3 = _a[2];
                    var b1 = _b[0], b2 = _b[1], b3 = _b[2];
                    if (a2 === b2 && a3 === b3)
                        return a1 > b1 ? 1 : a1 < b1 ? -1 : 0; // sort by exchange
                    if (a3 === b3)
                        return a2 > b2 ? 1 : a2 < b2 ? -1 : 0; // sort by code
                    return a3 > b3 ? 1 : a3 < b3 ? -1 : 0; // by default use company name to sort
                })
                    // sometimes we are unable to parse correctly CHINA exchange code, so remove all empty code
                    .filter(function (_a) {
                    var code = _a[1];
                    return code;
                });
                console.log('\n');
                if ((0, utils_1.isSameWithPreviousData)(sortedHuman)) {
                    console.log('Previous data and current data is same, hence skip commit');
                    process.exit();
                }
                (0, utils_1.logCount)(allData_1);
                return [4 /*yield*/, (0, utils_1.writeToFile)(config_1.CONFIG.mainOutput, JSON.stringify(allData_1))];
            case 3:
                _d.sent();
                _b = utils_1.writeToFile;
                _c = [config_1.CONFIG.humanOutput];
                return [4 /*yield*/, (0, utils_1.prettierJSON)(JSON.stringify({
                        data: sortedHuman,
                        // pluck all updatedAt data from each exchanges
                        metadata: Object.entries(allData_1).reduce(function (acc, _a) {
                            var exchange = _a[0], detail = _a[1];
                            acc[exchange] = detail['updatedAt'];
                            return acc;
                        }, {}),
                    }))];
            case 4: return [4 /*yield*/, _b.apply(void 0, _c.concat([_d.sent()]))];
            case 5:
                _d.sent();
                if (!!isCommitSKip) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, utils_1.commitChangesIfAny)()];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                process.exit();
                return [3 /*break*/, 9];
            case 8:
                e_1 = _d.sent();
                console.error('Something wrong with the whole process', e_1);
                process.exit(1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); })();
