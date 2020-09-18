"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nonce_1 = require("../../nonce");
const participants_1 = require("../../../wallet/__test__/fixtures/participants");
const utils_1 = require("../../../wallet/__test__/fixtures/utils");
const defaultValue = nonce_1.Nonce.fromJson({
    value: 0,
    addresses: [participants_1.alice().signingAddress, participants_1.bob().signingAddress],
});
exports.nonce = utils_1.fixture(defaultValue);
//# sourceMappingURL=nonces.js.map