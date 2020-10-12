"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var ForceMove_json_1 = __importDefault(require("../../../build/contracts/ForceMove.json"));
var signatures_1 = require("../../signatures");
var outcome_1 = require("../outcome");
var state_1 = require("../state");
exports.ForceMoveContractInterface = new ethers_1.ethers.utils.Interface(ForceMove_json_1.default.abi);
function createForceMoveTransaction(states, signatures, whoSignedWhat, challengerPrivateKey) {
    if (states.length === 0) {
        throw new Error('No states provided');
    }
    var participants = states[0].channel.participants;
    if (participants.length !== signatures.length) {
        throw new Error("Participants (length:" + participants.length + ") and signatures (length:" + signatures.length + ") need to be the same length");
    }
    var variableParts = states.map(function (s) { return state_1.getVariablePart(s); });
    var fixedPart = state_1.getFixedPart(states[0]);
    var largestTurnNum = Math.max.apply(Math, states.map(function (s) { return s.turnNum; }));
    var isFinalCount = states.filter(function (s) { return s.isFinal === true; }).length;
    var signedStates = states.map(function (s) { return ({
        state: s,
        signature: { v: 0, r: '', s: '', _vs: '', recoveryParam: 0 },
    }); });
    var challengerSignature = signatures_1.signChallengeMessage(signedStates, challengerPrivateKey);
    var data = exports.ForceMoveContractInterface.encodeFunctionData('forceMove', [
        fixedPart,
        largestTurnNum,
        variableParts,
        isFinalCount,
        signatures,
        whoSignedWhat,
        challengerSignature,
    ]);
    return { data: data };
}
exports.createForceMoveTransaction = createForceMoveTransaction;
function respondArgs(_a) {
    var challengeState = _a.challengeState, responseState = _a.responseState, responseSignature = _a.responseSignature;
    var participants = challengeState.channel.participants;
    var challengerAddress = participants[challengeState.turnNum % participants.length];
    var isFinalAB = [challengeState.isFinal, responseState.isFinal];
    var fixedPart = state_1.getFixedPart(responseState);
    var variablePartAB = [state_1.getVariablePart(challengeState), state_1.getVariablePart(responseState)];
    return [challengerAddress, isFinalAB, fixedPart, variablePartAB, responseSignature];
}
exports.respondArgs = respondArgs;
function createRespondTransaction(args) {
    var data = exports.ForceMoveContractInterface.encodeFunctionData('respond', respondArgs(args));
    return { data: data };
}
exports.createRespondTransaction = createRespondTransaction;
function createCheckpointTransaction(_a) {
    var states = _a.states, signatures = _a.signatures, whoSignedWhat = _a.whoSignedWhat;
    var data = exports.ForceMoveContractInterface.encodeFunctionData('checkpoint', checkpointArgs({ states: states, signatures: signatures, whoSignedWhat: whoSignedWhat }));
    return { data: data };
}
exports.createCheckpointTransaction = createCheckpointTransaction;
function checkpointArgs(_a) {
    var states = _a.states, signatures = _a.signatures, whoSignedWhat = _a.whoSignedWhat;
    var largestTurnNum = Math.max.apply(Math, states.map(function (s) { return s.turnNum; }));
    var fixedPart = state_1.getFixedPart(states[0]);
    var variableParts = states.map(function (s) { return state_1.getVariablePart(s); });
    var isFinalCount = states.filter(function (s) { return s.isFinal; }).length;
    return [fixedPart, largestTurnNum, variableParts, isFinalCount, signatures, whoSignedWhat];
}
exports.checkpointArgs = checkpointArgs;
function createConcludeTransaction(states, signatures, whoSignedWhat) {
    var data = exports.ForceMoveContractInterface.encodeFunctionData('conclude', concludeArgs(states, signatures, whoSignedWhat));
    return { data: data };
}
exports.createConcludeTransaction = createConcludeTransaction;
function concludeArgs(states, signatures, whoSignedWhat) {
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
    var outcomeHash = outcome_1.hashOutcome(lastState.outcome);
    var numStates = states.length;
    return [
        largestTurnNum,
        fixedPart,
        appPartHash,
        outcomeHash,
        numStates,
        whoSignedWhat,
        signatures,
    ];
}
exports.concludeArgs = concludeArgs;
//# sourceMappingURL=force-move.js.map