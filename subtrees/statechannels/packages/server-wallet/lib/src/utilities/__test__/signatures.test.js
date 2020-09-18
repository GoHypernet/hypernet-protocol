"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const wallet_core_1 = require("@statechannels/wallet-core");
const lodash_1 = __importDefault(require("lodash"));
const participants_1 = require("../../wallet/__test__/fixtures/participants");
const signatures_1 = require("../signatures");
const logger_1 = require("../../logger");
const state_utils_1 = require("../../state-utils");
it('sign vs fastSign', async () => {
    lodash_1.default.range(5).map(async (channelNonce) => {
        const { address, privateKey } = ethers_1.Wallet.createRandom();
        const state = {
            chainId: '0x1',
            channelNonce,
            participants: [participants_1.participant({ signingAddress: address })],
            outcome: wallet_core_1.simpleEthAllocation([]),
            turnNum: 1,
            isFinal: false,
            appData: '0x00',
            appDefinition: ethers_1.ethers.constants.AddressZero,
            challengeDuration: 0x5,
        };
        const signedState = wallet_core_1.signState(state, privateKey);
        const fastSignedState = signatures_1.fastSignState(state_utils_1.addHash(state), privateKey);
        try {
            expect(signedState).toEqual((await fastSignedState).signature);
        }
        catch (error) {
            logger_1.logger.info({ error, state, privateKey });
            throw error;
        }
    });
});
it('getSignerAddress vs fastRecover', async () => {
    lodash_1.default.range(5).map(async (channelNonce) => {
        const { address, privateKey } = ethers_1.Wallet.createRandom();
        const state = {
            chainId: '0x1',
            channelNonce,
            participants: [participants_1.participant({ signingAddress: address })],
            outcome: wallet_core_1.simpleEthAllocation([]),
            turnNum: 1,
            isFinal: false,
            appData: '0x00',
            appDefinition: ethers_1.ethers.constants.AddressZero,
            challengeDuration: 0x5,
        };
        const signedState = await signatures_1.fastSignState(state_utils_1.addHash(state), privateKey);
        try {
            const recovered = wallet_core_1.getSignerAddress(signedState.state, signedState.signature);
            const stateHash = wallet_core_1.hashState(signedState.state);
            const fastRecovered = signatures_1.fastRecoverAddress(signedState.state, signedState.signature, stateHash);
            expect(recovered).toEqual(fastRecovered);
        }
        catch (error) {
            logger_1.logger.info({ error, state, privateKey });
            throw error;
        }
    });
});
//# sourceMappingURL=signatures.test.js.map