"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const objection_1 = require("objection");
const lodash_1 = __importDefault(require("lodash"));
const state_1 = require("../protocols/state");
const wallet_error_1 = require("../errors/wallet-error");
const signing_wallet_1 = require("./signing-wallet");
const funding_1 = require("./funding");
exports.REQUIRED_COLUMNS = {
    chainId: 'chainId',
    appDefinition: 'appDefinition',
    channelNonce: 'channelNonce',
    challengeDuration: 'challengeDuration',
    participants: 'participants',
    vars: 'vars',
};
exports.COMPUTED_COLUMNS = {
    channelId: 'channelId',
    signingAddress: 'signingAddress',
};
exports.CHANNEL_COLUMNS = {
    ...exports.REQUIRED_COLUMNS,
    ...exports.COMPUTED_COLUMNS,
};
class Channel extends objection_1.Model {
    static get jsonSchema() {
        return {
            type: 'object',
            required: Object.keys(exports.REQUIRED_COLUMNS),
            properties: {
                chainId: {
                    type: 'string',
                },
            },
        };
    }
    static async forId(channelId, txOrKnex) {
        const result = Channel.query(txOrKnex)
            .where({ channelId })
            .withGraphFetched('signingWallet')
            .withGraphFetched('funding')
            .first();
        if (!result)
            throw new ChannelError(ChannelError.reasons.channelMissing, { channelId });
        return result;
    }
    $toDatabaseJson() {
        return lodash_1.default.pick(super.$toDatabaseJson(), Object.keys(exports.CHANNEL_COLUMNS));
    }
    $beforeValidate(jsonSchema, json, _opt) {
        super.$beforeValidate(jsonSchema, json, _opt);
        return jsonSchema;
    }
    $beforeInsert(ctx) {
        var _a;
        super.$beforeInsert(ctx);
        const correctChannelId = wallet_core_1.calculateChannelId(this.channelConstants);
        this.channelId = (_a = this.channelId, (_a !== null && _a !== void 0 ? _a : correctChannelId));
        if (this.channelId !== correctChannelId) {
            throw new ChannelError(ChannelError.reasons.invalidChannelId, {
                given: this.channelId,
                correctChannelId,
            });
        }
        this.vars.map(sv => {
            var _a;
            const correctHash = wallet_core_1.hashState({ ...this.channelConstants, ...sv });
            sv.stateHash = (_a = sv.stateHash, (_a !== null && _a !== void 0 ? _a : correctHash));
            if (sv.stateHash !== correctHash) {
                throw new ChannelError(ChannelError.reasons.incorrectHash, {
                    given: sv.stateHash,
                    correctHash,
                });
            }
        });
    }
    get protocolState() {
        const { channelId, myIndex, supported, latest, latestSignedByMe, support, participants } = this;
        const funding = (assetHolder) => {
            const result = this.funding.find(f => f.assetHolder === assetHolder);
            return result ? result.amount : wallet_core_1.Zero;
        };
        return {
            myIndex: myIndex,
            participants,
            channelId,
            supported,
            support,
            latest,
            latestSignedByMe,
            funding,
        };
    }
    get channelResult() {
        return state_1.toChannelResult(this.protocolState);
    }
    get myIndex() {
        return this.participants.findIndex(p => p.signingAddress === this.signingAddress);
    }
    get channelConstants() {
        const { channelNonce, challengeDuration, chainId, participants, appDefinition } = this;
        return {
            channelNonce,
            challengeDuration,
            chainId,
            participants,
            appDefinition,
        };
    }
    get sortedStates() {
        return this.vars.map(s => ({ ...this.channelConstants, ...s }));
    }
    get myAddress() {
        return this.participants[this.myIndex].signingAddress;
    }
    get myTurn() {
        if (this.supported) {
            return (this.supported.turnNum + 1) % this.participants.length === this.myIndex;
        }
        else {
            return this.myIndex === 0;
        }
    }
    get isSupported() {
        return !!this._supported;
    }
    get support() {
        return this._support.map(s => ({ ...this.channelConstants, ...s }));
    }
    get hasConclusionProof() {
        return this.isSupported && this.support.every(s => s.isFinal);
    }
    get supported() {
        const vars = this._supported;
        if (vars)
            return { ...this.channelConstants, ...vars };
        else
            return undefined;
    }
    get isSupportedByMe() {
        return !!this._latestSupportedByMe;
    }
    get latestSignedByMe() {
        return this._latestSupportedByMe
            ? { ...this.channelConstants, ...this._latestSupportedByMe }
            : undefined;
    }
    get latest() {
        return { ...this.channelConstants, ...this.signedStates[0] };
    }
    get _supported() {
        const latestSupport = this._support;
        return latestSupport.length === 0 ? undefined : latestSupport[0];
    }
    get signedByMe() {
        return this.signedStates.filter(s => this.mySignature(s.signatures));
    }
    get _latestSupportedByMe() {
        return this.signedByMe[0];
    }
    get signedStates() {
        return this.vars.map(s => ({ ...this.channelConstants, ...s }));
    }
    mySignature(signatures) {
        return signatures.some(sig => sig.signer === this.myAddress);
    }
    nParticipants() {
        return this.participants.length;
    }
    get _support() {
        let support = [];
        let participantsWhoHaveNotSigned = new Set(this.participants.map(p => p.signingAddress));
        let previousState;
        for (const signedState of this.signedStates) {
            if (previousState && !this.validChain(signedState, previousState)) {
                support = [];
                participantsWhoHaveNotSigned = new Set(this.participants.map(p => p.signingAddress));
            }
            const moverIndex = signedState.turnNum % this.nParticipants();
            const moverForThisTurn = this.participants[moverIndex].signingAddress;
            if (signedState.signatures.some(s => s.signer === moverForThisTurn)) {
                support.push(signedState);
                for (const signature of signedState.signatures) {
                    participantsWhoHaveNotSigned.delete(signature.signer);
                    if (participantsWhoHaveNotSigned.size === 0) {
                        return support;
                    }
                }
            }
            previousState = signedState;
        }
        return [];
    }
    validChain(firstState, secondState) {
        if (firstState.turnNum + 1 !== secondState.turnNum) {
            return false;
        }
        if (secondState.isFinal) {
            return wallet_core_1.outcomesEqual(firstState.outcome, secondState.outcome);
        }
        if (secondState.turnNum < 2 * this.nParticipants()) {
            return (wallet_core_1.outcomesEqual(firstState.outcome, secondState.outcome) &&
                firstState.appData === secondState.appData);
        }
        return true;
    }
}
exports.Channel = Channel;
Channel.tableName = 'channels';
Channel.relationMappings = {
    signingWallet: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: signing_wallet_1.SigningWallet,
        join: {
            from: 'channels.signingAddress',
            to: 'signing_wallets.address',
        },
    },
    funding: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: funding_1.Funding,
        join: {
            from: 'channels.channelId',
            to: 'funding.channelId',
        },
    },
};
Channel.jsonAttributes = ['vars', 'participants'];
class ChannelError extends wallet_error_1.WalletError {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.type = wallet_error_1.WalletError.errors.ChannelError;
    }
}
exports.ChannelError = ChannelError;
ChannelError.reasons = {
    invalidChannelId: 'Invalid channel id',
    incorrectHash: 'Incorrect hash',
    channelMissing: 'No channel found with id.',
};
//# sourceMappingURL=channel.js.map