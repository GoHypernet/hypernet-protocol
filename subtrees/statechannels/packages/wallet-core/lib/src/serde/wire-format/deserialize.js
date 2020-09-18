"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wire_format_1 = require("@statechannels/wire-format");
const bignumber_1 = require("../../bignumber");
const utils_1 = require("../../utils");
const state_utils_1 = require("../../state-utils");
function convertToInternalParticipant(participant) {
    return Object.assign(Object.assign({}, participant), { destination: utils_1.makeDestination(participant.destination) });
}
exports.convertToInternalParticipant = convertToInternalParticipant;
function deserializeMessage(message) {
    var _a, _b, _c, _d, _e, _f;
    const signedStates = (_c = (_b = (_a = message) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.signedStates) === null || _c === void 0 ? void 0 : _c.map(ss => deserializeState(ss));
    const objectives = (_f = (_e = (_d = message) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.objectives) === null || _f === void 0 ? void 0 : _f.map(objective => deserializeObjective(objective));
    return {
        signedStates,
        objectives
    };
}
exports.deserializeMessage = deserializeMessage;
function deserializeState(state) {
    const stateWithoutChannelId = Object.assign({}, state);
    delete stateWithoutChannelId.channelId;
    const deserializedState = Object.assign(Object.assign({}, stateWithoutChannelId), { outcome: deserializeOutcome(state.outcome), participants: stateWithoutChannelId.participants.map(convertToInternalParticipant) });
    return Object.assign(Object.assign({}, deserializedState), { signatures: state.signatures.map(sig => ({
            signature: sig,
            signer: state_utils_1.getSignerAddress(deserializedState, sig)
        })) });
}
exports.deserializeState = deserializeState;
function deserializeObjective(objective) {
    return Object.assign(Object.assign({}, objective), { participants: objective.participants.map(p => (Object.assign(Object.assign({}, p), { destination: utils_1.makeDestination(p.destination) }))) });
}
exports.deserializeObjective = deserializeObjective;
function deserializeOutcome(outcome) {
    if (wire_format_1.isAllocations(outcome)) {
        switch (outcome.length) {
            case 0:
                throw new Error('Empty allocation');
            case 1:
                return deserializeAllocation(outcome[0]);
            default:
                return {
                    type: 'MixedAllocation',
                    simpleAllocations: outcome.map(deserializeAllocation)
                };
        }
    }
    else {
        if (outcome.length !== 1) {
            throw new Error('Currently only supporting guarantees of length 1.');
        }
        else {
            return Object.assign({ type: 'SimpleGuarantee' }, outcome[0]);
        }
    }
}
function deserializeAllocation(allocation) {
    const { assetHolderAddress, allocationItems } = allocation;
    return {
        type: 'SimpleAllocation',
        assetHolderAddress,
        allocationItems: allocationItems.map(deserializeAllocationItem)
    };
}
function deserializeAllocationItem(allocationItem) {
    const { amount, destination } = allocationItem;
    return { destination: utils_1.makeDestination(destination), amount: bignumber_1.BN.from(amount) };
}
//# sourceMappingURL=deserialize.js.map