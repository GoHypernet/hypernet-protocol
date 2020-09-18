"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ethers_1 = require("ethers");
const config_1 = require("../config");
const bignumber_1 = require("../bignumber");
const helpers_1 = require("./helpers");
function isSimpleAllocation(outcome) {
    return outcome.type === 'SimpleAllocation';
}
exports.isSimpleAllocation = isSimpleAllocation;
function isSimpleEthAllocation(outcome) {
    return (outcome.type === 'SimpleAllocation' && outcome.assetHolderAddress === config_1.ETH_ASSET_HOLDER_ADDRESS);
}
exports.isSimpleEthAllocation = isSimpleEthAllocation;
function assertSimpleEthAllocation(outcome) {
    return helpers_1.checkThat(outcome, isSimpleEthAllocation);
}
exports.assertSimpleEthAllocation = assertSimpleEthAllocation;
exports.simpleEthAllocation = (allocationItems) => ({
    type: 'SimpleAllocation',
    assetHolderAddress: config_1.ETH_ASSET_HOLDER_ADDRESS,
    allocationItems
});
exports.simpleEthGuarantee = (targetChannelId, ...destinations) => ({
    type: 'SimpleGuarantee',
    destinations,
    targetChannelId,
    assetHolderAddress: config_1.ETH_ASSET_HOLDER_ADDRESS
});
exports.simpleTokenAllocation = (assetHolderAddress, allocationItems) => ({
    type: 'SimpleAllocation',
    assetHolderAddress,
    allocationItems
});
var Errors;
(function (Errors) {
    Errors["DestinationMissing"] = "Destination missing from ledger channel";
    Errors["InsufficientFunds"] = "Insufficient funds in ledger channel";
    Errors["InvalidOutcomeType"] = "Invalid outcome type";
})(Errors = exports.Errors || (exports.Errors = {}));
function allocateToTarget(currentOutcome, deductions, targetChannelId) {
    if (currentOutcome.type !== 'SimpleAllocation') {
        throw new Error(Errors.InvalidOutcomeType);
    }
    currentOutcome = _.cloneDeep(currentOutcome);
    let total = bignumber_1.Zero;
    let currentItems = currentOutcome.allocationItems;
    deductions.forEach(targetItem => {
        const ledgerItem = currentItems.find(i => i.destination === targetItem.destination);
        if (!ledgerItem) {
            throw new Error(Errors.DestinationMissing);
        }
        total = bignumber_1.BN.add(total, targetItem.amount);
        ledgerItem.amount = bignumber_1.BN.sub(ledgerItem.amount, targetItem.amount);
        if (bignumber_1.BN.lt(ledgerItem.amount, 0))
            throw new Error(Errors.InsufficientFunds);
    });
    currentItems.push({ destination: makeDestination(targetChannelId), amount: total });
    currentItems = currentItems.filter(i => bignumber_1.BN.gt(i.amount, 0));
    currentOutcome.allocationItems = currentItems;
    return currentOutcome;
}
exports.allocateToTarget = allocateToTarget;
function makeDestination(addressOrDestination) {
    if (addressOrDestination.length === 42) {
        return ethers_1.ethers.utils.hexZeroPad(ethers_1.ethers.utils.getAddress(addressOrDestination), 32);
    }
    else if (addressOrDestination.length === 66) {
        return addressOrDestination;
    }
    else {
        throw new Error('Invalid input');
    }
}
exports.makeDestination = makeDestination;
//# sourceMappingURL=outcome.js.map