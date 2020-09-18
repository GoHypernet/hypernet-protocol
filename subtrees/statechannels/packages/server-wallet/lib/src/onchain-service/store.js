"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
class TransactionSubmissionStore {
    constructor() {
        this.requestedTransactions = new Map();
        this.minedTransactions = new Map();
    }
    saveTransactionRequest(channelId, tx) {
        const existing = this.requestedTransactions.get(channelId) || [];
        const idx = existing.findIndex(e => e.nonce === tx.nonce);
        const updated = idx > -1 ? [...existing] : [...existing, tx];
        this.requestedTransactions.set(channelId, updated);
        return Promise.resolve();
    }
    saveTransactionResponse(_channelId, _tx) {
        return Promise.resolve();
    }
    saveTransactionReceipt(channelId, receipt) {
        if (this.requestedTransactions.get(channelId)) {
            this.requestedTransactions.delete(channelId);
        }
        const existing = this.minedTransactions.get(channelId) || [];
        const idx = existing.findIndex(e => e.hash === receipt.transactionHash);
        const updated = [...existing];
        if (idx > -1) {
            updated.splice(idx, 1);
        }
        this.minedTransactions.set(channelId, updated);
        return Promise.resolve();
    }
    saveFailedTransaction(channelId, tx, _reason) {
        const existingRequests = this.requestedTransactions.get(channelId) || [];
        const updatedRequests = existingRequests.filter(x => x.nonce === tx.nonce);
        this.requestedTransactions.set(channelId, updatedRequests);
        const existing = this.minedTransactions.get(channelId) || [];
        const idx = existing.findIndex(e => e.nonce === tx.nonce);
        const updated = [...existing];
        if (idx > -1) {
            updated.splice(idx, 1);
        }
        this.minedTransactions.set(channelId, updated);
        return Promise.resolve();
    }
}
exports.TransactionSubmissionStore = TransactionSubmissionStore;
class OnchainServiceStore {
    constructor() {
        this.events = new Map();
    }
    getEvents(channelId) {
        return Promise.resolve(this.events.get(channelId) || []);
    }
    getLatestEvent(channelId, _event) {
        if (!this.hasChannel(channelId)) {
            throw new Error('Channel not found');
        }
        const unsorted = (this.events.get(channelId) || []).filter(e => utils_1.isFundingEvent(e));
        const [latest] = unsorted.sort((a, b) => {
            if (a.type !== b.type) {
                throw new Error('This should never happen');
            }
            switch (b.type) {
                case 'Deposited': {
                    return ethers_1.BigNumber.from(b.destinationHoldings)
                        .sub(a.destinationHoldings)
                        .toNumber();
                }
                default: {
                    const e = b.type;
                    throw new Error(`Unrecognized contract event type: ${e}`);
                }
            }
        });
        return latest;
    }
    saveEvent(channelId, data) {
        const existing = this.events.get(channelId) || [];
        const idx = existing.findIndex(e => {
            return e.transactionHash === data.transactionHash;
        });
        if (idx === -1) {
            const updated = [...existing, data];
            this.events.set(channelId, updated);
        }
        return Promise.resolve();
    }
    registerChannel(channelId) {
        if (!this.events.has(channelId)) {
            this.events.set(channelId, []);
        }
        return Promise.resolve();
    }
    hasChannel(channelId) {
        return this.events.has(channelId);
    }
}
exports.OnchainServiceStore = OnchainServiceStore;
//# sourceMappingURL=store.js.map