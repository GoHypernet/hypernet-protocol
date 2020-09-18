"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var test_helpers_1 = require("./test-helpers");
var addresses = {
    C: '0xCHANNEL',
    X: '0xANOTHERCHANNEL',
    A: '0x000EXTERNAL',
    B: '0x000ANOTHEREXTERNAL',
    ETH: '0xETH',
    TOK: '0xTOK',
};
var singleAsset = { C: 1, X: 2 };
var singleAssetReplaced = { '0xCHANNEL': ethers_1.BigNumber.from(1), '0xANOTHERCHANNEL': ethers_1.BigNumber.from(2) };
var multiAsset = { ETH: { C: 3 }, TOK: { X: 4 } };
var multiAssetReplaced = {
    '0xETH': { '0xCHANNEL': ethers_1.BigNumber.from(3) },
    '0xTOK': { '0xANOTHERCHANNEL': ethers_1.BigNumber.from(4) },
};
describe('replaceAddressesAndBigNumberify', function () {
    it('replaces without recursion', function () {
        expect(test_helpers_1.replaceAddressesAndBigNumberify(singleAsset, addresses)).toStrictEqual(singleAssetReplaced);
    });
    it('replaces with one level of recursion', function () {
        expect(test_helpers_1.replaceAddressesAndBigNumberify(multiAsset, addresses)).toStrictEqual(multiAssetReplaced);
    });
});
//# sourceMappingURL=test-helpers.test.js.map