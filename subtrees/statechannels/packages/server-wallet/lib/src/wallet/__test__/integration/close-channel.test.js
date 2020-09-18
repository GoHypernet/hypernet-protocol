"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../../../models/channel");
const __1 = require("../..");
const _1_signing_wallet_seeds_1 = require("../../../db/seeds/1_signing_wallet_seeds");
const db_admin_connection_1 = require("../../../db-admin/db-admin-connection");
const states_1 = require("../fixtures/states");
const signing_wallets_1 = require("../fixtures/signing-wallets");
const channel_2 = require("../../../models/__test__/fixtures/channel");
const config_1 = require("../../../config");
let w;
beforeEach(async () => {
    w = new __1.Wallet(config_1.defaultConfig);
    await db_admin_connection_1.truncate(w.knex);
});
afterEach(async () => {
    await w.knex.destroy();
});
beforeEach(async () => _1_signing_wallet_seeds_1.seedAlicesSigningWallet(w.knex));
afterAll(async () => {
    await w.destroy();
});
it("signs a final state when it's my turn", async () => {
    const appData = '0x0f00';
    const turnNum = 7;
    const runningState = { turnNum, appData };
    const closingState = { ...runningState, isFinal: true, turnNum: turnNum + 1 };
    const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.alice(), signing_wallets_1.bob())(runningState)] });
    await channel_1.Channel.query(w.knex).insert(c);
    const channelId = c.channelId;
    const current = await channel_1.Channel.forId(channelId, w.knex);
    expect(current.protocolState).toMatchObject({ latest: runningState, supported: runningState });
    await expect(w.closeChannel({ channelId })).resolves.toMatchObject({
        outbox: [{ params: { recipient: 'bob', sender: 'alice', data: { signedStates: [closingState] } } }],
        channelResult: { channelId, status: 'closing', turnNum: turnNum + 1, appData },
    });
    const updated = await channel_1.Channel.forId(channelId, w.knex);
    expect(updated.protocolState).toMatchObject({ latest: closingState, supported: closingState });
});
it("reject when it's not my turn", async () => {
    const appData = '0x0f00';
    const turnNum = 8;
    const runningState = { turnNum, appData };
    const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.alice(), signing_wallets_1.bob())(runningState)] });
    await channel_1.Channel.query(w.knex).insert(c);
    const channelId = c.channelId;
    await expect(w.closeChannel({ channelId })).rejects.toMatchObject(new Error('not my turn'));
    const updated = await channel_1.Channel.forId(channelId, w.knex);
    expect(updated.protocolState).toMatchObject({ latest: runningState, supported: runningState });
});
//# sourceMappingURL=close-channel.test.js.map