"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const db_admin_connection_1 = require("../../db-admin/db-admin-connection");
const store_1 = require("../store");
const _1_signing_wallet_seeds_1 = require("../../db/seeds/1_signing_wallet_seeds");
const signing_wallet_1 = require("../../models/signing-wallet");
const knex_setup_teardown_1 = require("../../../jest/knex-setup-teardown");
const config_1 = require("../../config");
const participants_1 = require("./fixtures/participants");
beforeEach(async () => {
    await db_admin_connection_1.truncate(knex_setup_teardown_1.testKnex);
});
const store = new store_1.Store(config_1.defaultConfig.timingMetrics, config_1.defaultConfig.skipEvmValidation);
describe('getFirstParticipant', () => {
    it('works', async () => {
        await expect(signing_wallet_1.SigningWallet.query(knex_setup_teardown_1.testKnex)).resolves.toHaveLength(0);
        const { signingAddress } = await store.getFirstParticipant(knex_setup_teardown_1.testKnex);
        expect(signingAddress).toBeDefined();
        expect(ethers_1.ethers.utils.isAddress(signingAddress)).toBeTruthy();
        const { signingAddress: signingAddress2 } = await store.getFirstParticipant(knex_setup_teardown_1.testKnex);
        expect(signingAddress).toEqual(signingAddress2);
        await expect(signing_wallet_1.SigningWallet.query(knex_setup_teardown_1.testKnex)).resolves.toHaveLength(1);
    });
    it('prepopulated address returned correctly', async () => {
        await _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex);
        await expect(signing_wallet_1.SigningWallet.query(knex_setup_teardown_1.testKnex)).resolves.toHaveLength(1);
        const { signingAddress, participantId } = await store.getFirstParticipant(knex_setup_teardown_1.testKnex);
        expect(signingAddress).toEqual(participants_1.alice().signingAddress);
        expect(participantId).toEqual(participants_1.alice().signingAddress);
        await expect(signing_wallet_1.SigningWallet.query(knex_setup_teardown_1.testKnex)).resolves.toHaveLength(1);
    });
});
//# sourceMappingURL=get-first-participant.test.js.map