"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signingWallet = 'signing_wallets';
const enforceOneRow = 'enforce_one_row';
async function up(knex) {
    await knex.schema.alterTable(signingWallet, table => table
        .integer(enforceOneRow)
        .unique(enforceOneRow)
        .notNullable()
        .defaultTo(1));
    await knex.raw(`\
    ALTER TABLE ${signingWallet}
    ADD CONSTRAINT one_row_constraint
    CHECK (
      ${enforceOneRow} = 1
    )
  `);
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(signingWallet, table => table.dropColumn(enforceOneRow));
}
exports.down = down;
//# sourceMappingURL=20200812081700_signing_wallet.js.map