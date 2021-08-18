'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports[Symbol.toStringTag] = 'Module';

// Vite resolves globs with micromatch: https://github.com/micromatch/micromatch
// Pattern `*([a-zA-Z0-9])` is an Extglob: https://github.com/micromatch/micromatch#extglobs
const pageFiles = {
    //@ts-ignore
    '.page': { "/renderer/_error.page.tsx": () => Promise.resolve().then(function () { return require('./assets/_error.page.b41e2d6d.js'); }), "/pages/dev/index.page.tsx": () => Promise.resolve().then(function () { return require('./assets/index.page.306d62a5.js'); }), "/pages/guideline/index.page.tsx": () => Promise.resolve().then(function () { return require('./assets/index.page.8fad2526.js'); }), "/pages/index/index.page.tsx": () => Promise.resolve().then(function () { return require('./assets/index.page.b7a19a19.js'); }), "/pages/list/index.page.tsx": () => Promise.resolve().then(function () { return require('./assets/index.page.54c1152e.js'); }),},
    //@ts-ignore
    '.page.client': { "/renderer/_default.page.client.tsx": () => Promise.resolve().then(function () { return require('./assets/_default.page.client.6894c7bd.js'); }),},
    //@ts-ignore
    '.page.server': { "/renderer/_default.page.server.tsx": () => Promise.resolve().then(function () { return require('./assets/_default.page.server.a6899603.js'); }), "/pages/list/index.page.server.ts": () => Promise.resolve().then(function () { return require('./assets/index.page.server.917df870.js'); }),},
    //@ts-ignore
    '.page.route': {}
};

exports.pageFiles = pageFiles;
