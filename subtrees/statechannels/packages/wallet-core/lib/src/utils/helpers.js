"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bytes_1 = require("@ethersproject/bytes");
const bignumber_1 = require("../bignumber");
function unreachable(x) {
    return x;
}
exports.unreachable = unreachable;
exports.exists = (t) => !!t;
const throwError = (fn, t) => {
    throw new Error(`not valid, ${fn.name} failed on ${t}`);
};
function checkThat(t, isTypeT) {
    if (!isTypeT(t)) {
        throwError(isTypeT, t);
        throw 'Unreachable';
    }
    return t;
}
exports.checkThat = checkThat;
function createDestination(address) {
    return bytes_1.hexZeroPad(address, 32);
}
exports.createDestination = createDestination;
function formatAmount(amount) {
    return bytes_1.hexZeroPad(bignumber_1.BN.from(amount), 32);
}
exports.formatAmount = formatAmount;
function arrayToRecord(array, idProperty) {
    return array.reduce((obj, item) => {
        obj[item[idProperty]] = item;
        return obj;
    }, {});
}
exports.arrayToRecord = arrayToRecord;
function recordToArray(record) {
    return Object.keys(record)
        .map(k => record[k])
        .filter(e => e !== undefined);
}
exports.recordToArray = recordToArray;
//# sourceMappingURL=helpers.js.map