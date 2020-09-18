"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const lodash_1 = __importDefault(require("lodash"));
const function_1 = require("fp-ts/lib/function");
const state_utils_1 = require("../../../state-utils");
const utils_1 = require("./utils");
const participants_1 = require("./participants");
const signing_wallets_1 = require("./signing-wallets");
const defaultState = {
    appData: '0x',
    appDefinition: '0x0000000000000000000000000000000000000000',
    isFinal: false,
    turnNum: 0,
    outcome: wallet_core_1.simpleEthAllocation([
        { destination: participants_1.alice().destination, amount: wallet_core_1.BN.from(1) },
        { destination: participants_1.bob().destination, amount: wallet_core_1.BN.from(3) },
    ]),
    participants: [participants_1.alice(), participants_1.bob()],
    channelNonce: 1,
    chainId: '0x01',
    challengeDuration: 9001,
};
const signatureCache = {};
const _signState = (s, sw) => {
    const key = `${sw.privateKey}-${wallet_core_1.hashState(s)}`;
    return (signatureCache[key] = signatureCache[key] || sw.syncSignState(s));
};
exports.createState = utils_1.fixture(defaultState, utils_1.overwriteOutcome);
const addSignatures = (wallets) => (s) => ({
    ...s,
    signatures: wallets.map(sw => _signState(s, sw)),
});
exports.stateSignedBy = (signingWallets = [signing_wallets_1.alice()]) => utils_1.fixture(lodash_1.default.merge({ signatures: [] }, defaultState), function_1.flow(utils_1.overwriteOutcome, addSignatures(signingWallets)));
exports.stateWithHashSignedBy = (pk = signing_wallets_1.alice(), ...otherWallets) => utils_1.fixture(exports.createState(), function_1.flow(utils_1.overwriteOutcome, addSignatures([pk, ...otherWallets]), state_utils_1.addHash));
exports.stateWithHashSignedBy2 = (signingWallets = [signing_wallets_1.alice()]) => utils_1.fixture(exports.createState(), function_1.flow(utils_1.overwriteOutcome, addSignatures(signingWallets), state_utils_1.addHash));
//# sourceMappingURL=states.js.map