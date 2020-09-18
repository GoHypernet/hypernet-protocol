"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const channels = 'channels';
const signingWallets = 'signing_wallets';
async function up(knex) {
    await knex.schema.createTable(signingWallets, function (table) {
        table.increments('id');
        table
            .string('private_key')
            .notNullable()
            .unique();
        table
            .string('address')
            .notNullable()
            .unique();
    });
    await utils_1.addBytes32Check(knex, signingWallets, 'private_key');
    await utils_1.addAddressCheck(knex, signingWallets, 'address');
    await knex.schema.createTable(channels, function (table) {
        table.increments('id');
        table
            .string('channel_id')
            .notNullable()
            .unique();
        table.string('signing_address').notNullable();
        table.foreign('signing_address').references('signing_wallets.address');
        table.string('chain_id').notNullable();
        table.integer('channel_nonce').notNullable();
        table.string('app_definition').notNullable();
        table.integer('challenge_duration').notNullable();
        table.jsonb('vars').notNullable();
        table.jsonb('participants').notNullable();
    });
    await utils_1.addBytes32Check(knex, channels, 'channel_id');
    await utils_1.addAddressCheck(knex, channels, 'app_definition');
    await utils_1.addAddressCheck(knex, channels, 'signing_address');
    await utils_1.addUint48Check(knex, channels, 'channel_nonce');
    await utils_1.addUint48Check(knex, channels, 'challenge_duration');
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable(channels);
    await knex.schema.dropTable(signingWallets);
}
exports.down = down;
//# sourceMappingURL=20200707165856_initial.js.map