"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const nonce_1 = require("../nonce");
const participants_1 = require("../../wallet/__test__/fixtures/participants");
const knex_setup_teardown_1 = require("../../../jest/knex-setup-teardown");
const nonces_1 = require("./fixtures/nonces");
afterEach(async () => knex_setup_teardown_1.testKnex('nonces').truncate());
describe('asking for a new nonce', () => {
    it('returns 0 for new addresses', () => expect(nonce_1.Nonce.next(knex_setup_teardown_1.testKnex, [participants_1.bob().signingAddress])).resolves.toEqual(0));
    it('returns the next nonce for existing addresses', async () => {
        await expect(nonce_1.Nonce.next(knex_setup_teardown_1.testKnex, [participants_1.bob().signingAddress])).resolves.toEqual(0);
        await expect(nonce_1.Nonce.next(knex_setup_teardown_1.testKnex, [participants_1.bob().signingAddress])).resolves.toEqual(1);
        await expect(nonce_1.Nonce.next(knex_setup_teardown_1.testKnex, [participants_1.alice().signingAddress])).resolves.toEqual(0);
        await expect(nonce_1.Nonce.next(knex_setup_teardown_1.testKnex, [participants_1.bob().signingAddress])).resolves.toEqual(2);
    });
    it('rejects when addresses is invalid', () => expect(nonce_1.Nonce.next(knex_setup_teardown_1.testKnex, ['notAnAddress'])).rejects.toThrow('violates check constraint "nonces_addresses_are_valid"'));
    it('works concurrently', async () => {
        const nextNonce = () => nonce_1.Nonce.next(knex_setup_teardown_1.testKnex, [participants_1.bob().signingAddress]);
        const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const nonces = await Promise.all(expected.map(nextNonce));
        expect(lodash_1.default.sortBy(nonces, a => a)).toMatchObject(expected);
    });
});
describe('using a given nonce', () => {
    it('works when there is no existing nonce', () => expect(nonces_1.nonce().use(knex_setup_teardown_1.testKnex)).resolves.toEqual(0));
    it('works the value exceeds the existing nonce', async () => {
        await expect(nonces_1.nonce({ value: 1 }).use(knex_setup_teardown_1.testKnex)).resolves.toEqual(1);
        await expect(nonces_1.nonce({ value: 3 }).use(knex_setup_teardown_1.testKnex)).resolves.toEqual(3);
    });
    it('rejects when the value does not exceed the existing nonce', async () => {
        await expect(nonces_1.nonce({ value: 3 }).use(knex_setup_teardown_1.testKnex)).resolves.toEqual(3);
        await expect(nonces_1.nonce({ value: 1 }).use(knex_setup_teardown_1.testKnex)).rejects.toThrow('Nonce too low');
        await expect(nonces_1.nonce({ value: 4 }).use(knex_setup_teardown_1.testKnex)).resolves.toEqual(4);
    });
});
//# sourceMappingURL=nonces.test.js.map