"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../wallet/__test__/fixtures/utils");
const actions_1 = require("../../actions");
const state_vars_1 = require("../../../wallet/__test__/fixtures/state-vars");
const update_channel_1 = require("../../../handlers/fixtures/update-channel");
exports.signStateFixture = utils_1.fixture(actions_1.signState({ channelId: '0x1234', ...state_vars_1.stateVars({ turnNum: update_channel_1.lastPostFundTurnNum + 1 }) }));
//# sourceMappingURL=actions.js.map