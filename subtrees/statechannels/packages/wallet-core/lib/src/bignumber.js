"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const binaryOperator = (name) => (a, b) => {
    if (typeof ethers_1.BigNumber.from(a)[name] !== 'function')
        throw Error(`Invalid method ${name}`);
    const result = ethers_1.BigNumber.from(a)[name](b);
    return ethers_1.BigNumber.isBigNumber(result) ? result.toHexString() : result;
};
const unaryOperator = (name) => (a) => {
    if (typeof ethers_1.BigNumber.from(a)[name] !== 'function')
        throw Error(`Invalid method ${name}`);
    const result = ethers_1.BigNumber.from(a)[name]();
    return ethers_1.BigNumber.isBigNumber(result) ? result.toHexString() : result;
};
class BN {
}
exports.BN = BN;
BN.eq = binaryOperator('eq');
BN.lt = binaryOperator('lt');
BN.gt = binaryOperator('gt');
BN.lte = binaryOperator('lte');
BN.gte = binaryOperator('gte');
BN.add = binaryOperator('add');
BN.sub = binaryOperator('sub');
BN.mul = binaryOperator('mul');
BN.div = binaryOperator('div');
BN.mod = binaryOperator('mod');
BN.pow = binaryOperator('pow');
BN.abs = unaryOperator('abs');
BN.isNegative = unaryOperator('isNegative');
BN.isZero = unaryOperator('isZero');
BN.toNumber = unaryOperator('toNumber');
BN.toHexString = unaryOperator('toHexString');
BN.from = (n) => ethers_1.BigNumber.from(n).toHexString();
BN.isUint256 = (val) => typeof val === 'string' && !!val.match(/^0x[0-9A-Fa-f]{0,64}$/);
exports.Zero = BN.from(0);
//# sourceMappingURL=bignumber.js.map