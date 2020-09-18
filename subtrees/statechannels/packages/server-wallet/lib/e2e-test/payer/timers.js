"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unitimer_1 = __importDefault(require("unitimer"));
const cli_table3_1 = __importDefault(require("cli-table3"));
class PerformanceTimer {
    constructor(channelIds, paymentCalls) {
        this.paymentCalls = paymentCalls;
        this.channelTimers = {};
        this.channelTimers = channelIds.reduce((result, c) => {
            result[c] = unitimer_1.default(c);
            return result;
        }, {});
    }
    start(channelId) {
        this.channelTimers[channelId].start();
    }
    stop(channelId) {
        this.channelTimers[channelId].stop();
    }
    calculateResults() {
        const maxPayment = Math.max(...Object.keys(this.channelTimers).map(k => this.channelTimers[k].max()));
        const minPayment = Math.min(...Object.keys(this.channelTimers).map(k => this.channelTimers[k].min()));
        const arrayOfMeans = Object.keys(this.channelTimers).map(k => this.channelTimers[k].mean());
        const meanPayment = arrayOfMeans.reduce((a, b) => a + b, 0) / arrayOfMeans.length;
        const arrayOfTotals = Object.keys(this.channelTimers).map(k => this.channelTimers[k].stats().total);
        const maxConsecutivePayment = Math.max(...arrayOfTotals);
        const minConsecutivePayment = Math.min(...arrayOfTotals);
        const meanConsecutivePayment = arrayOfTotals.reduce((a, b) => a + b, 0) / arrayOfTotals.length;
        return {
            meanPayment,
            minPayment,
            maxPayment,
            maxConsecutivePayment,
            minConsecutivePayment,
            meanConsecutivePayment,
            paymentCalls: this.paymentCalls,
            channels: Object.keys(this.channelTimers).length,
        };
    }
    static formatResults(results) {
        const table = new cli_table3_1.default({ head: ['Action', 'Min (MS)', 'Max (MS)', 'Avg (MS)'] });
        table.push(['Individual makePayment call', results.minPayment, results.maxPayment, results.meanPayment], [
            `${results.paymentCalls} consecutive calls of makePayment`,
            results.minConsecutivePayment,
            results.maxConsecutivePayment,
            results.meanConsecutivePayment,
        ]);
        return table.toString();
    }
}
exports.PerformanceTimer = PerformanceTimer;
//# sourceMappingURL=timers.js.map