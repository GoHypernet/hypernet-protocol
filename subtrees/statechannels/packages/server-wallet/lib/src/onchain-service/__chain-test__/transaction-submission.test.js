"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const nitro_protocol_1 = require("@statechannels/nitro-protocol");
const transaction_submission_1 = require("../transaction-submission");
const config_1 = require("../../config");
const store_1 = require("../store");
const verifyResponse = async (response, tx) => {
    var _a, _b;
    expect(response.to).toEqual(tx.to);
    expect((_a = response.value) === null || _a === void 0 ? void 0 : _a.toString()).toEqual((_b = tx.value) === null || _b === void 0 ? void 0 : _b.toString());
    expect(response.data).toEqual(tx.data);
    expect(response.hash).toBeDefined();
    const receipt = await response.wait();
    expect(receipt.transactionHash).toBe(response.hash);
    expect(receipt.to).toBe(response.to);
};
const getTransaction = (overrides = {}) => {
    return {
        to: ethers_1.Wallet.createRandom().address,
        value: ethers_1.BigNumber.from(10),
        data: '0x00',
        ...overrides,
    };
};
const getFailingWallet = (error) => {
    return {
        connect: (_provider) => {
            return {
                getTransactionCount: () => 0,
                sendTransaction: (_tx) => {
                    throw new Error(error || 'Fail');
                },
            };
        },
    };
};
describe('TransactionSubmissionService.submitTransaction', () => {
    let service;
    let wallet;
    let provider;
    const channelId = nitro_protocol_1.randomChannelId();
    beforeEach(async () => {
        provider = new ethers_1.providers.JsonRpcProvider(config_1.defaultConfig.rpcEndpoint);
        wallet = new ethers_1.Wallet(config_1.defaultConfig.serverPrivateKey);
        service = new transaction_submission_1.TransactionSubmissionService(provider, wallet, new store_1.TransactionSubmissionStore());
    });
    it('should fail if provided with 0 attempts', async () => {
        const tx = getTransaction();
        await expect(service.submitTransaction(channelId, tx, { maxSendAttempts: 0 })).rejects.toEqual(new transaction_submission_1.TransactionSubmissionError(transaction_submission_1.TransactionSubmissionError.reasons.zeroAttempts));
    });
    it('should send a transaction successfully', async () => {
        const tx = getTransaction();
        const response = await service.submitTransaction(channelId, tx);
        await verifyResponse(response, tx);
    });
    it('should send concurrent transactions successfully', async () => {
        const tx = getTransaction();
        const responses = await Promise.all([
            service.submitTransaction(channelId, tx),
            service.submitTransaction(channelId, tx),
        ]);
        await Promise.all(responses.map(response => verifyResponse(response, tx)));
    });
    it('should retry transactions with known errors', async () => {
        const mock = getFailingWallet(transaction_submission_1.TransactionSubmissionError.knownErrors.badNonce);
        service = new transaction_submission_1.TransactionSubmissionService(provider, mock, new store_1.TransactionSubmissionStore());
        const tx = getTransaction();
        await expect(service.submitTransaction(channelId, tx, { maxSendAttempts: 2 })).rejects.toEqual(new transaction_submission_1.TransactionSubmissionError(transaction_submission_1.TransactionSubmissionError.reasons.failedAllAttempts));
    });
    it('should not retry transactions with unknown errors', async () => {
        const mock = getFailingWallet();
        service = new transaction_submission_1.TransactionSubmissionService(provider, mock, new store_1.TransactionSubmissionStore());
        const tx = getTransaction();
        await expect(service.submitTransaction(channelId, tx, { maxSendAttempts: 2 })).rejects.toEqual(new transaction_submission_1.TransactionSubmissionError(transaction_submission_1.TransactionSubmissionError.reasons.unknownError));
    });
});
//# sourceMappingURL=transaction-submission.test.js.map