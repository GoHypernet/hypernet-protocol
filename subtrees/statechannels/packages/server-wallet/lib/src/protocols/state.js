"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
exports.stage = (state) => !state
    ? 'Missing'
    : state.isFinal
        ? 'Final'
        : state.turnNum === 0
            ? 'PrefundSetup'
            : state.turnNum === 3
                ? 'PostfundSetup'
                : 'Running';
exports.toChannelResult = (channelState) => {
    const { channelId, supported, latest, latestSignedByMe, support } = channelState;
    const { outcome, appData, turnNum, participants, appDefinition } = (supported !== null && supported !== void 0 ? supported : latest);
    const status = (() => {
        var _a;
        switch (exports.stage(supported)) {
            case 'Missing':
            case 'PrefundSetup':
                return latestSignedByMe ? 'opening' : 'proposed';
            case 'PostfundSetup':
            case 'Running':
                return 'running';
            case 'Final':
                return ((_a = support) === null || _a === void 0 ? void 0 : _a.find(s => !s.isFinal)) ? 'closing' : 'closed';
        }
    })();
    const allocations = wallet_core_1.serializeAllocation(wallet_core_1.checkThat(outcome, wallet_core_1.isAllocation));
    return { appData, appDefinition, channelId, participants, turnNum, allocations, status };
};
//# sourceMappingURL=state.js.map