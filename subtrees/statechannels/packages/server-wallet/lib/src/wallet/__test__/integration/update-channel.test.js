"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../../../models/channel");
const __1 = require("../..");
const update_channel_1 = require("../fixtures/update-channel");
const _1_signing_wallet_seeds_1 = require("../../../db/seeds/1_signing_wallet_seeds");
const db_admin_connection_1 = require("../../../db-admin/db-admin-connection");
const states_1 = require("../fixtures/states");
const signing_wallets_1 = require("../fixtures/signing-wallets");
const channel_2 = require("../../../models/__test__/fixtures/channel");
const config_1 = require("../../../config");
const knex_setup_teardown_1 = require("../../../../jest/knex-setup-teardown");
let w;
beforeEach(async () => {
    await db_admin_connection_1.truncate(knex_setup_teardown_1.testKnex);
    w = new __1.Wallet(config_1.defaultConfig);
});
afterEach(async () => {
    await w.knex.destroy();
});
beforeEach(async () => await _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex));
it('updates a channel', async () => {
    const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.alice(), signing_wallets_1.bob())({ turnNum: 5 })] });
    await channel_1.Channel.query(w.knex).insert(c);
    const channelId = c.channelId;
    const current = await channel_1.Channel.forId(channelId, knex_setup_teardown_1.testKnex);
    expect(current.latest).toMatchObject({ turnNum: 5, appData: '0x' });
    const appData = '0xa00f00';
    await expect(w.updateChannel(update_channel_1.updateChannelArgs({ appData }))).resolves.toMatchObject({
        outbox: [
            {
                params: {
                    recipient: 'bob',
                    sender: 'alice',
                    data: { signedStates: [{ turnNum: 6, appData }] },
                },
            },
        ],
        channelResult: { channelId, turnNum: 6, appData },
    });
    const updated = await channel_1.Channel.forId(channelId, knex_setup_teardown_1.testKnex);
    expect(updated.latest).toMatchObject({ turnNum: 6, appData });
});
describe('error cases', () => {
    it('throws when it is not my turn', async () => {
        const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.alice(), signing_wallets_1.bob())({ turnNum: 4 })] });
        await channel_1.Channel.query(w.knex).insert(c);
        await expect(w.updateChannel(update_channel_1.updateChannelArgs())).rejects.toMatchObject(Error('it is not my turn'));
    });
    it("throws when the channel isn't found", async () => {
        await expect(w.updateChannel(update_channel_1.updateChannelArgs())).rejects.toMatchObject(Error('channel not found'));
    });
});
//# sourceMappingURL=update-channel.test.js.map