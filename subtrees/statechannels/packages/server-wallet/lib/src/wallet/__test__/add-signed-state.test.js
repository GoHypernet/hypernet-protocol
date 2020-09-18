"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../store");
const channel_1 = require("../../models/channel");
const state_utils_1 = require("../../state-utils");
const knex_setup_teardown_1 = require("../../../jest/knex-setup-teardown");
const config_1 = require("../../config");
const states_1 = require("./fixtures/states");
const signing_wallets_1 = require("./fixtures/signing-wallets");
const store = new store_1.Store(config_1.defaultConfig.timingMetrics, config_1.defaultConfig.skipEvmValidation);
describe('addSignedState', () => {
    let tx;
    afterEach(async () => tx.rollback());
    beforeEach(async () => {
        tx = await channel_1.Channel.startTransaction(knex_setup_teardown_1.testKnex);
    });
    const BOB_SIGNATURE = '0x36a5fd36a1c9a85afdeee3f9471579656eefceb08bc0ff53d194a67d6433c6385cc8c9aa049306fc7cce901f7b3345bccde311cceadc74a40a89a9d74d86d9b91b';
    it('throws on an invalid signature', async () => {
        const signedState = state_utils_1.addHash({
            ...states_1.createState(),
            signatures: [{ signer: signing_wallets_1.alice().address, signature: BOB_SIGNATURE }],
        });
        await expect(store.addSignedState(undefined, signedState, knex_setup_teardown_1.testKnex)).rejects.toThrow('Invalid signature');
    });
});
//# sourceMappingURL=add-signed-state.test.js.map