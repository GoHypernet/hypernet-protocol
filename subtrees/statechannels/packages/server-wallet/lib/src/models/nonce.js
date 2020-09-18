"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const ethers_1 = require("ethers");
const wallet_error_1 = require("../errors/wallet-error");
class Nonce extends objection_1.Model {
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['addresses'],
        };
    }
    $beforeValidate(jsonSchema, json, _opt) {
        super.$beforeValidate(jsonSchema, json, _opt);
        const { addresses } = json;
        if (!Array.isArray(addresses)) {
            throw new NonceError(NonceError.reasons.addressNotInArray, { addresses });
        }
        const notAddr = addresses.find(addr => !isAddress(addr));
        if (notAddr)
            throw new NonceError(NonceError.reasons.notAnAddress, { notAddr });
        return json;
    }
    static async next(knex, addresses) {
        const insertQuery = knex('nonces').insert({ addresses });
        return knex
            .raw(`
      ${insertQuery} ON CONFLICT (addresses)
      DO UPDATE SET value = nonces.value + 1
      RETURNING value `)
            .then(res => res.rows[0].value);
    }
    async use(knex) {
        var _a;
        const { rows } = await knex.raw(`
        ${knex('nonces').insert(this)}
        ON CONFLICT (addresses) DO UPDATE
        SET value = EXCLUDED.value WHERE EXCLUDED.value > NONCES.value
        RETURNING NONCES.value
      `);
        if (typeof ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.value) === 'number') {
            return rows[0].value;
        }
        else {
            throw new NonceError(NonceError.reasons.nonceTooLow);
        }
    }
}
exports.Nonce = Nonce;
Nonce.tableName = 'nonces';
class NonceError extends wallet_error_1.WalletError {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.type = wallet_error_1.WalletError.errors.NonceError;
    }
}
NonceError.reasons = {
    addressNotInArray: 'Addresses are not an array',
    notAnAddress: 'Not an address',
    nonceTooLow: 'Nonce too low -- ask for a new nonce',
};
const isAddress = ethers_1.ethers.utils.isAddress;
//# sourceMappingURL=nonce.js.map