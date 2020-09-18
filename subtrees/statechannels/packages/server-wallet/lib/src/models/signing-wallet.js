"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const wallet_core_1 = require("@statechannels/wallet-core");
const ethers_1 = require("ethers");
const signatures_1 = require("../utilities/signatures");
class SigningWallet extends objection_1.Model {
    $beforeValidate(jsonSchema, json, _opt) {
        super.$beforeValidate(jsonSchema, json, _opt);
        if (!json.address) {
            const { address } = new ethers_1.ethers.Wallet(json.privateKey);
            json.address = address;
        }
        return json;
    }
    $validate(json) {
        super.$validate(json);
        const w = new ethers_1.ethers.Wallet(json.privateKey);
        if (w.address !== json.address) {
            throw new SigningWalletError(SigningWalletError.reasons.invalidAddress, {
                given: json.address,
                correct: w.address,
            });
        }
        return json;
    }
    syncSignState(state) {
        return {
            signer: this.address,
            signature: wallet_core_1.signState(state, this.privateKey),
        };
    }
    async signState(state) {
        return {
            signer: this.address,
            signature: (await signatures_1.fastSignState(state, this.privateKey)).signature,
        };
    }
}
exports.SigningWallet = SigningWallet;
SigningWallet.tableName = 'signing_wallets';
class SigningWalletError extends Error {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.type = 'SigningWalletError';
    }
}
SigningWalletError.reasons = { invalidAddress: 'Invalid address' };
//# sourceMappingURL=signing-wallet.js.map