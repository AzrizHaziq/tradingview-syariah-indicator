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
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = require("xlsx");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_os_1 = require("node:os");
var extract_zip_1 = require("extract-zip");
var utils_1 = require("./utils");
var config_1 = require("./config");
var playwright_chromium_1 = require("playwright-chromium");
var progressBar = config_1.CONFIG.progressBar.create(3, 0, { stats: '' });
function fetchShariahList() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, userAgent, ctx, page, download, zipPath, xlsxFile, shariahList, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, playwright_chromium_1.chromium.launch({ headless: !config_1.CONFIG.isDev })];
                case 1:
                    browser = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, 13, 15]);
                    userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36';
                    return [4 /*yield*/, browser.newContext({ userAgent: userAgent })];
                case 3:
                    ctx = _a.sent();
                    return [4 /*yield*/, ctx.newPage()];
                case 4:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto('https://www.idx.co.id/data-pasar/data-saham/indeks-saham/')
                        // Download the latest ISSI (Indeks Saham Syariah Indonesia) zip file
                    ];
                case 5:
                    _a.sent();
                    // Download the latest ISSI (Indeks Saham Syariah Indonesia) zip file
                    return [4 /*yield*/, page.selectOption('select#indexCodeList', 'ISSI')];
                case 6:
                    // Download the latest ISSI (Indeks Saham Syariah Indonesia) zip file
                    _a.sent();
                    return [4 /*yield*/, page.locator('text=Cari').click({ timeout: 10000 })
                        // Wait for the page to response and show the expected widgets
                    ];
                case 7:
                    _a.sent();
                    // Wait for the page to response and show the expected widgets
                    return [4 /*yield*/, page.waitForResponse(function (resp) { return resp.status() < 400 && ['/GetStockIndex', 'code=ISSI'].every(function (str) { return resp.url().includes(str); }); })
                        // Download the first ISSI file
                    ];
                case 8:
                    // Wait for the page to response and show the expected widgets
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            page.waitForEvent('download'),
                            page.locator('table#indexConstituentTable tr', { hasText: new RegExp("Per\\s+\\d{1,2}\\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\\s+\\d{4}.", "i") })
                                .locator('a[href$="zip"]')
                                //.locator('table#indexConstituentTable tr a[href$="zip"]')
                                .first().click(), // find the first zip file in table
                        ])
                        // Wait for the download process to complete
                    ];
                case 9:
                    download = (_a.sent())[0];
                    return [4 /*yield*/, download.path()];
                case 10:
                    zipPath = _a.sent();
                    progressBar.increment(1, { stats: 'Successfully retrieved zip file from Indonesian exchange official website' });
                    return [4 /*yield*/, getXlsxFile(zipPath)];
                case 11:
                    xlsxFile = _a.sent();
                    progressBar.increment(1, { stats: 'Successfully found XLSX file containing the ISSI list' });
                    shariahList = extractFromXlsxFile(xlsxFile);
                    progressBar.increment(1, { stats: 'Successfully extracted and parsed ISSI list' });
                    return [2 /*return*/, shariahList];
                case 12:
                    e_1 = _a.sent();
                    // eslint-disable-next-line no-console
                    console.error('Failed to fetch or extract the ISSI stock list', e_1);
                    process.exit(1);
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, browser.close()];
                case 14:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function getXlsxFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var extractionDir, xlsxFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    extractionDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), 'tvidx'));
                    return [4 /*yield*/, (0, extract_zip_1.default)(filePath, { dir: extractionDir })
                        // Get the list file
                    ];
                case 1:
                    _a.sent();
                    xlsxFile = undefined;
                    node_fs_1.default.readdirSync(extractionDir)
                        .filter(function (file) { return file.match(new RegExp('.*ISSI.*\.(.xlsx)', 'ig')); })
                        .forEach(function (file) {
                        xlsxFile = node_path_1.default.resolve(extractionDir, file); // Absolute path
                    });
                    return [2 /*return*/, xlsxFile];
            }
        });
    });
}
function extractFromXlsxFile(xlsxFile) {
    var workbook = xlsx_1.default.readFile(xlsxFile);
    var sheet = workbook.Sheets[workbook.SheetNames[0]];
    var data = xlsx_1.default.utils.sheet_to_json(sheet, { header: 1 });
    var codeColIdx = -1;
    return data
        .flatMap(function (row) {
        if (codeColIdx != -1) {
            var stockCode = row[codeColIdx];
            var fullname = row[codeColIdx + 1];
            if (stockCode && stockCode.match(/^([A-Z]{4})$/)) {
                return { s: 1, stockCode: stockCode, fullname: fullname }; // s:1 is Shariah
            }
        }
        else {
            codeColIdx = findCodeColumnIndex(row);
        }
        return null;
    })
        .filter(Boolean);
}
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var shariahList, human, sortedList, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchShariahList()];
                case 1:
                    shariahList = _a.sent();
                    human = (0, utils_1.pipe)(Object.values, function (values) { return values.map(function (val) { return ['IDX', val.stockCode, val.fullname]; }); })(shariahList);
                    sortedList = (0, utils_1.pipe)(Object.values, function (entries) { return entries.sort(function (_a, _b) {
                        var keyA = _a.stockCode;
                        var keyB = _b.stockCode;
                        return (keyA < keyB ? -1 : keyA > keyB ? 1 : 0);
                    }); }, function (items) {
                        return items.reduce(function (acc, _a) {
                            var _b;
                            var code = _a.code, stockCode = _a.stockCode, fullname = _a.fullname, res = __rest(_a, ["code", "stockCode", "fullname"]);
                            return (__assign(__assign({}, acc), (_b = {}, _b[stockCode] = Object.values(res), _b)));
                        }, {});
                    })(shariahList);
                    return [2 /*return*/, {
                            human: human,
                            data: {
                                IDX: {
                                    updatedAt: Date.now(),
                                    list: sortedList,
                                    shape: config_1.CONFIG.IDX.shape,
                                    market: config_1.CONFIG.IDX.market,
                                },
                            },
                        }];
                case 2:
                    e_2 = _a.sent();
                    throw new Error("Error generating IDX", { cause: e_2 });
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
function findCodeColumnIndex(colValues) {
    for (var i = 0; i < colValues.length; i++) {
        var value = colValues[i];
        if (value && value.toString().toLowerCase().includes('kode')) {
            return i;
        }
    }
    return -1;
}
