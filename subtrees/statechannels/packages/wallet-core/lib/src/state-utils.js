"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nitro_protocol_1 = require("@statechannels/nitro-protocol");
const bytes_1 = require("@ethersproject/bytes");
const _ = require("lodash");
const ethers_1 = require("ethers");
const bignumber_1 = require("./bignumber");
function toNitroState(state) {
    const { channelNonce, participants, chainId } = state;
    const channel = { channelNonce, chainId, participants: participants.map(x => x.signingAddress) };
    return Object.assign(Object.assign({}, _.pick(state, 'appData', 'isFinal', 'challengeDuration', 'appDefinition', 'turnNum')), { outcome: convertToNitroOutcome(state.outcome), channel });
}
exports.toNitroState = toNitroState;
function fromNitroState(state) {
    const { appData, isFinal, outcome, challengeDuration, appDefinition, channel, turnNum } = state;
    return {
        appDefinition,
        isFinal,
        appData,
        outcome: fromNitroOutcome(outcome),
        turnNum: turnNum,
        challengeDuration: challengeDuration,
        channelNonce: Number(channel.channelNonce),
        chainId: channel.chainId,
        participants: channel.participants.map(x => ({
            signingAddress: x,
            participantId: x,
            destination: x.padStart(64, '0')
        }))
    };
}
exports.fromNitroState = fromNitroState;
function toNitroSignedState(signedState) {
    const state = toNitroState(signedState);
    const { signatures } = signedState;
    return signatures.map(sig => ({ state, signature: bytes_1.splitSignature(sig.signature) }));
}
exports.toNitroSignedState = toNitroSignedState;
function calculateChannelId(channelConstants) {
    const { chainId, channelNonce, participants } = channelConstants;
    const addresses = participants.map(p => p.signingAddress);
    return nitro_protocol_1.getChannelId({ chainId, channelNonce, participants: addresses });
}
exports.calculateChannelId = calculateChannelId;
function createSignatureEntry(state, privateKey) {
    const { address } = new ethers_1.Wallet(privateKey);
    const nitroState = toNitroState(state);
    const { signature } = nitro_protocol_1.signState(nitroState, privateKey);
    return { signature: bytes_1.joinSignature(signature), signer: address };
}
exports.createSignatureEntry = createSignatureEntry;
function signState(state, privateKey) {
    const nitroState = toNitroState(state);
    const { signature } = nitro_protocol_1.signState(nitroState, privateKey);
    return bytes_1.joinSignature(signature);
}
exports.signState = signState;
function hashState(state) {
    const nitroState = toNitroState(state);
    return nitro_protocol_1.hashState(nitroState);
}
exports.hashState = hashState;
function getSignerAddress(state, signature) {
    const nitroState = toNitroState(state);
    return nitro_protocol_1.getStateSignerAddress({ state: nitroState, signature: bytes_1.splitSignature(signature) });
}
exports.getSignerAddress = getSignerAddress;
function statesEqual(left, right) {
    return hashState(left) === hashState(right);
}
exports.statesEqual = statesEqual;
function simpleAllocationsEqual(left, right) {
    return (left.assetHolderAddress === right.assetHolderAddress &&
        left.allocationItems.length === right.allocationItems.length &&
        _.every(left.allocationItems, (value, index) => value.destination === right.allocationItems[index].destination &&
            bignumber_1.BN.eq(value.amount, right.allocationItems[index].amount)));
}
function outcomesEqual(left, right) {
    var _a, _b, _c;
    if (left.type === 'SimpleAllocation' && ((_a = right) === null || _a === void 0 ? void 0 : _a.type) === 'SimpleAllocation') {
        return simpleAllocationsEqual(left, right);
    }
    if (left.type === 'SimpleGuarantee' && ((_b = right) === null || _b === void 0 ? void 0 : _b.type) === 'SimpleGuarantee') {
        return _.isEqual(left, right);
    }
    if (left.type === 'MixedAllocation' && ((_c = right) === null || _c === void 0 ? void 0 : _c.type) === 'MixedAllocation') {
        return (left.simpleAllocations.length === right.simpleAllocations.length &&
            _.every(left.simpleAllocations, (_, index) => simpleAllocationsEqual(left.simpleAllocations[index], right.simpleAllocations[index])));
    }
    return false;
}
exports.outcomesEqual = outcomesEqual;
exports.firstState = (outcome, { channelNonce, chainId, challengeDuration, appDefinition, participants }, appData) => ({
    appData: appData || '0x',
    isFinal: false,
    turnNum: 0,
    chainId: chainId || '0x01',
    channelNonce,
    challengeDuration,
    appDefinition,
    participants,
    outcome
});
function convertToNitroAllocationItems(allocationItems) {
    return allocationItems.map(a => ({
        amount: a.amount,
        destination: a.destination.length === 42 ? nitro_protocol_1.convertAddressToBytes32(a.destination) : a.destination
    }));
}
function convertFromNitroAllocationItems(allocationItems) {
    return allocationItems.map(a => ({
        amount: bignumber_1.BN.from(a.amount),
        destination: a.destination.substr(2, 22) === '00000000000000000000'
            ? nitro_protocol_1.convertBytes32ToAddress(a.destination)
            : a.destination
    }));
}
function convertToNitroOutcome(outcome) {
    switch (outcome.type) {
        case 'SimpleAllocation':
            return [
                {
                    assetHolderAddress: outcome.assetHolderAddress,
                    allocationItems: convertToNitroAllocationItems(outcome.allocationItems)
                }
            ];
        case 'SimpleGuarantee':
            return [
                {
                    assetHolderAddress: outcome.assetHolderAddress,
                    guarantee: {
                        targetChannelId: outcome.targetChannelId,
                        destinations: outcome.destinations
                    }
                }
            ];
        case 'MixedAllocation':
            console.warn('NOTE: MixedAllocation is using 0th-indexed allocation only');
            return outcome.simpleAllocations.map(convertToNitroOutcome)[0];
    }
}
exports.convertToNitroOutcome = convertToNitroOutcome;
function fromNitroOutcome(outcome) {
    const [singleOutcomeItem] = outcome;
    if (typeof singleOutcomeItem['allocationItems'] !== 'undefined') {
        return {
            type: 'SimpleAllocation',
            assetHolderAddress: singleOutcomeItem.assetHolderAddress,
            allocationItems: convertFromNitroAllocationItems(singleOutcomeItem['allocationItems'])
        };
    }
    if (typeof singleOutcomeItem['guarantee'] !== 'undefined') {
        return {
            type: 'SimpleGuarantee',
            assetHolderAddress: singleOutcomeItem.assetHolderAddress,
            targetChannelId: singleOutcomeItem['guarantee'].targetChannelId,
            destinations: singleOutcomeItem['guarantee'].destinations
        };
    }
    return {
        type: 'MixedAllocation',
        simpleAllocations: []
    };
}
exports.fromNitroOutcome = fromNitroOutcome;
function nextState(state, outcome) {
    if (state.outcome.type !== outcome.type) {
        throw new Error('Attempting to change outcome type');
    }
    return Object.assign(Object.assign({}, state), { turnNum: state.turnNum + 1, outcome });
}
exports.nextState = nextState;
//# sourceMappingURL=state-utils.js.map