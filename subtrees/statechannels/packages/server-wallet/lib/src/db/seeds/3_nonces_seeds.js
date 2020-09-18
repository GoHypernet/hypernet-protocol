"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nonce_1 = require("../../models/nonce");
const participants_1 = require("../../wallet/__test__/fixtures/participants");
const nonces_1 = require("../../models/__test__/fixtures/nonces");
const addresses = [participants_1.bob, participants_1.alice].map(p => p().signingAddress);
const seeds = [nonces_1.nonce(), nonces_1.nonce({ addresses, value: 3 })];
async function seed(knex) {
    await knex('nonces').truncate();
    await nonce_1.Nonce.query().insert(seeds);
}
exports.seed = seed;
//# sourceMappingURL=3_nonces_seeds.js.map