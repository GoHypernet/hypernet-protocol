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
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const { AddressZero, HashZero } = ethers_1.constants;
const state_utils_1 = require("../state-utils");
const bignumber_1 = require("../bignumber");
const simpleAllocation1 = {
    type: 'SimpleAllocation',
    assetHolderAddress: AddressZero,
    allocationItems: [{ destination: HashZero, amount: bignumber_1.BN.from('0x2') }]
};
const simpleAllocation2 = {
    type: 'SimpleAllocation',
    assetHolderAddress: AddressZero,
    allocationItems: [{ destination: HashZero, amount: bignumber_1.BN.from('0x02') }]
};
describe('outcomesEqual', () => {
    it('returns equal for identical SimpleAllocations', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(state_utils_1.outcomesEqual(simpleAllocation1, simpleAllocation1)).toEqual(true);
    }));
    it('returns equal for equivalent SimpleAllocations', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(state_utils_1.outcomesEqual(simpleAllocation1, simpleAllocation2)).toEqual(true);
    }));
});
//# sourceMappingURL=outcomes-equal.test.js.map