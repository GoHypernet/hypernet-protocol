"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../../models/channel");
const channel_2 = require("../../models/__test__/fixtures/channel");
const states_1 = require("../../wallet/__test__/fixtures/states");
const seeds = [channel_2.channel(), channel_2.channel({ channelNonce: 1234, vars: [states_1.stateWithHashSignedBy()()] })];
async function seed(knex) {
    await knex('channels').truncate();
    await channel_1.Channel.query().insert(seeds);
}
exports.seed = seed;
//# sourceMappingURL=2_channel_seeds.js.map