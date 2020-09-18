"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funding = 'funding';
async function up(knex) {
    await knex.schema.createTable(funding, function (table) {
        table.string('channel_id').notNullable();
        table.string('amount').notNullable();
        table.string('asset_holder').notNullable();
        table.primary(['channel_id', 'asset_holder']);
        table.foreign('channel_id').references('channels.channel_id');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable(funding);
}
exports.down = down;
//# sourceMappingURL=20200818083933_funding.js.map