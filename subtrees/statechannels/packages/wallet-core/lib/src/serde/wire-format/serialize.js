"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_utils_1 = require("../../state-utils");
const utils_1 = require("../../utils");
function serializeMessage(message, recipient, sender) {
    const signedStates = (message.signedStates || []).map(ss => serializeState(ss));
    const { objectives } = message;
    return {
        recipient,
        sender,
        data: { signedStates, objectives }
    };
}
exports.serializeMessage = serializeMessage;
function serializeState(state) {
    const { chainId, participants, channelNonce, appDefinition, challengeDuration, turnNum, appData, isFinal } = state;
    return {
        chainId,
        participants,
        channelNonce,
        appDefinition,
        challengeDuration,
        turnNum,
        appData,
        isFinal,
        outcome: serializeOutcome(state.outcome),
        channelId: state_utils_1.calculateChannelId(state),
        signatures: state.signatures.map(s => s.signature)
    };
}
exports.serializeState = serializeState;
function serializeOutcome(outcome) {
    switch (outcome.type) {
        case 'SimpleAllocation':
            return [serializeSimpleAllocation(outcome)];
        case 'MixedAllocation':
            return outcome.simpleAllocations.map(serializeSimpleAllocation);
        case 'SimpleGuarantee':
            return [serializeSimpleGuarantee(outcome)];
    }
}
function serializeSimpleAllocation(allocation) {
    return {
        assetHolderAddress: allocation.assetHolderAddress,
        allocationItems: allocation.allocationItems.map(serializeAllocationItem)
    };
}
function serializeSimpleGuarantee(guarantee) {
    return {
        assetHolderAddress: guarantee.assetHolderAddress,
        targetChannelId: guarantee.targetChannelId,
        destinations: guarantee.destinations
    };
}
function serializeAllocationItem(allocationItem) {
    const { destination, amount } = allocationItem;
    return { destination, amount: utils_1.formatAmount(amount) };
}
//# sourceMappingURL=serialize.js.map