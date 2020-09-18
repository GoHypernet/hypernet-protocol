"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../../../models/channel");
const __1 = require("../..");
const create_channel_1 = require("../fixtures/create-channel");
const _1_signing_wallet_seeds_1 = require("../../../db/seeds/1_signing_wallet_seeds");
const db_admin_connection_1 = require("../../../db-admin/db-admin-connection");
const config_1 = require("../../../config");
let w;
beforeEach(async () => {
    w = new __1.Wallet(config_1.defaultConfig);
    await db_admin_connection_1.truncate(w.knex);
});
afterEach(async () => {
    await w.knex.destroy();
});
describe('happy path', () => {
    beforeEach(async () => _1_signing_wallet_seeds_1.seedAlicesSigningWallet(w.knex));
    it('creates a channel', async () => {
        expect(await channel_1.Channel.query(w.knex).resultSize()).toEqual(0);
        const appData = '0xaf00';
        const createPromise = w.createChannel(create_channel_1.createChannelArgs({ appData }));
        await expect(createPromise).resolves.toMatchObject({
            channelResult: { channelId: expect.any(String) },
        });
        await expect(createPromise).resolves.toMatchObject({
            outbox: [
                {
                    params: {
                        recipient: 'bob',
                        sender: 'alice',
                        data: { signedStates: [{ turnNum: 0, appData }] },
                    },
                },
            ],
            channelResult: { channelId: expect.any(String), turnNum: 0, appData },
        });
        const { channelId } = (await createPromise).channelResult;
        expect(await channel_1.Channel.query(w.knex).resultSize()).toEqual(1);
        const updated = await channel_1.Channel.forId(channelId, w.knex);
        const expectedState = {
            turnNum: 0,
            appData,
        };
        expect(updated).toMatchObject({
            latest: expectedState,
            latestSignedByMe: expectedState,
            supported: undefined,
        });
    });
    it('creates many channels', async () => {
        expect(await channel_1.Channel.query(w.knex).resultSize()).toEqual(0);
        const createArgs = create_channel_1.createChannelArgs({ appData: '0xaf00' });
        const NUM_CHANNELS = 10;
        const createPromises = Array(NUM_CHANNELS)
            .fill(createArgs)
            .map(w.createChannel);
        await expect(Promise.all(createPromises)).resolves.not.toThrow();
        expect(await channel_1.Channel.query(w.knex).resultSize()).toEqual(NUM_CHANNELS);
    }, 10000);
});
it("doesn't create a channel if it doesn't have a signing wallet", () => expect(w.createChannel(create_channel_1.createChannelArgs())).rejects.toThrow('null value in column "signing_address"'));
//# sourceMappingURL=create-channel.test.js.map