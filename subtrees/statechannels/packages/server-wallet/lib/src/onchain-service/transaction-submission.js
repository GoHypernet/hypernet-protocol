"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const p_queue_1 = __importDefault(require("p-queue"));
const logger_1 = require("../logger");
const utils_1 = require("./utils");
class TransactionSubmissionError extends utils_1.BaseError {
    constructor(reason, data = undefined) {
        super(reason, data);
        this.data = data;
        this.type = utils_1.BaseError.errors.OnchainError;
        logger_1.logger.error(reason, data);
    }
}
exports.TransactionSubmissionError = TransactionSubmissionError;
TransactionSubmissionError.knownErrors = {
    badNonce: `the tx doesn't have the correct nonce`,
    invalidNonce: 'Invalid nonce',
    noHash: 'no transaction hash found in tx response',
    underpricedReplacement: 'replacement transaction underpriced',
};
TransactionSubmissionError.reasons = {
    zeroAttempts: 'Invalid max transaction submission attempt count of 0',
    failedAllAttempts: 'Failed all transaction attempts',
    unknownError: 'Transaction failed with unkown error',
};
class TransactionSubmissionService {
    constructor(provider, wallet, store) {
        this.queue = new p_queue_1.default({ concurrency: 1 });
        this.memoryNonce = 0;
        this.provider =
            typeof provider === 'string' ? new ethers_1.providers.JsonRpcProvider(provider) : provider;
        this.wallet =
            typeof wallet === 'string'
                ? new ethers_1.Wallet(wallet, this.provider)
                : wallet.connect(this.provider);
        this.store = store;
        logger_1.logger.info(`Transaction service created`);
    }
    async submitTransaction(channelId, tx, options = {}) {
        var _a;
        const attempts = (_a = options.maxSendAttempts, (_a !== null && _a !== void 0 ? _a : 1));
        if (attempts === 0) {
            throw new TransactionSubmissionError(TransactionSubmissionError.reasons.zeroAttempts, {
                attempts,
            });
        }
        const indexedErrors = {};
        for (let attempt = 0; attempt < attempts; attempt++) {
            try {
                const response = await this.queue.add(() => this._sendTransaction(channelId, tx));
                logger_1.logger.info(`Transaction sent`, { hash: response.hash, channelId, to: tx.to });
                return response;
            }
            catch (e) {
                indexedErrors[attempt.toString()] = e.message;
                if (!TransactionSubmissionError.isKnownErr(e.message, Object.values(TransactionSubmissionError.knownErrors))) {
                    throw new TransactionSubmissionError(TransactionSubmissionError.reasons.unknownError, {
                        attempt,
                        attempts,
                        indexedErrors,
                    });
                }
                logger_1.logger.warn(`Failed to send tx`, { attempt, error: e.message });
            }
        }
        throw new TransactionSubmissionError(TransactionSubmissionError.reasons.failedAllAttempts, {
            attempts,
            indexedErrors,
        });
    }
    async _sendTransaction(channelId, tx) {
        const chainNonce = await this.wallet.getTransactionCount();
        const nonce = this.memoryNonce > chainNonce ? this.memoryNonce : chainNonce;
        const nonced = { ...tx, nonce };
        await this.store.saveTransactionRequest(channelId, nonced);
        logger_1.logger.info(`Sending transaction`, { nonce, channelId, to: tx.to });
        const response = await this.wallet.sendTransaction(nonced);
        await this.store.saveTransactionResponse(channelId, response);
        response
            .wait()
            .then(receipt => {
            logger_1.logger.debug(`Transaction mined`, {
                hash: receipt.transactionHash,
                to: receipt.to,
                channelId,
            });
            this.store.saveTransactionReceipt(channelId, receipt);
        })
            .catch(e => this.store.saveFailedTransaction(channelId, nonced, e.message));
        this.memoryNonce = nonce + 1;
        return response;
    }
}
exports.TransactionSubmissionService = TransactionSubmissionService;
//# sourceMappingURL=transaction-submission.js.map