"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const state_1 = require("./state");
const actions_1 = require("./actions");
const stageGuard = (guardStage) => (s) => !!s && state_1.stage(s) === guardStage;
const isPrefundSetup = stageGuard('PrefundSetup');
const isFinal = stageGuard('Final');
const isFunded = ({ app: { funding, supported } }) => {
    var _a;
    if (!supported)
        return false;
    const allocation = wallet_core_1.checkThat((_a = supported) === null || _a === void 0 ? void 0 : _a.outcome, wallet_core_1.isSimpleAllocation);
    const currentFunding = funding(allocation.assetHolderAddress);
    const targetFunding = allocation.allocationItems.map(a => a.amount).reduce(wallet_core_1.BN.add, wallet_core_1.BN.from(0));
    const funded = wallet_core_1.BN.gte(currentFunding, targetFunding) ? true : false;
    return funded;
};
const signPostFundSetup = (ps) => isPrefundSetup(ps.app.supported) &&
    isPrefundSetup(ps.app.latestSignedByMe) &&
    isFunded(ps) &&
    actions_1.signState({ channelId: ps.app.channelId, ...ps.app.latestSignedByMe, turnNum: 3 });
const signFinalState = (ps) => isFinal(ps.app.supported) &&
    !isFinal(ps.app.latestSignedByMe) &&
    actions_1.signState({ channelId: ps.app.channelId, ...ps.app.supported });
exports.protocol = (ps) => signPostFundSetup(ps) || signFinalState(ps) || actions_1.noAction;
//# sourceMappingURL=application.js.map