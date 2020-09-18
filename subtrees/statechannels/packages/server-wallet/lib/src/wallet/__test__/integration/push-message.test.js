"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const channel_1 = require("../../../models/channel");
const __1 = require("../..");
const state_utils_1 = require("../../../state-utils");
const signing_wallets_1 = require("../fixtures/signing-wallets");
const participants_1 = require("../fixtures/participants");
const messages_1 = require("../fixtures/messages");
const _1_signing_wallet_seeds_1 = require("../../../db/seeds/1_signing_wallet_seeds");
const states_1 = require("../fixtures/states");
const db_admin_connection_1 = require("../../../db-admin/db-admin-connection");
const channel_2 = require("../../../models/__test__/fixtures/channel");
const state_vars_1 = require("../fixtures/state-vars");
const config_1 = require("../../../config");
const wallet = new __1.Wallet(config_1.defaultConfig);
afterAll(async () => {
    await wallet.knex.destroy();
});
beforeEach(async () => _1_signing_wallet_seeds_1.seedAlicesSigningWallet(wallet.knex));
it("doesn't throw on an empty message", () => {
    return expect(wallet.pushMessage(messages_1.message())).resolves.not.toThrow();
});
const zero = 0;
const four = 4;
const five = 5;
const six = 6;
it('stores states contained in the message, in a single channel model', async () => {
    const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
    expect(channelsBefore).toHaveLength(0);
    const signedStates = [
        states_1.stateSignedBy([signing_wallets_1.alice()])({ turnNum: five }),
        states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])({ turnNum: four }),
    ];
    await wallet.pushMessage(messages_1.message({ signedStates }));
    const channelsAfter = await channel_1.Channel.query(wallet.knex).select();
    expect(channelsAfter).toHaveLength(1);
    expect(channelsAfter[0].vars).toHaveLength(2);
    expect(signedStates.map(state_utils_1.addHash)).toMatchObject(channelsAfter[0].vars);
});
const expectResults = async (p, channelResults) => {
    await expect(p.then(data => data.channelResults)).resolves.toHaveLength(channelResults.length);
    await expect(p).resolves.toMatchObject({ channelResults });
};
describe('channel results', () => {
    it("returns a 'proposed' channel result when receiving the first state from a peer", async () => {
        const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsBefore).toHaveLength(0);
        const signedStates = [states_1.stateSignedBy([signing_wallets_1.bob()])({ turnNum: zero })];
        await expectResults(wallet.pushMessage(messages_1.message({ signedStates })), [
            { turnNum: zero, status: 'proposed' },
        ]);
    });
    it("returns a 'running' channel result when receiving a state in a channel that is now running", async () => {
        const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsBefore).toHaveLength(0);
        const { channelId } = await channel_1.Channel.query(wallet.knex).insert(channel_2.withSupportedState()({ vars: [state_vars_1.stateVars({ turnNum: 8 })] }));
        return expectResults(wallet.pushMessage(messages_1.message({ signedStates: [states_1.stateSignedBy([signing_wallets_1.bob()])({ turnNum: 9 })] })), [{ channelId, turnNum: 9, status: 'running' }]);
    });
    it("returns a 'closing' channel result when receiving a state in a channel that is now closing", async () => {
        const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsBefore).toHaveLength(0);
        const participants = [participants_1.alice(), participants_1.bob(), participants_1.charlie()];
        const vars = [state_vars_1.stateVars({ turnNum: 9 })];
        const channel = channel_2.withSupportedState([signing_wallets_1.alice(), signing_wallets_1.bob(), signing_wallets_1.charlie()])({ vars, participants });
        const { channelId } = await channel_1.Channel.query(wallet.knex).insert(channel);
        const signedStates = [states_1.stateSignedBy([signing_wallets_1.bob()])({ turnNum: 10, isFinal: true, participants })];
        return expectResults(wallet.pushMessage(messages_1.message({ signedStates })), [
            { channelId, turnNum: 10, status: 'closing' },
        ]);
    });
    it("returns a 'closed' channel result when receiving a state in a channel that is now closed", async () => {
        const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsBefore).toHaveLength(0);
        const signedStates = [states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])({ turnNum: 9, isFinal: true })];
        return expectResults(wallet.pushMessage(messages_1.message({ signedStates })), [
            { turnNum: 9, status: 'closed' },
        ]);
    });
    it('stores states for multiple channels', async () => {
        const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsBefore).toHaveLength(0);
        const signedStates = [
            states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])({ turnNum: five }),
            states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])({ turnNum: six, channelNonce: 567, appData: '0x0f00' }),
        ];
        const p = wallet.pushMessage(messages_1.message({ signedStates }));
        await expectResults(p, [{ turnNum: five }, { turnNum: six, appData: '0x0f00' }]);
        const channelsAfter = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsAfter).toHaveLength(2);
        expect(channelsAfter[0].vars).toHaveLength(1);
        const stateVar = signedStates.map(state_utils_1.addHash)[1];
        const record = await channel_1.Channel.forId(wallet_core_1.calculateChannelId(stateVar), wallet.knex);
        expect(stateVar).toMatchObject(record.vars[0]);
    });
});
it("Doesn't store stale states", async () => {
    var _a;
    const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
    expect(channelsBefore).toHaveLength(0);
    const signedStates = [states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])({ turnNum: five })];
    await wallet.pushMessage(messages_1.message({ signedStates }));
    const afterFirst = await channel_1.Channel.query(wallet.knex).select();
    expect(afterFirst).toHaveLength(1);
    expect(afterFirst[0].vars).toHaveLength(1);
    expect(afterFirst[0].supported).toBeTruthy();
    expect((_a = afterFirst[0].supported) === null || _a === void 0 ? void 0 : _a.turnNum).toEqual(five);
    await wallet.pushMessage(messages_1.message({ signedStates: [states_1.stateSignedBy()({ turnNum: four })] }));
    const afterSecond = await channel_1.Channel.query(wallet.knex).select();
    expect(afterSecond[0].vars).toHaveLength(1);
    expect(afterSecond).toMatchObject(afterFirst);
    await wallet.pushMessage(messages_1.message({ signedStates: [states_1.stateSignedBy()({ turnNum: six })] }));
    const afterThird = await channel_1.Channel.query(wallet.knex).select();
    expect(afterThird[0].vars).toHaveLength(2);
});
it("doesn't store states for unknown signing addresses", async () => {
    await db_admin_connection_1.truncate(wallet.knex, ['signing_wallets']);
    const signedStates = [states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])({ turnNum: five })];
    return expect(wallet.pushMessage(messages_1.message({ signedStates }))).rejects.toThrow(Error('Not in channel'));
});
describe('when the application protocol returns an action', () => {
    it('signs the postfund setup when the prefund setup is supported', async () => {
        var _a;
        const state = states_1.stateSignedBy()({ outcome: wallet_core_1.simpleEthAllocation([]) });
        const c = channel_2.channel({ vars: [state_utils_1.addHash(state)] });
        await channel_1.Channel.query(wallet.knex).insert(c);
        expect((_a = c.latestSignedByMe) === null || _a === void 0 ? void 0 : _a.turnNum).toEqual(0);
        expect(c.supported).toBeUndefined();
        const { channelId } = c;
        const p = wallet.pushMessage(messages_1.message({ signedStates: [states_1.stateSignedBy([signing_wallets_1.bob()])(state)] }));
        await expectResults(p, [{ channelId, status: 'opening' }]);
        await expect(p).resolves.toMatchObject({
            outbox: [{ method: 'MessageQueued', params: { data: { signedStates: [{ turnNum: 3 }] } } }],
        });
        const updatedC = await channel_1.Channel.forId(channelId, wallet.knex);
        expect(updatedC.protocolState).toMatchObject({
            latestSignedByMe: { turnNum: 3 },
            supported: { turnNum: 0 },
        });
    });
    it('forms a conclusion proof when the peer wishes to close the channel', async () => {
        const turnNum = 6;
        const state = states_1.stateSignedBy()({ outcome: wallet_core_1.simpleEthAllocation([]), turnNum });
        const c = channel_2.channel({ vars: [state_utils_1.addHash(state)] });
        await channel_1.Channel.query(wallet.knex).insert(c);
        const { channelId } = c;
        const finalState = { ...state, isFinal: true, turnNum: turnNum + 1 };
        const p = wallet.pushMessage(messages_1.message({ signedStates: [states_1.stateSignedBy([signing_wallets_1.bob()])(finalState)] }));
        await expectResults(p, [{ channelId, status: 'closed' }]);
        await expect(p).resolves.toMatchObject({
            outbox: [
                {
                    method: 'MessageQueued',
                    params: { data: { signedStates: [{ turnNum: turnNum + 1, isFinal: true }] } },
                },
            ],
        });
        const updatedC = await channel_1.Channel.forId(channelId, wallet.knex);
        expect(updatedC.protocolState).toMatchObject({
            latestSignedByMe: { turnNum: turnNum + 1 },
            supported: { turnNum: turnNum + 1 },
        });
    });
});
describe('when there is a request provided', () => {
    it('has nothing in the outbox if there is no request added', async () => {
        await expect(wallet.pushMessage(messages_1.message({ requests: [] }))).resolves.toMatchObject({
            outbox: [],
        });
    });
    it('appends message with single state to the outbox satisfying a GetChannel request', async () => {
        const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsBefore).toHaveLength(0);
        const signedStates = [states_1.stateSignedBy([signing_wallets_1.bob()])({ turnNum: zero })];
        await wallet.pushMessage(messages_1.message({ signedStates }));
        const [{ channelId }] = await channel_1.Channel.query(wallet.knex).select();
        await expect(wallet.pushMessage(messages_1.message({ requests: [{ type: 'GetChannel', channelId }] }))).resolves.toMatchObject({
            outbox: [
                {
                    method: 'MessageQueued',
                    params: { data: { signedStates } },
                },
            ],
        });
    });
    it('appends message with multiple states to the outbox satisfying a GetChannel request', async () => {
        const channelsBefore = await channel_1.Channel.query(wallet.knex).select();
        expect(channelsBefore).toHaveLength(0);
        const signedStates = [
            states_1.stateSignedBy([signing_wallets_1.alice()])({ turnNum: five }),
            states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])({ turnNum: four }),
        ];
        await wallet.pushMessage(messages_1.message({ signedStates }));
        const [{ channelId }] = await channel_1.Channel.query(wallet.knex).select();
        await expect(wallet.pushMessage(messages_1.message({ requests: [{ type: 'GetChannel', channelId }] }))).resolves.toMatchObject({
            outbox: [
                {
                    method: 'MessageQueued',
                    params: { data: { signedStates } },
                },
            ],
        });
    });
});
//# sourceMappingURL=push-message.test.js.map