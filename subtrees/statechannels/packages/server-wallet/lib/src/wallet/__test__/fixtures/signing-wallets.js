"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signing_wallet_1 = require("../../../models/signing-wallet");
exports.alice = () => signing_wallet_1.SigningWallet.fromJson({
    privateKey: '0x95942b296854c97024ca3145abef8930bf329501b718c0f66d57dba596ff1318',
});
exports.bob = () => signing_wallet_1.SigningWallet.fromJson({
    privateKey: '0xb3ab7b031311fe1764b657a6ae7133f19bac97acd1d7edca9409daa35892e727',
});
exports.charlie = () => signing_wallet_1.SigningWallet.fromJson({
    privateKey: '0xc9a5f30ceaf2a0ccbb30d50aa9de3f273aa6e76f89e26090c42775e9647f5b6a',
});
//# sourceMappingURL=signing-wallets.js.map