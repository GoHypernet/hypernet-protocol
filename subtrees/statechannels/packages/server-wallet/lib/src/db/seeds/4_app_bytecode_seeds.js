"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_bytecode_1 = require("../../models/app-bytecode");
const app_bytecode_2 = require("../../models/__test__/fixtures/app-bytecode");
async function seed(knex) {
    await knex('app_bytecode').truncate();
    await app_bytecode_1.AppBytecode.query().insert([app_bytecode_2.appBytecode()]);
}
exports.seed = seed;
//# sourceMappingURL=4_app_bytecode_seeds.js.map