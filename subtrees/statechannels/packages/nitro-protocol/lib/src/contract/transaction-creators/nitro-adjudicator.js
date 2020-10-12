"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var NitroAdjudicator_json_1 = __importDefault(require("../../../build/contracts/NitroAdjudicator.json"));
var channel_1 = require("../channel");
var outcome_1 = require("../outcome");
var state_1 = require("../state");
var NitroAdjudicatorContractInterface = new ethers_1.utils.Interface(NitroAdjudicator_json_1.default.abi);
function createPushOutcomeTransaction(turnNumRecord, finalizesAt, state, outcome) {
    var channelId = channel_1.getChannelId(state.channel);
    var stateHash = state_1.hashState(state);
    var participants = state.channel.participants;
    var challengerAddress = participants[state.turnNum % participants.length];
    var encodedOutcome = outcome_1.encodeOutcome(outcome);
    var data = NitroAdjudicatorContractInterface.encodeFunctionData('pushOutcome', [
        channelId,
        turnNumRecord,
        finalizesAt,
        stateHash,
        challengerAddress,
        encodedOutcome,
    ]);
    return { data: data };
}
exports.createPushOutcomeTransaction = createPushOutcomeTransaction;
function concludePushOutcomeAndTransferAllArgs(states, signatures, whoSignedWhat) {
    if (states.length === 0) {
        throw new Error('No states provided');
    }
    var participants = states[0].channel.participants;
    if (participants.length !== signatures.length) {
        throw new Error("Participants (length:" + participants.length + ") and signatures (length:" + signatures.length + ") need to be the same length");
    }
    var lastState = states.reduce(function (s1, s2) { return (s1.turnNum >= s2.turnNum ? s1 : s2); }, states[0]);
    var largestTurnNum = lastState.turnNum;
    var fixedPart = state_1.getFixedPart(lastState);
    var appPartHash = state_1.hashAppPart(lastState);
    var outcomeBytes = outcome_1.encodeOutcome(lastState.outcome);
    var numStates = states.length;
    return [
        largestTurnNum,
        fixedPart,
        appPartHash,
        outcomeBytes,
        numStates,
        whoSignedWhat,
        signatures,
    ];
}
exports.concludePushOutcomeAndTransferAllArgs = concludePushOutcomeAndTransferAllArgs;
function createConcludePushOutcomeAndTransferAllTransaction(states, signatures, whoSignedWhat) {
    return {
        data: NitroAdjudicatorContractInterface.encodeFunctionData('concludePushOutcomeAndTransferAll', concludePushOutcomeAndTransferAllArgs(states, signatures, whoSignedWhat)),
    };
}
exports.createConcludePushOutcomeAndTransferAllTransaction = createConcludePushOutcomeAndTransferAllTransaction;
//# sourceMappingURL=nitro-adjudicator.js.map