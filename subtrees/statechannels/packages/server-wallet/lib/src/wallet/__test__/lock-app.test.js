"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const channel_1 = require("../../models/channel");
const channel_2 = require("../../models/__test__/fixtures/channel");
const store_1 = require("../store");
const _1_signing_wallet_seeds_1 = require("../../db/seeds/1_signing_wallet_seeds");
const db_admin_connection_1 = __importDefault(require("../../db-admin/db-admin-connection"));
const knex_setup_teardown_1 = require("../../../jest/knex-setup-teardown");
const config_1 = require("../../config");
const state_vars_1 = require("./fixtures/state-vars");
jest.setTimeout(10000);
const store = new store_1.Store(config_1.defaultConfig.timingMetrics, config_1.defaultConfig.skipEvmValidation);
it('works', async () => {
    await _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex);
    const c = channel_2.withSupportedState()({ vars: [state_vars_1.stateVars({ turnNum: 5 })] });
    await channel_1.Channel.query(knex_setup_teardown_1.testKnex).insert(c);
    const { channelId, latest } = c;
    await expect(store.lockApp(knex_setup_teardown_1.testKnex, channelId, async (tx) => store.signState(channelId, { ...latest, turnNum: latest.turnNum + 1 }, tx))).resolves.toMatchObject({ channelResult: { turnNum: 6 } });
});
const next = ({ turnNum, appData, isFinal, outcome }) => ({
    turnNum: turnNum + 1,
    appData,
    isFinal,
    outcome,
});
describe('concurrency', () => {
    let channelId;
    let numResolved;
    let numRejected;
    let numSettled;
    let countResolvedPromise;
    let countRejectedPromise;
    let countSettledPromise;
    let c;
    beforeEach(async () => {
        await _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex);
        c = channel_2.withSupportedState()({ vars: [state_vars_1.stateVars({ turnNum: 5 })] });
        await channel_1.Channel.query(knex_setup_teardown_1.testKnex).insert(c);
        channelId = c.channelId;
        numResolved = 0;
        numRejected = 0;
        numSettled = 0;
        countResolvedPromise = ({ channelResult }) => {
            expect(channelResult).toMatchObject({ turnNum: 6 });
            numResolved += 1;
        };
        countRejectedPromise = (error) => {
            expect(error).toMatchObject(new Error('Stale state'));
            numRejected += 1;
        };
        countSettledPromise = () => (numSettled += 1);
    });
    it('works when run concurrently with the same channel', async () => {
        const numAttempts = 4;
        await Promise.all(lodash_1.default.range(numAttempts).map(() => store
            .lockApp(knex_setup_teardown_1.testKnex, channelId, async (tx) => store.signState(channelId, next(c.latest), tx))
            .then(countResolvedPromise)
            .catch(countRejectedPromise)
            .finally(countSettledPromise)));
        expect([numResolved, numRejected, numSettled]).toMatchObject([1, numAttempts - 1, numAttempts]);
        expect(numResolved).toEqual(1);
        expect(numRejected).toEqual(numAttempts - 1);
        expect(numSettled).toEqual(numAttempts);
        await expect(store.getChannel(channelId, knex_setup_teardown_1.testKnex)).resolves.toMatchObject({
            latest: { turnNum: 6 },
        });
    });
    const ONE_INSERT = 1200;
    const NUM_ATTEMPTS = 5;
    const OVERHEAD = 5000;
    const MANY_INSERTS_TIMEOUT = NUM_ATTEMPTS * ONE_INSERT + OVERHEAD;
    it(`works when run concurrently with ${NUM_ATTEMPTS} different channels`, async () => {
        await db_admin_connection_1.default.raw('TRUNCATE TABLE channels RESTART IDENTITY CASCADE');
        const channelIds = await Promise.all(lodash_1.default.range(NUM_ATTEMPTS).map(async (channelNonce) => {
            const c = channel_2.withSupportedState()({ vars: [state_vars_1.stateVars({ turnNum: 5 })], channelNonce });
            await channel_1.Channel.query(knex_setup_teardown_1.testKnex).insert(c);
            return c.channelId;
        }));
        const t1 = Date.now();
        await Promise.all(channelIds.map(channelId => store
            .lockApp(knex_setup_teardown_1.testKnex, channelId, async (tx, c) => store.signState(channelId, next(c.latest), tx))
            .then(countResolvedPromise)
            .finally(countSettledPromise)));
        const t2 = Date.now();
        expect((t2 - t1) / NUM_ATTEMPTS).toBeLessThan(ONE_INSERT);
        expect([numResolved, numRejected, numSettled]).toMatchObject([NUM_ATTEMPTS, 0, NUM_ATTEMPTS]);
        await expect(store.getChannel(channelIds[1], knex_setup_teardown_1.testKnex)).resolves.toMatchObject({
            latest: { turnNum: 6 },
        });
    }, MANY_INSERTS_TIMEOUT);
    test('sign state does not block concurrent updates', async () => {
        await Promise.all(lodash_1.default.range(NUM_ATTEMPTS).map(() => store
            .signState(channelId, next(c.latest), knex_setup_teardown_1.testKnex)
            .then(countResolvedPromise)
            .catch(countRejectedPromise)
            .finally(countSettledPromise)));
        expect(numResolved).toEqual(NUM_ATTEMPTS);
        expect(numRejected).toEqual(0);
        expect(numSettled).toEqual(NUM_ATTEMPTS);
        await expect(store.getChannel(channelId, knex_setup_teardown_1.testKnex)).resolves.toMatchObject({
            latest: next(c.latest),
        });
    });
});
describe('Missing channels', () => {
    it('throws a ChannelError by default', () => expect(store.lockApp(knex_setup_teardown_1.testKnex, 'foo', lodash_1.default.noop)).rejects.toThrow(new channel_1.ChannelError(channel_1.ChannelError.reasons.channelMissing, { channelId: 'foo' })));
    it('calls the onChannelMissing handler when given', () => expect(store.lockApp(knex_setup_teardown_1.testKnex, 'foo', lodash_1.default.noop, lodash_1.default.noop)).resolves.not.toThrow());
    it('calls the onChannelMissing handler with the channel Id when given', () => expect(store.lockApp(knex_setup_teardown_1.testKnex, 'foo', lodash_1.default.noop, lodash_1.default.identity)).resolves.toEqual('foo'));
});
//# sourceMappingURL=lock-app.test.js.map