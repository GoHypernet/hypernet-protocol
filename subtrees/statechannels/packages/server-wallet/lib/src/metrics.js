"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const fs_1 = __importDefault(require("fs"));
function setupMetrics(knex, metricsOutputFile) {
    if (metricsOutputFile) {
        fs_1.default.writeFileSync(metricsOutputFile, '', { flag: 'w' });
    }
    const log = (entry) => {
        if (metricsOutputFile) {
            fs_1.default.appendFileSync(metricsOutputFile, JSON.stringify(entry) + '\n');
        }
        else {
            console.log(JSON.stringify(entry));
        }
    };
    const obs = new perf_hooks_1.PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            log(entry);
        }
    });
    obs.observe({
        entryTypes: ['node', 'measure', 'gc', 'function', 'http2', 'http'],
        buffered: false,
    });
    knex
        .on('query', query => {
        const uid = query.__knexQueryUid;
        perf_hooks_1.performance.mark(`${uid}-start`);
    })
        .on('query-response', (response, query) => {
        const uid = query.__knexQueryUid;
        perf_hooks_1.performance.mark(`${uid}-end`);
        perf_hooks_1.performance.measure(`query-${query.sql}`, `${uid}-start`, `${uid}-end`);
    });
}
exports.setupMetrics = setupMetrics;
exports.timerFactory = (timingMetrics, prefix) => async (label, cb) => time(timingMetrics, `${prefix}: ${label}`, cb);
async function time(timingMetrics, label, cb) {
    if (timingMetrics) {
        perf_hooks_1.performance.mark(`${label}-start`);
        const result = await cb();
        perf_hooks_1.performance.mark(`${label}-end`);
        perf_hooks_1.performance.measure(label, `${label}-start`, `${label}-end`);
        return result;
    }
    else {
        return await cb();
    }
}
function recordFunctionMetrics(objectOrFunction, timingMetrics = true) {
    if (timingMetrics) {
        if (typeof objectOrFunction === 'object') {
            const functionKeys = Object.keys(objectOrFunction)
                .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(objectOrFunction)))
                .filter(k => typeof objectOrFunction[k] === 'function');
            for (const fk of functionKeys) {
                objectOrFunction[fk] = perf_hooks_1.performance.timerify(objectOrFunction[fk]);
            }
        }
        else if (typeof objectOrFunction === 'function') {
            return perf_hooks_1.performance.timerify(objectOrFunction);
        }
    }
    return objectOrFunction;
}
exports.recordFunctionMetrics = recordFunctionMetrics;
//# sourceMappingURL=metrics.js.map