"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("@ethersproject/constants");
const Either_1 = require("fp-ts/lib/Either");
const ethers_1 = require("ethers");
const channel_1 = require("../models/channel");
const signing_wallet_1 = require("../models/signing-wallet");
const state_utils_1 = require("../state-utils");
const wallet_error_1 = require("../errors/wallet-error");
const evm_validator_1 = require("../evm-validator");
const metrics_1 = require("../metrics");
const signatures_1 = require("../utilities/signatures");
class UniqueViolationError extends Error {
    constructor() {
        super(...arguments);
        this.columns = [];
    }
}
function isUniqueViolationError(error) {
    var _a, _b;
    return ((_a = error) === null || _a === void 0 ? void 0 : _a.name) === 'UniqueViolationError' && ((_b = error) === null || _b === void 0 ? void 0 : _b.columns[0]) === 'enforce_one_row';
}
const throwMissingChannel = (channelId) => {
    throw new channel_1.ChannelError(channel_1.ChannelError.reasons.channelMissing, { channelId });
};
class Store {
    constructor(timingMetrics, skipEvmValidation) {
        this.timingMetrics = timingMetrics;
        this.skipEvmValidation = skipEvmValidation;
        if (timingMetrics) {
            this.getFirstParticipant = metrics_1.recordFunctionMetrics(this.getFirstParticipant);
            this.getOrCreateSigningAddress = metrics_1.recordFunctionMetrics(this.getOrCreateSigningAddress);
            this.lockApp = metrics_1.recordFunctionMetrics(this.lockApp);
            this.signState = metrics_1.recordFunctionMetrics(this.signState);
            this.getChannel = metrics_1.recordFunctionMetrics(this.getChannel);
            this.getStates = metrics_1.recordFunctionMetrics(this.getStates);
            this.getChannels = metrics_1.recordFunctionMetrics(this.getChannels);
            this.addObjective = metrics_1.recordFunctionMetrics(this.addObjective);
            this.pushMessage = metrics_1.recordFunctionMetrics(this.pushMessage);
            this.addSignedState = metrics_1.recordFunctionMetrics(this.addSignedState);
        }
    }
    async getFirstParticipant(knex) {
        const signingAddress = await this.getOrCreateSigningAddress(knex);
        return {
            participantId: signingAddress,
            signingAddress,
            destination: wallet_core_1.makeDestination(constants_1.HashZero),
        };
    }
    async getOrCreateSigningAddress(knex) {
        const randomWallet = ethers_1.ethers.Wallet.createRandom();
        try {
            const signingWallet = await signing_wallet_1.SigningWallet.query(knex)
                .insert({
                privateKey: randomWallet.privateKey,
                address: randomWallet.address,
            })
                .returning('*');
            return signingWallet.address;
        }
        catch (error) {
            if (isUniqueViolationError(error)) {
                return (await signing_wallet_1.SigningWallet.query(knex).first()).address;
            }
            throw error;
        }
    }
    async lockApp(knex, channelId, criticalCode, onChannelMissing = throwMissingChannel) {
        return knex.transaction(async (tx) => {
            const timer = metrics_1.timerFactory(this.timingMetrics, `lock app ${channelId}`);
            const channel = await timer('getting channel', async () => await channel_1.Channel.query(tx)
                .where({ channelId })
                .forUpdate()
                .first());
            if (!channel)
                return onChannelMissing(channelId);
            return timer('critical code', async () => criticalCode(tx, channel.protocolState));
        });
    }
    async signState(channelId, vars, tx) {
        const timer = metrics_1.timerFactory(this.timingMetrics, `signState ${channelId}`);
        let channel = await timer('getting channel', async () => channel_1.Channel.forId(channelId, tx));
        const state = state_utils_1.addHash({ ...channel.channelConstants, ...vars });
        await timer('validating freshness', async () => validateStateFreshness(state, channel));
        const signatureEntry = await timer('signing', async () => channel.signingWallet.signState(state));
        const signedState = { ...state, signatures: [signatureEntry] };
        channel = await timer('adding state', async () => this.addSignedState(channel, signedState, tx));
        const sender = channel.participants[channel.myIndex].participantId;
        const data = await timer('adding hash', async () => ({ signedStates: [signedState] }));
        const notMe = (_p, i) => i !== channel.myIndex;
        const outgoing = state.participants.filter(notMe).map(({ participantId: recipient }) => ({
            type: 'NotifyApp',
            notice: {
                method: 'MessageQueued',
                params: { sender, recipient, data },
            },
        }));
        const { channelResult } = channel;
        return { outgoing, channelResult };
    }
    async getChannel(channelId, txOrKnex) {
        var _a;
        return (_a = (await channel_1.Channel.forId(channelId, txOrKnex))) === null || _a === void 0 ? void 0 : _a.protocolState;
    }
    async getStates(channelId, txOrKnex) {
        const channel = await channel_1.Channel.forId(channelId, txOrKnex);
        if (!channel)
            throw new StoreError(StoreError.reasons.channelMissing);
        const { vars, channelConstants, protocolState: channelState } = channel;
        return { states: vars.map(ss => lodash_1.default.merge(ss, channelConstants)), channelState };
    }
    async getChannels(knex) {
        return (await channel_1.Channel.query(knex)).map(channel => channel.protocolState);
    }
    async pushMessage(message, tx) {
        var _a;
        for (const ss of message.signedStates || []) {
            await this.addSignedState(undefined, state_utils_1.addHash(ss), tx);
        }
        for (const o of message.objectives || []) {
            await this.addObjective(o, tx);
        }
        const stateChannelIds = ((_a = message.signedStates) === null || _a === void 0 ? void 0 : _a.map(ss => wallet_core_1.calculateChannelId(ss))) || [];
        const objectiveChannelIds = [];
        return stateChannelIds.concat(objectiveChannelIds);
    }
    async addObjective(_objective, _tx) {
        return Promise.resolve(Either_1.right(undefined));
    }
    async addSignedState(maybeChannel, signedState, tx) {
        const channelId = wallet_core_1.calculateChannelId(signedState);
        const timer = metrics_1.timerFactory(this.timingMetrics, `add signed state ${channelId}`);
        await timer('validating signatures', async () => validateSignatures(signedState));
        const channel = maybeChannel || (await timer('get channel', async () => getOrCreateChannel(signedState, tx)));
        if (!this.skipEvmValidation && channel.supported) {
            const { supported } = channel;
            if (!(await timer('validating transition', async () => evm_validator_1.validateTransitionWithEVM(supported, signedState, tx)))) {
                throw new StoreError('Invalid state transition', {
                    from: channel.supported,
                    to: signedState,
                });
            }
        }
        channel.vars = await timer('adding state', async () => addState(channel.vars, signedState));
        channel.vars = clearOldStates(channel.vars, channel.isSupported ? channel.support : undefined);
        await timer('validating invariants', async () => validateInvariants(channel.vars, channel.myAddress));
        const cols = { ...channel.channelConstants, vars: channel.vars };
        const result = await timer('updating', async () => channel_1.Channel.query(tx)
            .where({ channelId: channel.channelId })
            .update(cols)
            .returning('*')
            .first());
        return result;
    }
}
exports.Store = Store;
class StoreError extends wallet_error_1.WalletError {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.type = wallet_error_1.WalletError.errors.StoreError;
    }
}
StoreError.reasons = {
    duplicateTurnNums: 'multiple states with same turn number',
    notSorted: 'states not sorted',
    multipleSignedStates: 'Store signed multiple states for a single turn',
    invalidSignature: 'Invalid signature',
    notInChannel: 'Not in channel',
    staleState: 'Stale state',
    missingSigningKey: 'Missing a signing key',
    invalidTransition: 'Invalid state transition',
    channelMissing: 'Channel not found',
};
async function getOrCreateChannel(constants, txOrKnex) {
    const channelId = wallet_core_1.calculateChannelId(constants);
    let channel = await channel_1.Channel.query(txOrKnex)
        .where('channelId', channelId)
        .first();
    if (!channel) {
        const { address: signingAddress } = await getSigningWallet(constants, txOrKnex);
        const cols = { ...constants, vars: [], signingAddress };
        channel = channel_1.Channel.fromJson(cols);
        await channel_1.Channel.query(txOrKnex).insert(channel);
    }
    return channel;
}
async function getSigningWallet(channel, txOrKnex) {
    const addresses = channel.participants.map(p => p.signingAddress);
    const signingWallet = await signing_wallet_1.SigningWallet.query(txOrKnex)
        .whereIn('address', addresses)
        .first();
    if (!signingWallet) {
        throw new StoreError(StoreError.reasons.notInChannel);
    }
    return signingWallet;
}
function validateSignatures(signedState) {
    const { participants } = signedState;
    signedState.signatures.map(sig => {
        const signerAddress = signatures_1.fastRecoverAddress(signedState, sig.signature, signedState.stateHash);
        const validSignature = participants.find(p => p.signingAddress === signerAddress) && sig.signer === signerAddress;
        if (!validSignature) {
            throw new StoreError(StoreError.reasons.invalidSignature, { signedState, signature: sig });
        }
    });
}
function validateStateFreshness(signedState, channel) {
    if (channel.latestSignedByMe && channel.latestSignedByMe.turnNum >= signedState.turnNum) {
        throw new StoreError(StoreError.reasons.staleState);
    }
}
function validateInvariants(stateVars, myAddress) {
    var _a;
    const signedByMe = stateVars.filter(s => s.signatures.some(sig => sig.signer === myAddress));
    const groupedByTurnNum = lodash_1.default.groupBy(signedByMe, s => s.turnNum.toString());
    const multipleSignedByMe = (_a = lodash_1.default.map(groupedByTurnNum, s => s.length)) === null || _a === void 0 ? void 0 : _a.find(num => num > 1);
    if (multipleSignedByMe) {
        throw new StoreError(StoreError.reasons.multipleSignedStates);
    }
    const turnNums = lodash_1.default.map(stateVars, s => s.turnNum);
    const duplicateTurnNums = turnNums.some((t, i) => turnNums.indexOf(t) != i);
    if (duplicateTurnNums) {
        throw new StoreError(StoreError.reasons.duplicateTurnNums);
    }
    if (!isReverseSorted(turnNums)) {
        throw new StoreError(StoreError.reasons.notSorted);
    }
}
function isReverseSorted(arr) {
    const len = arr.length - 1;
    for (let i = 0; i < len; ++i) {
        if (arr[i] < arr[i + 1]) {
            return false;
        }
    }
    return true;
}
function addState(vars, signedState) {
    const clonedVariables = lodash_1.default.cloneDeep(vars);
    const { stateHash } = signedState;
    const existingStateIndex = clonedVariables.findIndex(v => v.stateHash === stateHash);
    if (existingStateIndex > -1) {
        const mergedSignatures = lodash_1.default.uniqBy(signedState.signatures.concat(clonedVariables[existingStateIndex].signatures), sig => sig.signature);
        clonedVariables[existingStateIndex].signatures = mergedSignatures;
        return clonedVariables;
    }
    else {
        return clonedVariables.concat({ ...signedState, stateHash });
    }
}
function clearOldStates(signedStates, support) {
    const sorted = lodash_1.default.reverse(lodash_1.default.sortBy(signedStates, s => s.turnNum));
    if (support && support.length > 0) {
        const { stateHash: firstSupportStateHash } = support[support.length - 1];
        const supportIndex = sorted.findIndex(sv => sv.stateHash === firstSupportStateHash);
        return sorted.slice(0, supportIndex + 1);
    }
    else {
        return sorted;
    }
}
//# sourceMappingURL=store.js.map