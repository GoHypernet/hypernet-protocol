"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var forceMoveTrans = __importStar(require("./contract/transaction-creators/force-move"));
var nitroAdjudicatorTrans = __importStar(require("./contract/transaction-creators/nitro-adjudicator"));
var signatures_1 = require("./signatures");
function getChannelStorage(provider, contractAddress, channelId) {
    return __awaiter(this, void 0, void 0, function () {
        var forceMove;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    forceMove = new ethers_1.Contract(contractAddress, forceMoveTrans.ForceMoveContractInterface, provider);
                    return [4, forceMove.getChannelStorage(channelId)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.getChannelStorage = getChannelStorage;
function createForceMoveTransaction(signedStates, challengePrivateKey) {
    var _a = createSignatureArguments(signedStates), states = _a.states, signatures = _a.signatures, whoSignedWhat = _a.whoSignedWhat;
    return forceMoveTrans.createForceMoveTransaction(states, signatures, whoSignedWhat, challengePrivateKey);
}
exports.createForceMoveTransaction = createForceMoveTransaction;
function createRespondTransaction(challengeState, response) {
    if (!challengeState) {
        throw new Error('No active challenge in challenge state');
    }
    return forceMoveTrans.createRespondTransaction({
        challengeState: challengeState,
        responseState: response.state,
        responseSignature: response.signature,
    });
}
exports.createRespondTransaction = createRespondTransaction;
function createCheckpointTransaction(signedStates) {
    var _a = createSignatureArguments(signedStates), states = _a.states, signatures = _a.signatures, whoSignedWhat = _a.whoSignedWhat;
    return forceMoveTrans.createCheckpointTransaction({
        states: states,
        signatures: signatures,
        whoSignedWhat: whoSignedWhat,
    });
}
exports.createCheckpointTransaction = createCheckpointTransaction;
function createConcludePushOutcomeAndTransferAllTransaction(signedStates) {
    var _a = createSignatureArguments(signedStates), states = _a.states, signatures = _a.signatures, whoSignedWhat = _a.whoSignedWhat;
    return nitroAdjudicatorTrans.createConcludePushOutcomeAndTransferAllTransaction(states, signatures, whoSignedWhat);
}
exports.createConcludePushOutcomeAndTransferAllTransaction = createConcludePushOutcomeAndTransferAllTransaction;
function createConcludeTransaction(conclusionProof) {
    var _a = createSignatureArguments(conclusionProof), states = _a.states, signatures = _a.signatures, whoSignedWhat = _a.whoSignedWhat;
    return forceMoveTrans.createConcludeTransaction(states, signatures, whoSignedWhat);
}
exports.createConcludeTransaction = createConcludeTransaction;
function createSignatureArguments(signedStates) {
    var participants = signedStates[0].state.channel.participants;
    var states = [];
    var whoSignedWhat = new Array(participants.length);
    var uniqueSignedStates = signedStates.filter(function (s, i, a) { return a.indexOf(s) === i; });
    var uniqueStates = uniqueSignedStates.map(function (s) { return s.state; }).filter(function (s, i, a) { return a.indexOf(s) === i; });
    var signatures = new Array(uniqueStates.length);
    var _loop_1 = function (i) {
        states.push(uniqueStates[i]);
        var signedStatesForUniqueState = uniqueSignedStates.filter(function (s) { return s.state === uniqueStates[i]; });
        for (var _i = 0, signedStatesForUniqueState_1 = signedStatesForUniqueState; _i < signedStatesForUniqueState_1.length; _i++) {
            var ss = signedStatesForUniqueState_1[_i];
            var participantIndex = participants.indexOf(signatures_1.getStateSignerAddress(ss));
            signatures[participantIndex] = ss.signature;
            whoSignedWhat[participantIndex] = i;
        }
    };
    for (var i = 0; i < uniqueStates.length; i++) {
        _loop_1(i);
    }
    return {
        states: states,
        signatures: signatures,
        whoSignedWhat: whoSignedWhat,
    };
}
exports.createSignatureArguments = createSignatureArguments;
//# sourceMappingURL=transactions.js.map