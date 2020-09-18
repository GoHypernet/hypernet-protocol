"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appBytecode = 'app_bytecode';
async function up(knex) {
    await knex.schema.createTable(appBytecode, function (table) {
        table.string('chain_id').notNullable();
        table.string('app_definition').notNullable();
        table.text('app_bytecode').notNullable();
        table.primary(['chain_id', 'app_definition']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable(appBytecode);
}
exports.down = down;
//# sourceMappingURL=20200814010138_app_bytecode.js.map