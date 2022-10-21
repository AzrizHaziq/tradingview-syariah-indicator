"use strict";
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
exports.getElementByXPath = exports.prettierJSON = exports.commitChangesIfAny = exports.isSameWithPreviousData = exports.gitCommand = exports.logCount = exports.CliProgress = exports.writeToFile = exports.delay = exports.map = exports.pluck = exports.pipe = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var colors_1 = require("colors");
var prettier_1 = require("prettier");
var child_process_1 = require("child_process");
var cli_progress_1 = require("cli-progress");
var CONFIG_mjs_1 = require("./CONFIG.mjs");
var pipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (initialVal) {
        return fns.reduce(function (acc, fn) { return fn(acc); }, initialVal);
    };
};
exports.pipe = pipe;
var pluck = function (key) { return function (obj) { return obj[key] || null; }; };
exports.pluck = pluck;
var map = function (fn) { return function (item) { return fn(item); }; };
exports.map = map;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function delay(delaySecond) {
    if (delaySecond === void 0) { delaySecond = getRandomInt(1, 2); }
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(delaySecond); }, delaySecond * 1000);
    });
}
exports.delay = delay;
/**
 * @param {string} filename
 * @param {string} data
 * @returns {void}
 */
function writeToFile(filename, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                fs_1.default.writeFileSync(filename, data, { encoding: 'utf-8' }, function (e) {
                    if (e) {
                        console.log('Error writeToFile', e);
                        throw Error("Unable to writeToFile", { cause: e });
                    }
                });
                console.log("Saved in: ".concat(filename));
            }
            catch (e) {
                console.error('Error write data', e);
                process.exit(1);
            }
            return [2 /*return*/];
        });
    });
}
exports.writeToFile = writeToFile;
var CliProgress = /** @class */ (function () {
    function CliProgress() {
        if (!CliProgress.instance) {
            CliProgress.instance = new cli_progress_1.default.MultiBar({
                clearOnComplete: false,
                hideCursor: true,
            }, {
                format: colors_1.default.yellow(' {bar} ') + '{percentage}% | ETA: {eta}s | {value}/{total} {stats}',
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
            });
        }
    }
    CliProgress.prototype.getInstance = function () {
        return CliProgress.instance;
    };
    return CliProgress;
}());
exports.CliProgress = CliProgress;
function logCount(exchanges) {
    var maxExchangeLength = Math.max.apply(Math, Object.keys(exchanges).map(function (k) { return k.length; }));
    Object.entries(exchanges).forEach(function (_a) {
        var exchange = _a[0], list = _a[1].list;
        console.log("".concat(exchange.padEnd(maxExchangeLength, ' '), " >> ").concat(Object.keys(list).length));
    });
}
exports.logCount = logCount;
function gitCommand() {
    var command = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        command[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var process = (0, child_process_1.spawn)('git', __spreadArray([], command, true));
                    process.on('close', function (code) {
                        resolve(code);
                    });
                    process.on('error', function (err) {
                        reject(err);
                    });
                })];
        });
    });
}
exports.gitCommand = gitCommand;
function isSameWithPreviousData(newData, filePath) {
    if (filePath === void 0) { filePath = "".concat(path_1.default.resolve(), "/").concat(CONFIG_mjs_1.CONFIG.humanOutput); }
    var fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
    var oldData = JSON.parse(fileContent).data;
    return JSON.stringify(oldData) === JSON.stringify(newData);
}
exports.isSameWithPreviousData = isSameWithPreviousData;
function commitChangesIfAny() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, gitCommand('add', 'stock-list*.json')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, gitCommand('commit', '-m [STOCK_LIST] script_bot: Update with new changes')];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error('Error commit', e_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.commitChangesIfAny = commitChangesIfAny;
function prettierJSON(str) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, prettier_1.default.format(str, { semi: false, parser: 'json' })];
        });
    });
}
exports.prettierJSON = prettierJSON;
// https://stackoverflow.com/a/43688599/3648961
function getElementByXPath(path) {
    return new XPathEvaluator().evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue;
}
exports.getElementByXPath = getElementByXPath;
