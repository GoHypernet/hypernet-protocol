"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var outcome_1 = require("../outcome");
function createTransferAllTransaction(assetHolderContractInterface, channelId, allocation) {
    var data = assetHolderContractInterface.encodeFunctionData('transferAll', [
        channelId,
        outcome_1.encodeAllocation(allocation),
    ]);
    return { data: data };
}
exports.createTransferAllTransaction = createTransferAllTransaction;
function claimAllArgs(channelId, guarantee, allocation) {
    return [channelId, outcome_1.encodeGuarantee(guarantee), outcome_1.encodeAllocation(allocation)];
}
exports.claimAllArgs = claimAllArgs;
function createClaimAllTransaction(assetHolderContractInterface, channelId, guarantee, allocation) {
    var data = assetHolderContractInterface.encodeFunctionData('claimAll', claimAllArgs(channelId, guarantee, allocation));
    return { data: data };
}
exports.createClaimAllTransaction = createClaimAllTransaction;
function createSetOutcomeTransaction(assetHolderContractInterface, channelId, outcome) {
    var data = assetHolderContractInterface.encodeFunctionData('setOutcome', [
        channelId,
        outcome_1.hashOutcome(outcome),
    ]);
    return { data: data };
}
exports.createSetOutcomeTransaction = createSetOutcomeTransaction;
//# sourceMappingURL=asset-holder.js.map