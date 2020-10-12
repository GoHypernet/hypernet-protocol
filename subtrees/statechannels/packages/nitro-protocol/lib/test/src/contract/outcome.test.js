"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var outcome_1 = require("../../../src/contract/outcome");
var destination = ethers_1.utils.id('d');
var targetChannelId = ethers_1.utils.id('t');
var destinations = [destination];
var assetHolderAddress = ethers_1.Wallet.createRandom().address;
var guarantee = {
    targetChannelId: targetChannelId,
    destinations: destinations,
};
var allocationItems = [{ destination: destination, amount: '0x05' }];
var outcome = [
    { assetHolderAddress: assetHolderAddress, allocationItems: allocationItems },
    { assetHolderAddress: assetHolderAddress, guarantee: guarantee },
];
var emptyOutcome = [];
var description0 = 'Encodes and decodes guarantee';
var description1 = 'Encodes and decodes allocation';
var description2 = 'Encodes and decodes outcome';
var description3 = 'Encodes and decodes empty outcome';
describe('outcome', function () {
    describe('encoding and decoding', function () {
        it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      description     | encodeFunction      | decodeFunction      | data\n      ", " | ", "  | ", "  | ", "\n      ", " | ", " | ", " | ", "\n      ", " | ", "    | ", "    | ", "\n      ", " | ", "    | ", "    | ", "\n    "], ["\n      description     | encodeFunction      | decodeFunction      | data\n      ", " | ", "  | ", "  | ", "\n      ", " | ", " | ", " | ", "\n      ", " | ", "    | ", "    | ", "\n      ", " | ", "    | ", "    | ", "\n    "])), description0, outcome_1.encodeGuarantee, outcome_1.decodeGuarantee, guarantee, description1, outcome_1.encodeAllocation, outcome_1.decodeAllocation, allocationItems, description2, outcome_1.encodeOutcome, outcome_1.decodeOutcome, outcome, description3, outcome_1.encodeOutcome, outcome_1.decodeOutcome, emptyOutcome)('$description', function (_a) {
            var encodeFunction = _a.encodeFunction, decodeFunction = _a.decodeFunction, data = _a.data;
            var encodedData = encodeFunction(data);
            var decodedData = decodeFunction(encodedData);
            expect(decodedData).toEqual(data);
        });
    });
});
var templateObject_1;
//# sourceMappingURL=outcome.test.js.map