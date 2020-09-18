"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var Interface = ethers_1.utils.Interface, keccak256 = ethers_1.utils.keccak256, defaultAbiCoder = ethers_1.utils.defaultAbiCoder;
var NitroAdjudicator_json_1 = __importDefault(require("../../build/contracts/NitroAdjudicator.json"));
var outcome_1 = require("./outcome");
var state_1 = require("./state");
function hashChallengeMessage(challengeState) {
    return keccak256(defaultAbiCoder.encode(['bytes32', 'string'], [state_1.hashState(challengeState), 'forceMove']));
}
exports.hashChallengeMessage = hashChallengeMessage;
function getChallengeRegisteredEvent(eventResult) {
    var _a = eventResult.slice(-1)[0].args, turnNumRecord = _a.turnNumRecord, finalizesAt = _a.finalizesAt, challenger = _a.challenger, isFinal = _a.isFinal, fixedPart = _a.fixedPart, variablePartsUnstructured = _a.variableParts, sigs = _a.sigs, whoSignedWhat = _a.whoSignedWhat;
    var chainId = ethers_1.BigNumber.from(fixedPart[0]).toHexString();
    var participants = fixedPart[1].map(function (p) { return ethers_1.BigNumber.from(p).toHexString(); });
    var channelNonce = fixedPart[2];
    var appDefinition = fixedPart[3];
    var challengeDuration = ethers_1.BigNumber.from(fixedPart[4]).toNumber();
    var variableParts = variablePartsUnstructured.map(function (v) {
        var outcome = v[0];
        var appData = v[1];
        return { outcome: outcome, appData: appData };
    });
    var channel = { chainId: chainId, channelNonce: channelNonce, participants: participants };
    var challengeStates = variableParts.map(function (v, i) {
        var turnNum = turnNumRecord - (variableParts.length - i - 1);
        var signature = sigs[i];
        var state = {
            turnNum: turnNum,
            channel: channel,
            outcome: outcome_1.decodeOutcome(v.outcome),
            appData: v.appData,
            challengeDuration: challengeDuration,
            appDefinition: appDefinition,
            isFinal: isFinal,
        };
        return { state: state, signature: signature };
    });
    return { challengeStates: challengeStates, finalizesAt: finalizesAt, challengerAddress: challenger };
}
exports.getChallengeRegisteredEvent = getChallengeRegisteredEvent;
function getChallengeClearedEvent(tx, eventResult) {
    var newTurnNumRecord = eventResult.slice(-1)[0].args.newTurnNumRecord;
    var decodedTransaction = new Interface(NitroAdjudicator_json_1.default.abi).parseTransaction(tx);
    if (decodedTransaction.name === 'respond') {
        var args = decodedTransaction.args;
        var _a = args[2], chainId = _a[0], participants = _a[1], channelNonce = _a[2], appDefinition = _a[3], challengeDuration = _a[4];
        var isFinal = args[1][1];
        var outcome = outcome_1.decodeOutcome(args[3][1][0]);
        var appData = args[3][1][1];
        var signature = {
            v: args[4][0],
            r: args[4][1],
            s: args[4][2],
            _vs: args[4][3],
            recoveryParam: args[4][4],
        };
        var signedState = {
            signature: signature,
            state: {
                challengeDuration: challengeDuration,
                appDefinition: appDefinition,
                isFinal: isFinal,
                outcome: outcome,
                appData: appData,
                channel: { chainId: ethers_1.BigNumber.from(chainId).toHexString(), channelNonce: channelNonce, participants: participants },
                turnNum: ethers_1.BigNumber.from(newTurnNumRecord).toNumber(),
            },
        };
        return {
            kind: 'respond',
            newStates: [signedState],
        };
    }
    else if (decodedTransaction.name === 'checkpoint') {
        throw new Error('UnimplementedError');
    }
    else {
        throw new Error('Unexpected call to getChallengeClearedEvent with invalid or unrelated transaction data');
    }
}
exports.getChallengeClearedEvent = getChallengeClearedEvent;
//# sourceMappingURL=challenge.js.map