"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signing_wallet_1 = require("../../models/signing-wallet");
const signing_wallets_1 = require("../../wallet/__test__/fixtures/signing-wallets");
const db_admin_connection_1 = require("../../db-admin/db-admin-connection");
const seeds = [signing_wallets_1.alice()];
async function seedAlicesSigningWallet(knex) {
    await db_admin_connection_1.truncate(knex);
    await signing_wallet_1.SigningWallet.query(knex).insert(seeds);
}
exports.seedAlicesSigningWallet = seedAlicesSigningWallet;
exports.seed = seedAlicesSigningWallet;
//# sourceMappingURL=1_signing_wallet_seeds.js.map