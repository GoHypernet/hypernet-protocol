"use strict";
/**
 * TODO: Explain how or why `process` is expected to exist.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var pino_1 = __importDefault(require("pino"));
var lodash_1 = __importDefault(require("lodash"));
// eslint-disable-next-line no-undef
var LOG_TO_CONSOLE = process.env.LOG_DESTINATION === 'console';
// eslint-disable-next-line no-undef
var LOG_TO_FILE = process.env.LOG_DESTINATION && !LOG_TO_CONSOLE;
// eslint-disable-next-line no-undef
var IS_BROWSER_CONTEXT = process.env.JEST_WORKER_ID === undefined;
var name = 'channel-provider';
var postMessageAndCallToConsoleFn = function (consoleFn) { return function (o) {
    var withName = JSON.stringify(__assign(__assign({}, o), { name: name }));
    // The simplest way to give users/developers easy access to the logs in a single place is to
    // make the application aware of all the pino logs via postMessage
    // Then, the application can package up all the logs into a single file
    window.postMessage({ type: 'PINO_LOG', logEvent: JSON.parse(withName) }, '*');
    if (LOG_TO_FILE)
        consoleFn(withName);
    else
        consoleFn(o.msg, lodash_1.default.omit(o, 'msg'));
}; };
var browser = IS_BROWSER_CONTEXT
    ? {
        write: {
            error: postMessageAndCallToConsoleFn(console.error),
            warn: postMessageAndCallToConsoleFn(console.warn),
            info: postMessageAndCallToConsoleFn(console.info),
            debug: postMessageAndCallToConsoleFn(console.debug),
            // Firefox & chrome automatically expand trace calls, which is pretty annoying.
            // So, we direct trace calls to console.debug instead.
            trace: postMessageAndCallToConsoleFn(console.debug)
        }
    }
    : undefined;
var prettyPrint = LOG_TO_CONSOLE ? { translateTime: true } : false;
var ADD_LOGS = LOG_TO_FILE || LOG_TO_CONSOLE;
// eslint-disable-next-line no-undef
var LOG_LEVEL = ADD_LOGS ? (_a = process.env.LOG_LEVEL, (_a !== null && _a !== void 0 ? _a : 'info')) : 'silent';
var level = (_b = window.localStorage.LOG_LEVEL, (_b !== null && _b !== void 0 ? _b : LOG_LEVEL));
var opts = { name: name, prettyPrint: prettyPrint, browser: browser, level: level };
exports.logger = pino_1.default(opts);
window.addEventListener('message', function (event) {
    if (event.data.type === 'SET_LOG_LEVEL') {
        var level_1 = event.data.level;
        exports.logger.level = level_1;
        console.log("provider: level CLEARED from " + exports.logger.level + " to " + level_1);
    }
    else if (event.data.type === 'CLEAR_LOG_LEVEL') {
        exports.logger.level = LOG_LEVEL;
        console.log("provider: level CHANGED from " + exports.logger.level + " to " + LOG_LEVEL);
    }
});
//# sourceMappingURL=logger.js.map