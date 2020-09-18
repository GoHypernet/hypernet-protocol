"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../wallet/__test__/fixtures/utils");
const channel_1 = require("../../../models/__test__/fixtures/channel");
const state_vars_1 = require("../../../wallet/__test__/fixtures/state-vars");
exports.applicationProtocolState = utils_1.fixture({ app: channel_1.channel().protocolState });
exports.withSupportedState = (vars) => utils_1.fixture(exports.applicationProtocolState({
    app: channel_1.withSupportedState()({ vars: [state_vars_1.stateVars(vars)] }).protocolState,
}));
//# sourceMappingURL=application-protocol-state.js.map