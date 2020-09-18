"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const lodash_1 = __importDefault(require("lodash"));
const metrics_1 = require("./metrics");
exports.dropNonVariables = (s) => lodash_1.default.pick(s, 'appData', 'outcome', 'isFinal', 'turnNum', 'stateHash', 'signatures');
exports.dropNonConstants = (s) => lodash_1.default.pick(s, 'channelNonce', 'chainId', 'participants', 'appDefinition', 'challengeDuration');
exports.addHash = (s) => ({
    ...s,
    stateHash: metrics_1.recordFunctionMetrics(wallet_core_1.hashState(s)),
});
exports.addHashes = (c) => lodash_1.default.assign(c, { vars: c.vars.map(v => exports.addHash({ ...c.channelConstants, ...v })) });
exports.addChannelId = (c) => {
    c.channelId = wallet_core_1.calculateChannelId(c);
    return c;
};
//# sourceMappingURL=state-utils.js.map