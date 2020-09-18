"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const channel_1 = require("../../../models/channel");
const __1 = require("../..");
const _1_signing_wallet_seeds_1 = require("../../../db/seeds/1_signing_wallet_seeds");
const db_admin_connection_1 = require("../../../db-admin/db-admin-connection");
const states_1 = require("../fixtures/states");
const signing_wallets_1 = require("../fixtures/signing-wallets");
const channel_2 = require("../../../models/__test__/fixtures/channel");
const participants_1 = require("../fixtures/participants");
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
describe('directly funded app', () => {
    it('signs the prefund setup ', async () => {
        const appData = '0x0f00';
        const preFS = { turnNum: 0, appData };
        const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.bob())(preFS)] });
        await channel_1.Channel.query(w.knex).insert(c);
        const channelId = c.channelId;
        const current = await channel_1.Channel.forId(channelId, w.knex);
        expect(current.protocolState).toMatchObject({ latest: preFS, supported: undefined });
        await expect(w.joinChannel({ channelId })).resolves.toMatchObject({
            outbox: [{ params: { recipient: 'bob', sender: 'alice', data: { signedStates: [preFS] } } }],
        });
        const updated = await channel_1.Channel.forId(channelId, w.knex);
        expect(updated.protocolState).toMatchObject({ latest: preFS, supported: preFS });
    });
    it('signs the prefund setup and postfund setup, when there are no deposits to make', async () => {
        const outcome = wallet_core_1.simpleEthAllocation([]);
        const preFS = { turnNum: 0, outcome };
        const postFS = { turnNum: 3, outcome };
        const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.bob())(preFS)] });
        await channel_1.Channel.query(w.knex).insert(c);
        const channelId = c.channelId;
        const current = await channel_1.Channel.forId(channelId, w.knex);
        expect(current.latest).toMatchObject(preFS);
        await expect(w.joinChannel({ channelId })).resolves.toMatchObject({
            outbox: [
                { params: { recipient: 'bob', sender: 'alice', data: { signedStates: [preFS] } } },
                { params: { recipient: 'bob', sender: 'alice', data: { signedStates: [postFS] } } },
            ],
        });
        const updated = await channel_1.Channel.forId(channelId, w.knex);
        expect(updated.protocolState).toMatchObject({ latest: postFS, supported: preFS });
    });
    it.skip('signs the prefund setup and makes a deposit, when I am first to deposit in a directly funded app', async () => {
        const outcome = wallet_core_1.simpleEthAllocation([{ destination: participants_1.alice().destination, amount: wallet_core_1.BN.from(5) }]);
        const preFS = { turnNum: 0, outcome };
        const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.bob())(preFS)] });
        await channel_1.Channel.query(w.knex).insert(c);
        const channelId = c.channelId;
        const current = await channel_1.Channel.forId(channelId, w.knex);
        expect(current.latest).toMatchObject(preFS);
        const data = { signedStates: [preFS] };
        await expect(w.joinChannel({ channelId })).resolves.toMatchObject({
            outbox: [
                { method: 'MessageQueued', params: { recipient: 'bob', sender: 'alice', data } },
                { method: 'SubmitTX', params: { transaction: expect.any(Object) } },
            ],
        });
        const updated = await channel_1.Channel.forId(channelId, w.knex);
        expect(updated.protocolState).toMatchObject({ latest: preFS, supported: preFS });
    });
});
describe('virtually funded app', () => {
    it.skip('signs the prefund setup and messages the hub', async () => {
        const outcome = wallet_core_1.simpleEthAllocation([{ destination: participants_1.alice().destination, amount: wallet_core_1.BN.from(5) }]);
        const preFS = { turnNum: 0, outcome };
        const c = channel_2.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.bob())(preFS)] });
        await channel_1.Channel.query(w.knex).insert(c);
        const channelId = c.channelId;
        const current = await channel_1.Channel.forId(channelId, w.knex);
        expect(current.latest).toMatchObject(preFS);
        const data = { signedStates: [preFS] };
        await expect(w.joinChannel({ channelId })).resolves.toMatchObject({
            outbox: [
                { method: 'MessageQueued', params: { recipient: 'bob', sender: 'alice', data } },
                { method: 'MessageQueued', params: { recipient: 'hub', sender: 'alice' } },
            ],
        });
        const updated = await channel_1.Channel.forId(channelId, w.knex);
        expect(updated.protocolState).toMatchObject({ latest: preFS, supported: preFS });
    });
});
//# sourceMappingURL=join-channel.test.js.map