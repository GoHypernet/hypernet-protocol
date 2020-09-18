"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const wallets = __importStar(require("./signing-wallets"));
const utils_1 = require("./utils");
const _alice = {
    signingAddress: wallets.alice().address,
    destination: wallet_core_1.makeDestination('0xaaaa000000000000000000000000000000000000000000000000000000000001'),
    participantId: 'alice',
};
const _bob = {
    signingAddress: wallets.bob().address,
    destination: wallet_core_1.makeDestination('0xbbbb000000000000000000000000000000000000000000000000000000000002'),
    participantId: 'bob',
};
const _charlie = {
    signingAddress: wallets.charlie().address,
    destination: wallet_core_1.makeDestination('0xcccc000000000000000000000000000000000000000000000000000000000003'),
    participantId: 'charlie',
};
exports.participant = utils_1.fixture(_alice);
exports.alice = utils_1.fixture(_alice);
exports.bob = utils_1.fixture(_bob);
exports.charlie = utils_1.fixture(_charlie);
//# sourceMappingURL=participants.js.map