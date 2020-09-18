"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const store_1 = require("../store");
const channel_1 = require("../../models/__test__/fixtures/channel");
const _1_signing_wallet_seeds_1 = require("../../db/seeds/1_signing_wallet_seeds");
const channel_2 = require("../../models/channel");
const knex_setup_teardown_1 = require("../../../jest/knex-setup-teardown");
const config_1 = require("../../config");
const states_1 = require("./fixtures/states");
const signing_wallets_1 = require("./fixtures/signing-wallets");
let tx;
const store = new store_1.Store(config_1.defaultConfig.timingMetrics, config_1.defaultConfig.skipEvmValidation);
beforeEach(async () => {
    await _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex);
    tx = await channel_2.Channel.startTransaction(knex_setup_teardown_1.testKnex);
});
afterEach(async () => tx.rollback());
describe('signState', () => {
    let c;
    beforeEach(async () => {
        c = await channel_2.Channel.query(knex_setup_teardown_1.testKnex).insert(channel_1.channel({ vars: [states_1.stateWithHashSignedBy(signing_wallets_1.bob())()] }));
    });
    it('signs the state, returning outgoing messages and a channelResult', async () => {
        await expect(channel_2.Channel.query(knex_setup_teardown_1.testKnex).where({ id: c.id })).resolves.toHaveLength(1);
        expect(c.latestSignedByMe).toBeUndefined();
        const signature = wallet_core_1.signState({ ...c.vars[0], ...c.channelConstants }, signing_wallets_1.alice().privateKey);
        const result = await store.signState(c.channelId, c.vars[0], tx);
        expect(result).toMatchObject({
            outgoing: [
                {
                    type: 'NotifyApp',
                    notice: {
                        method: 'MessageQueued',
                        params: {
                            data: {
                                signedStates: [{ ...c.vars[0], signatures: [{ signature, signer: signing_wallets_1.alice().address }] }],
                            },
                        },
                    },
                },
            ],
            channelResult: { turnNum: c.vars[0].turnNum },
        });
    });
    it('uses a transaction', async () => {
        const updatedC = await store.signState(c.channelId, c.vars[0], tx);
        expect(updatedC).toBeDefined();
        const currentC = await channel_2.Channel.forId(c.channelId, knex_setup_teardown_1.testKnex);
        expect(currentC.latestSignedByMe).toBeUndefined();
        const pendingC = await channel_2.Channel.forId(c.channelId, tx);
        expect(pendingC.latestSignedByMe).toBeDefined();
    });
});
//# sourceMappingURL=sign-state.test.js.map