"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../wallet/__test__/fixtures/utils");
const state_vars_1 = require("../../wallet/__test__/fixtures/state-vars");
exports.lastPostFundTurnNum = 3;
const channelId = '0x1234';
const defaultVars = {
    ...state_vars_1.stateVars(),
    channelId,
};
exports.updateChannelFixture = utils_1.fixture(defaultVars);
//# sourceMappingURL=update-channel.js.map