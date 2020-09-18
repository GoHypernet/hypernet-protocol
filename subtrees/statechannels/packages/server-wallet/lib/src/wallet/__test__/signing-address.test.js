"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const db_admin_connection_1 = require("../../db-admin/db-admin-connection");
const store_1 = require("../store");
const _1_signing_wallet_seeds_1 = require("../../db/seeds/1_signing_wallet_seeds");
const knex_setup_teardown_1 = require("../../../jest/knex-setup-teardown");
const config_1 = require("../../config");
const participants_1 = require("./fixtures/participants");
beforeEach(async () => {
    await db_admin_connection_1.truncate(knex_setup_teardown_1.testKnex);
});
const store = new store_1.Store(config_1.defaultConfig.timingMetrics, config_1.defaultConfig.skipEvmValidation);
describe('signingAddress', () => {
    it('generate address then get address', async () => {
        const signingAddress = await store.getOrCreateSigningAddress(knex_setup_teardown_1.testKnex);
        expect(signingAddress).toBeDefined();
        expect(ethers_1.ethers.utils.isAddress(signingAddress)).toBeTruthy();
        const signingAddress2 = await store.getOrCreateSigningAddress(knex_setup_teardown_1.testKnex);
        expect(signingAddress).toEqual(signingAddress2);
    });
    it('prepopulated address returned correctly', async () => {
        await _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex);
        const signingAddress = await store.getOrCreateSigningAddress(knex_setup_teardown_1.testKnex);
        expect(signingAddress).toEqual(participants_1.alice().signingAddress);
    });
});
//# sourceMappingURL=signing-address.test.js.map