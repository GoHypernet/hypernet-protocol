"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const config_1 = require("@statechannels/wallet-core/lib/src/config");
const channel_1 = require("../../../models/__test__/fixtures/channel");
const states_1 = require("../fixtures/states");
const channel_2 = require("../../../models/channel");
const db_admin_connection_1 = require("../../../db-admin/db-admin-connection");
const __1 = require("../..");
const _1_signing_wallet_seeds_1 = require("../../../db/seeds/1_signing_wallet_seeds");
const signing_wallets_1 = require("../fixtures/signing-wallets");
const funding_1 = require("../../../models/funding");
const config_2 = require("../../../config");
let w;
beforeEach(async () => {
    w = new __1.Wallet(config_2.defaultConfig);
    await db_admin_connection_1.truncate(w.knex);
});
afterEach(async () => {
    await w.knex.destroy();
});
beforeEach(async () => await _1_signing_wallet_seeds_1.seedAlicesSigningWallet(w.knex));
it('sends the post fund setup when the funding event is provided', async () => {
    const c = channel_1.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.alice(), signing_wallets_1.bob())({ turnNum: 0 })] });
    await channel_2.Channel.query(w.knex).insert(c);
    const { channelId } = c;
    const result = await w.updateChannelFunding({
        channelId: c.channelId,
        token: '0x00',
        amount: wallet_core_1.BN.from(4),
    });
    await expect(funding_1.Funding.getFundingAmount(w.knex, channelId, config_1.ETH_ASSET_HOLDER_ADDRESS)).resolves.toEqual('0x04');
    expect(result).toMatchObject({
        outbox: [
            {
                params: {
                    recipient: 'bob',
                    sender: 'alice',
                    data: { signedStates: [{ turnNum: 3 }] },
                },
            },
        ],
        channelResult: { channelId: c.channelId, turnNum: 0 },
    });
});
//# sourceMappingURL=update-funding.test.js.map