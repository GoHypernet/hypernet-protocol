"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@ethersproject/constants");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const bignumber_1 = require("../../bignumber");
function serializeDomainBudget(budget) {
    const budgets = Object.keys(budget.forAsset).map(assetHolderAddress => {
        const assetBudget = utils_1.checkThat(budget.forAsset[assetHolderAddress], utils_1.exists);
        const channels = Object.keys(assetBudget.channels).map(channelId => ({
            channelId,
            amount: utils_1.formatAmount(bignumber_1.BN.from(assetBudget.channels[channelId].amount))
        }));
        return {
            token: utils_1.tokenAddress(assetHolderAddress) || constants_1.AddressZero,
            availableReceiveCapacity: utils_1.formatAmount(assetBudget.availableReceiveCapacity),
            availableSendCapacity: utils_1.formatAmount(assetBudget.availableSendCapacity),
            channels
        };
    });
    return {
        domain: budget.domain,
        hubAddress: budget.hubAddress,
        budgets
    };
}
exports.serializeDomainBudget = serializeDomainBudget;
function serializeAllocation(allocation) {
    switch (allocation.type) {
        case 'SimpleAllocation':
            return [serializeSimpleAllocation(allocation)];
        case 'MixedAllocation':
            return allocation.simpleAllocations.map(serializeSimpleAllocation);
    }
}
exports.serializeAllocation = serializeAllocation;
function serializeSimpleAllocation(allocation) {
    const token = utils_1.tokenAddress(allocation.assetHolderAddress);
    if (!token) {
        throw new Error(`Can't find token address for asset holder ${allocation.assetHolderAddress}`);
    }
    return {
        allocationItems: allocation.allocationItems.map(serializeAllocationItem),
        token
    };
}
function serializeAllocationItem(allocationItem) {
    return {
        destination: allocationItem.destination,
        amount: utils_1.formatAmount(allocationItem.amount)
    };
}
function serializeChannelEntry(channelEntry) {
    const { latest: { appData, turnNum, outcome }, channelConstants: { participants, appDefinition }, channelId } = channelEntry;
    if (!types_1.isAllocation(outcome)) {
        throw new Error('Can only send allocations to the app');
    }
    let status = 'running';
    if (turnNum == 0) {
        status = 'proposed';
    }
    else if (turnNum < 2 * participants.length - 1) {
        status = 'opening';
    }
    else if (channelEntry.hasConclusionProof) {
        status = 'closed';
    }
    else if (channelEntry.isSupported && channelEntry.supported.isFinal) {
        status = 'closing';
    }
    return {
        participants,
        allocations: serializeAllocation(outcome),
        appDefinition,
        appData,
        status,
        turnNum,
        channelId
    };
}
exports.serializeChannelEntry = serializeChannelEntry;
//# sourceMappingURL=serialize.js.map