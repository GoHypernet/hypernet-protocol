"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../channel");
const _1_signing_wallet_seeds_1 = require("../../db/seeds/1_signing_wallet_seeds");
const states_1 = require("../../wallet/__test__/fixtures/states");
const knex_setup_teardown_1 = require("../../../jest/knex-setup-teardown");
const channel_2 = require("./fixtures/channel");
beforeEach(async () => _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex));
afterAll(async () => await knex_setup_teardown_1.testKnex.destroy());
it('can insert Channel instances to, and fetch them from, the database', async () => {
    const vars = [states_1.stateWithHashSignedBy()()];
    const c1 = channel_2.channel({ channelNonce: 1234, vars });
    await channel_1.Channel.query(knex_setup_teardown_1.testKnex)
        .withGraphFetched('signingWallet')
        .insert(c1);
    expect(c1.signingWallet).toBeDefined();
    const c2 = await channel_1.Channel.query(knex_setup_teardown_1.testKnex)
        .where({ channel_nonce: 1234 })
        .first();
    expect(c1.vars).toMatchObject(c2.vars);
});
it('can insert multiple channels instances within a transaction', async () => {
    const vars = [states_1.stateWithHashSignedBy()()];
    const c1 = channel_2.channel({ vars });
    const c2 = channel_2.channel({ channelNonce: 1234, vars });
    await channel_1.Channel.transaction(knex_setup_teardown_1.testKnex, async (tx) => {
        await channel_1.Channel.query(tx).insert(c1);
        expect(await channel_1.Channel.query(tx).select()).toHaveLength(1);
        await channel_1.Channel.query(tx).insert(c2);
        expect(await channel_1.Channel.query(tx).select()).toHaveLength(2);
        expect(await channel_1.Channel.query(knex_setup_teardown_1.testKnex).select()).toHaveLength(0);
    });
    expect(await channel_1.Channel.query(knex_setup_teardown_1.testKnex).select()).toHaveLength(2);
});
describe('validation', () => {
    it('throws when inserting a model where the channelId is inconsistent', () => expect(channel_1.Channel.query(knex_setup_teardown_1.testKnex).insert({
        ...channel_2.channel({ vars: [states_1.stateWithHashSignedBy()()] }),
        channelId: 'wrongId',
    })).rejects.toThrow(channel_1.ChannelError.reasons.invalidChannelId));
});
//# sourceMappingURL=channel.test.js.map