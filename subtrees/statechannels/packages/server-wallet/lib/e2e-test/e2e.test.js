"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signing_wallets_1 = require("../src/wallet/__test__/fixtures/signing-wallets");
const participants_1 = require("../src/wallet/__test__/fixtures/participants");
const channel_1 = require("../src/models/channel");
const channel_2 = require("../src/models/__test__/fixtures/channel");
const signing_wallet_1 = require("../src/models/signing-wallet");
const db_admin_connection_1 = require("../src/db-admin/db-admin-connection");
const state_vars_1 = require("../src/wallet/__test__/fixtures/state-vars");
const client_1 = __importDefault(require("./payer/client"));
const e2e_utils_1 = require("./e2e-utils");
jest.setTimeout(20000);
let ChannelPayer;
let ChannelReceiver;
let SWPayer;
let SWReceiver;
let receiverServer;
beforeAll(async () => {
    receiverServer = e2e_utils_1.startReceiverServer();
    await e2e_utils_1.waitForServerToStart(receiverServer);
    [ChannelPayer, ChannelReceiver] = [e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(knex => channel_1.Channel.bindKnex(knex));
    [SWPayer, SWReceiver] = [e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(knex => signing_wallet_1.SigningWallet.bindKnex(knex));
});
beforeEach(async () => {
    await Promise.all([e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(db => db_admin_connection_1.truncate(db)));
    await SWPayer.query().insert(signing_wallets_1.alice());
    await SWReceiver.query().insert(signing_wallets_1.bob());
});
afterAll(async () => {
    await e2e_utils_1.killServer(receiverServer);
    await e2e_utils_1.knexPayer.destroy();
    await e2e_utils_1.knexReceiver.destroy();
});
describe('e2e', () => {
    let payerClient;
    let payer;
    let receiver;
    beforeAll(async () => {
        payerClient = new client_1.default(signing_wallets_1.alice().privateKey, `http://127.0.0.1:65535`);
        payer = payerClient.me;
        receiver = await payerClient.getReceiversParticipantInfo();
    });
    afterAll(async () => {
        await payerClient.destroy();
    });
    it('can do a simple end-to-end flow with no signed states', async () => {
        var _a, _b;
        const { signedStates, objectives } = await payerClient.emptyMessage();
        expect((_a = signedStates) === null || _a === void 0 ? void 0 : _a.length).toBe(0);
        expect((_b = objectives) === null || _b === void 0 ? void 0 : _b.length).toBe(0);
    });
    it('can create a channel, send signed state via http', async () => {
        const channel = await payerClient.createPayerChannel(receiver);
        expect(channel.participants).toStrictEqual([payer, receiver]);
        expect(channel.status).toBe('opening');
        expect(channel.turnNum).toBe(0);
        expect((await ChannelPayer.forId(channel.channelId, ChannelPayer.knex())).protocolState).toMatchObject({
            supported: { turnNum: 0 },
        });
    });
});
describe('payments', () => {
    let channelId;
    beforeEach(async () => {
        const [payer, receiver] = [participants_1.alice(), participants_1.bob()];
        const seed = channel_2.withSupportedState()({
            channelNonce: 123456789,
            participants: [payer, receiver],
            vars: [state_vars_1.stateVars({ turnNum: 3 })],
        });
        await ChannelPayer.query().insert([seed]);
        await ChannelReceiver.query().insert([{ ...seed, signingAddress: receiver.signingAddress }]);
        channelId = seed.channelId;
    });
    const expectSupportedState = async (C, turnNum) => expect(C.forId(channelId, C.knex()).then(c => c.protocolState)).resolves.toMatchObject({
        latest: { turnNum },
    });
    it('can update pre-existing channel, send signed state via http', async () => {
        await expectSupportedState(ChannelPayer, 3);
        await expectSupportedState(ChannelReceiver, 3);
        await e2e_utils_1.triggerPayments([channelId]);
        await expectSupportedState(ChannelPayer, 5);
        await expectSupportedState(ChannelReceiver, 5);
    });
    it('can update pre-existing channels multiple times', async () => {
        await expectSupportedState(ChannelPayer, 3);
        await expectSupportedState(ChannelReceiver, 3);
        const numPayments = 5;
        await e2e_utils_1.triggerPayments([channelId], numPayments);
        await expectSupportedState(ChannelPayer, 3 + 2 * numPayments);
        await expectSupportedState(ChannelReceiver, 3 + 2 * numPayments);
    });
});
//# sourceMappingURL=e2e.test.js.map