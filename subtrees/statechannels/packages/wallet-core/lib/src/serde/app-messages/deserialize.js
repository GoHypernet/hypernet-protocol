"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@ethersproject/constants");
const config_1 = require("../../config");
const bignumber_1 = require("../../bignumber");
const utils_1 = require("../../utils");
function deserializeBudgetRequest(budgetRequest, domain) {
    const assetBudget = {
        assetHolderAddress: config_1.ETH_ASSET_HOLDER_ADDRESS,
        availableSendCapacity: bignumber_1.BN.from(budgetRequest.requestedSendCapacity),
        availableReceiveCapacity: bignumber_1.BN.from(budgetRequest.requestedReceiveCapacity),
        channels: {}
    };
    return {
        domain,
        hubAddress: budgetRequest.hub.signingAddress,
        forAsset: { [config_1.ETH_ASSET_HOLDER_ADDRESS]: assetBudget }
    };
}
exports.deserializeBudgetRequest = deserializeBudgetRequest;
function deserializeDomainBudget(DomainBudget) {
    const assetBudgets = DomainBudget.budgets.map(b => ({
        assetHolderAddress: utils_1.assetHolderAddress(b.token) || constants_1.AddressZero,
        availableReceiveCapacity: bignumber_1.BN.from(b.availableReceiveCapacity),
        availableSendCapacity: bignumber_1.BN.from(b.availableSendCapacity),
        channels: b.channels.reduce((record, item) => {
            record[item.channelId] = { amount: bignumber_1.BN.from(item.amount) };
            return record;
        }, {})
    }));
    const budgets = assetBudgets.reduce((record, a) => {
        record[a.assetHolderAddress] = a;
        return record;
    }, {});
    return {
        domain: DomainBudget.domain,
        hubAddress: DomainBudget.hubAddress,
        forAsset: budgets
    };
}
exports.deserializeDomainBudget = deserializeDomainBudget;
function deserializeAllocations(allocations) {
    switch (allocations.length) {
        case 0:
            throw new Error('Allocations is empty');
        case 1:
            return deserializeAllocation(allocations[0]);
        default:
            return {
                type: 'MixedAllocation',
                simpleAllocations: allocations.map(deserializeAllocation)
            };
    }
}
exports.deserializeAllocations = deserializeAllocations;
function deserializeAllocation(allocation) {
    const assetHolder = utils_1.assetHolderAddress(allocation.token);
    if (!assetHolder) {
        throw new Error(`Can't find asset holder for token ${allocation.token}`);
    }
    return {
        type: 'SimpleAllocation',
        allocationItems: allocation.allocationItems.map(deserializeAllocationItem),
        assetHolderAddress: assetHolder
    };
}
function deserializeAllocationItem(allocationItem) {
    return {
        destination: utils_1.makeDestination(allocationItem.destination),
        amount: bignumber_1.BN.from(allocationItem.amount)
    };
}
//# sourceMappingURL=deserialize.js.map