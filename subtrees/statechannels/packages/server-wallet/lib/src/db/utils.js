"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addAddressCheck(knex, table, column) {
    return knex.raw(`\
    ALTER TABLE ${table}\
    ADD CONSTRAINT ${column}_is_address CHECK (${column} ~ '^0x[0-9a-fA-F]{40}$')
  `);
}
exports.addAddressCheck = addAddressCheck;
function addUint48Check(knex, table, column) {
    return knex.raw(`\
    ALTER TABLE ${table}\
    ADD CONSTRAINT ${column}_is_Uint48 CHECK (${column} >= 0)
  `);
}
exports.addUint48Check = addUint48Check;
function addBytesCheck(knex, table, column) {
    return knex.raw(`\
    ALTER TABLE ${table}\
    ADD CONSTRAINT ${column}_is_bytes CHECK (${column} ~ '^0x[0-9a-fA-F]*$')
  `);
}
exports.addBytesCheck = addBytesCheck;
function addBytes32Check(knex, table, column) {
    return knex.raw(`\
    ALTER TABLE ${table}\
    ADD CONSTRAINT ${column}_is_bytes32 CHECK (${column} ~ '^0x[0-9a-fA-F]{64}$')
  `);
}
exports.addBytes32Check = addBytes32Check;
//# sourceMappingURL=utils.js.map