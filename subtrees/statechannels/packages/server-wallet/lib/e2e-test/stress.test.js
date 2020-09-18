"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../src/models/channel");
const signing_wallet_1 = require("../src/models/signing-wallet");
const signing_wallets_1 = require("../src/wallet/__test__/fixtures/signing-wallets");
const db_admin_connection_1 = require("../src/db-admin/db-admin-connection");
const e2e_utils_1 = require("./e2e-utils");
const expectSupportedState = async (knex, channelId, C, turnNum) => expect(C.forId(channelId, knex).then(c => c.protocolState)).resolves.toMatchObject({
    latest: { turnNum },
});
let ChannelPayer;
let ChannelReceiver;
let SWPayer;
let SWReceiver;
jest.setTimeout(300000);
describe('Stress tests', () => {
    let receiverServer;
    beforeAll(async () => {
        receiverServer = await e2e_utils_1.startReceiverServer();
        await e2e_utils_1.waitForServerToStart(receiverServer);
        [ChannelPayer, ChannelReceiver] = [e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(knex => channel_1.Channel.bindKnex(knex));
        [SWPayer, SWReceiver] = [e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(knex => signing_wallet_1.SigningWallet.bindKnex(knex));
    });
    beforeEach(async () => {
        await Promise.all([e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(db => db_admin_connection_1.truncate(db)));
        await SWPayer.query(e2e_utils_1.knexPayer).insert(signing_wallets_1.alice());
        await SWReceiver.query(e2e_utils_1.knexReceiver).insert(signing_wallets_1.bob());
    });
    it('runs the stress test with 100 channels and 1 payment call', async () => {
        const channelIds = await e2e_utils_1.seedTestChannels(e2e_utils_1.getParticipant('payer', signing_wallets_1.alice().privateKey), signing_wallets_1.alice().privateKey, e2e_utils_1.getParticipant('receiver', signing_wallets_1.bob().privateKey), signing_wallets_1.bob().privateKey, 100, e2e_utils_1.knexPayer);
        await e2e_utils_1.triggerPayments(channelIds);
        for (const channelId of channelIds) {
            await await expectSupportedState(e2e_utils_1.knexPayer, channelId, ChannelPayer, 5);
            await expectSupportedState(e2e_utils_1.knexReceiver, channelId, ChannelReceiver, 5);
        }
    });
    it('runs the stress test with 100 channels and 25 payment call', async () => {
        const channelIds = await e2e_utils_1.seedTestChannels(e2e_utils_1.getParticipant('payer', signing_wallets_1.alice().privateKey), signing_wallets_1.alice().privateKey, e2e_utils_1.getParticipant('receiver', signing_wallets_1.bob().privateKey), signing_wallets_1.bob().privateKey, 100, e2e_utils_1.knexPayer);
        const numPayments = 25;
        await e2e_utils_1.triggerPayments(channelIds, numPayments);
        for (const channelId of channelIds) {
            await await expectSupportedState(e2e_utils_1.knexPayer, channelId, ChannelPayer, 3 + 2 * numPayments);
            await expectSupportedState(e2e_utils_1.knexReceiver, channelId, ChannelReceiver, 3 + 2 * numPayments);
        }
    });
    afterAll(async () => {
        await e2e_utils_1.killServer(receiverServer);
        await e2e_utils_1.knexReceiver.destroy();
        await e2e_utils_1.knexPayer.destroy();
    });
});
//# sourceMappingURL=stress.test.js.map