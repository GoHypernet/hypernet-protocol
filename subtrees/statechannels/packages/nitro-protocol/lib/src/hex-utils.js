"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
function addHex(a, b) {
    return ethers_1.BigNumber.from(a)
        .add(ethers_1.BigNumber.from(b))
        .toHexString();
}
exports.addHex = addHex;
function subHex(a, b) {
    return ethers_1.BigNumber.from(a)
        .sub(ethers_1.BigNumber.from(b))
        .toHexString();
}
exports.subHex = subHex;
function eqHex(a, b) {
    return ethers_1.BigNumber.from(a).eq(b);
}
exports.eqHex = eqHex;
function eqHexArray(a, b) {
    return (a.length === b.length &&
        a.reduce(function (equalsSoFar, aVal, idx) { return equalsSoFar && eqHex(aVal, b[idx]); }, true));
}
exports.eqHexArray = eqHexArray;
function toHex(a) {
    return ethers_1.BigNumber.from(a).toHexString();
}
exports.toHex = toHex;
function fromHex(a) {
    return ethers_1.BigNumber.from(a).toNumber();
}
exports.fromHex = fromHex;
//# sourceMappingURL=hex-utils.js.map