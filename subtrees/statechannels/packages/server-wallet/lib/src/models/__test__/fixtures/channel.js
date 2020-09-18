"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const lodash_1 = __importDefault(require("lodash"));
const function_1 = require("fp-ts/lib/function");
const channel_1 = require("../../../models/channel");
const utils_1 = require("../../../wallet/__test__/fixtures/utils");
const state_utils_1 = require("../../../state-utils");
const signing_wallets_1 = require("../../../wallet/__test__/fixtures/signing-wallets");
const states_1 = require("../../../wallet/__test__/fixtures/states");
exports.channel = (props) => {
    const { appDefinition, chainId, challengeDuration, channelNonce, participants } = states_1.createState();
    const defaults = {
        appDefinition,
        channelNonce,
        chainId,
        challengeDuration,
        participants,
        signingAddress: signing_wallets_1.alice().address,
        vars: [],
    };
    const columns = lodash_1.default.merge(defaults, props);
    columns.vars.map(s => (s = state_utils_1.dropNonVariables(state_utils_1.addHash({ ...columns, ...s }))));
    columns.channelId = wallet_core_1.calculateChannelId(columns);
    const channel = channel_1.Channel.fromJson(columns);
    return channel;
};
exports.channelWithVars = utils_1.fixture(exports.channel({ vars: [state_utils_1.addHash(states_1.stateSignedBy()())] }));
const signVars = (signingWallets) => (channel) => {
    const { channelConstants, vars } = channel;
    vars.map(state => (state.signatures = signingWallets.map(sw => sw.syncSignState({ ...channelConstants, ...state }))));
    return channel;
};
function overwriteVars(result, props) {
    var _a;
    if ((_a = props) === null || _a === void 0 ? void 0 : _a.vars)
        result.vars = props.vars;
    return result;
}
exports.withSupportedState = (signingWallets = [signing_wallets_1.alice(), signing_wallets_1.bob()]) => utils_1.fixture(exports.channel(), function_1.flow(overwriteVars, state_utils_1.addHashes, signVars(signingWallets), state_utils_1.addChannelId));
//# sourceMappingURL=channel.js.map