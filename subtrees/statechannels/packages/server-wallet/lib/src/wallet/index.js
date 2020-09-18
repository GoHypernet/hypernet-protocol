"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deserialize_1 = require("@statechannels/wallet-core/lib/src/serde/app-messages/deserialize");
const wallet_core_1 = require("@statechannels/wallet-core");
const Either = __importStar(require("fp-ts/lib/Either"));
const config_1 = require("@statechannels/wallet-core/lib/src/config");
const knex_1 = __importDefault(require("knex"));
const channel_1 = require("../models/channel");
const nonce_1 = require("../models/nonce");
const actions_1 = require("../protocols/actions");
const signing_wallet_1 = require("../models/signing-wallet");
const logger_1 = require("../logger");
const Application = __importStar(require("../protocols/application"));
const UpdateChannel = __importStar(require("../handlers/update-channel"));
const CloseChannel = __importStar(require("../handlers/close-channel"));
const JoinChannel = __importStar(require("../handlers/join-channel"));
const ChannelState = __importStar(require("../protocols/state"));
const wallet_error_1 = require("../errors/wallet-error");
const funding_1 = require("../models/funding");
const metrics_1 = require("../metrics");
const config_2 = require("../config");
const store_1 = require("./store");
class Wallet {
    constructor(walletConfig) {
        this.walletConfig = walletConfig;
        this.takeActions = async (channels) => {
            const outbox = [];
            const channelResults = [];
            let error = undefined;
            while (channels.length && !error) {
                await this.store.lockApp(this.knex, channels[0], async (tx) => {
                    const app = await this.store.getChannel(channels[0], tx);
                    if (!app) {
                        throw new Error('Channel not found');
                    }
                    const setError = async (e) => {
                        error = e;
                        await tx.rollback(error);
                    };
                    const markChannelAsDone = () => {
                        channels.shift();
                        channelResults.push(ChannelState.toChannelResult(app));
                    };
                    const doAction = async (action) => {
                        switch (action.type) {
                            case 'SignState': {
                                const { outgoing } = await this.store.signState(action.channelId, action, tx);
                                outgoing.map(n => outbox.push(n.notice));
                                return;
                            }
                            default:
                                throw 'Unimplemented';
                        }
                    };
                    const nextAction = metrics_1.recordFunctionMetrics(Application.protocol({ app }), this.walletConfig.timingMetrics);
                    if (!nextAction)
                        markChannelAsDone();
                    else if (actions_1.isOutgoing(nextAction)) {
                        outbox.push(nextAction.notice);
                        markChannelAsDone();
                    }
                    else {
                        try {
                            await doAction(nextAction);
                        }
                        catch (err) {
                            logger_1.logger.error({ err }, 'Error handling action');
                            await setError(err);
                        }
                    }
                });
            }
            return { outbox, error, channelResults };
        };
        this.knex = knex_1.default(config_2.extractDBConfigFromServerWalletConfig(walletConfig));
        this.store = new store_1.Store(walletConfig.timingMetrics, walletConfig.skipEvmValidation);
        this.getParticipant = this.getParticipant.bind(this);
        this.updateChannelFunding = this.updateChannelFunding.bind(this);
        this.getSigningAddress = this.getSigningAddress.bind(this);
        this.createChannel = this.createChannel.bind(this);
        this.joinChannel = this.joinChannel.bind(this);
        this.updateChannel = this.updateChannel.bind(this);
        this.closeChannel = this.closeChannel.bind(this);
        this.getChannels = this.getChannels.bind(this);
        this.getState = this.getState.bind(this);
        this.pushMessage = this.pushMessage.bind(this);
        this.takeActions = this.takeActions.bind(this);
        if (walletConfig.timingMetrics) {
            if (!walletConfig.metricsOutputFile) {
                throw Error('You must define a metrics output file');
            }
            metrics_1.setupMetrics(this.knex, walletConfig.metricsOutputFile);
        }
    }
    async destroy() {
        await this.knex.destroy();
    }
    async syncChannel({ channelId }) {
        const { states, channelState } = await this.store.getStates(channelId, this.knex);
        const { participants, myIndex } = channelState;
        const peers = participants.map(p => p.participantId).filter((_, idx) => idx !== myIndex);
        const sender = participants[myIndex].participantId;
        return {
            outbox: peers.map(recipient => ({
                method: 'MessageQueued',
                params: {
                    recipient,
                    sender,
                    data: {
                        signedStates: states,
                        requests: [{ type: 'GetChannel', channelId }],
                    },
                },
            })),
            channelResult: ChannelState.toChannelResult(channelState),
        };
    }
    async getParticipant() {
        let participant = undefined;
        try {
            participant = await this.store.getFirstParticipant(this.knex);
        }
        catch (e) {
            if (wallet_error_1.isWalletError(e))
                logger_1.logger.error('Wallet failed to get a participant', e);
            else
                throw e;
        }
        return participant;
    }
    async updateChannelFunding({ channelId, token, amount, }) {
        const assetHolder = wallet_core_1.assetHolderAddress(token || wallet_core_1.Zero) || config_1.ETH_ASSET_HOLDER_ADDRESS;
        await funding_1.Funding.updateFunding(this.knex, channelId, wallet_core_1.BN.from(amount), assetHolder);
        const { channelResults, outbox } = await this.takeActions([channelId]);
        return { outbox, channelResult: channelResults[0] };
    }
    async getSigningAddress() {
        return await this.store.getOrCreateSigningAddress(this.knex);
    }
    async createChannel(args) {
        const { participants, appDefinition, appData, allocations } = args;
        const outcome = deserialize_1.deserializeAllocations(allocations);
        const channelNonce = await nonce_1.Nonce.next(this.knex, participants.map(p => p.signingAddress));
        const channelConstants = {
            channelNonce,
            participants: participants.map(wallet_core_1.convertToParticipant),
            chainId: '0x01',
            challengeDuration: 9001,
            appDefinition,
        };
        const vars = [];
        const callback = async (tx) => {
            var _a;
            const signingAddress = (_a = (await signing_wallet_1.SigningWallet.query(tx).first())) === null || _a === void 0 ? void 0 : _a.address;
            const cols = { ...channelConstants, vars, signingAddress };
            const { channelId } = await channel_1.Channel.query(tx).insert(cols);
            const { outgoing, channelResult } = await this.store.signState(channelId, {
                ...channelConstants,
                turnNum: 0,
                isFinal: false,
                appData,
                outcome,
            }, tx);
            return { outbox: outgoing.map(n => n.notice), channelResult };
        };
        return this.knex.transaction(callback);
    }
    async joinChannel({ channelId }) {
        const criticalCode = async (tx, channel) => {
            const nextState = getOrThrow(JoinChannel.joinChannel({ channelId }, channel));
            const { outgoing, channelResult } = await this.store.signState(channelId, nextState, tx);
            return { outbox: outgoing.map(n => n.notice), channelResult };
        };
        const handleMissingChannel = () => {
            throw new JoinChannel.JoinChannelError(JoinChannel.JoinChannelError.reasons.channelNotFound, {
                channelId,
            });
        };
        const { outbox, channelResult } = await this.store.lockApp(this.knex, channelId, criticalCode, handleMissingChannel);
        const { outbox: nextOutbox, channelResults } = await this.takeActions([channelId]);
        const nextChannelResult = channelResults.find(c => c.channelId === channelId) || channelResult;
        return { outbox: outbox.concat(nextOutbox), channelResult: nextChannelResult };
    }
    async updateChannel({ channelId, allocations, appData }) {
        const timer = metrics_1.timerFactory(this.walletConfig.timingMetrics, `updateChannel ${channelId}`);
        const handleMissingChannel = () => {
            throw new UpdateChannel.UpdateChannelError(UpdateChannel.UpdateChannelError.reasons.channelNotFound, { channelId });
        };
        const criticalCode = async (tx, channel) => {
            const outcome = metrics_1.recordFunctionMetrics(deserialize_1.deserializeAllocations(allocations), this.walletConfig.timingMetrics);
            const nextState = getOrThrow(metrics_1.recordFunctionMetrics(UpdateChannel.updateChannel({ channelId, appData, outcome }, channel), this.walletConfig.timingMetrics));
            const { outgoing, channelResult } = await timer('signing state', async () => this.store.signState(channelId, nextState, tx));
            return { outbox: outgoing.map(n => n.notice), channelResult };
        };
        return this.store.lockApp(this.knex, channelId, criticalCode, handleMissingChannel);
    }
    async closeChannel({ channelId }) {
        const handleMissingChannel = () => {
            throw new CloseChannel.CloseChannelError(CloseChannel.CloseChannelError.reasons.channelMissing, { channelId });
        };
        const criticalCode = async (tx, channel) => {
            const nextState = getOrThrow(CloseChannel.closeChannel(channel));
            const { outgoing, channelResult } = await this.store.signState(channelId, nextState, tx);
            return { outbox: outgoing.map(n => n.notice), channelResult };
        };
        return this.store.lockApp(this.knex, channelId, criticalCode, handleMissingChannel);
    }
    async getChannels() {
        const channelStates = await this.store.getChannels(this.knex);
        return {
            channelResults: channelStates.map(ChannelState.toChannelResult),
            outbox: [],
        };
    }
    async getState({ channelId }) {
        try {
            const { channelResult } = await channel_1.Channel.forId(channelId, this.knex);
            return {
                channelResult,
                outbox: [],
            };
        }
        catch (err) {
            logger_1.logger.error({ err }, 'Could not get channel');
            throw err;
        }
    }
    async pushMessage(message) {
        const knex = this.knex;
        const store = this.store;
        function handleRequest(outbox) {
            return async ({ channelId }) => {
                const { states: signedStates, channelState } = await store.getStates(channelId, knex);
                const { participants, myIndex } = channelState;
                const peers = participants.map(p => p.participantId).filter((_, idx) => idx !== myIndex);
                const { participantId: sender } = participants[myIndex];
                peers.map(recipient => {
                    outbox.push({
                        method: 'MessageQueued',
                        params: {
                            recipient,
                            sender,
                            data: { signedStates },
                        },
                    });
                });
            };
        }
        const channelIds = await channel_1.Channel.transaction(this.knex, async (tx) => {
            return await this.store.pushMessage(message, tx);
        });
        const { channelResults, outbox } = await this.takeActions(channelIds);
        if (message.requests && message.requests.length > 0)
            await Promise.all(message.requests.map(handleRequest(outbox)));
        return { outbox, channelResults };
    }
    onNotification(_cb) {
        throw 'Unimplemented';
    }
    attachChainService(provider) {
        provider.attachChannelWallet(this);
    }
}
exports.Wallet = Wallet;
function getOrThrow(result) {
    return Either.getOrElseW((err) => {
        throw err;
    })(result);
}
exports.getOrThrow = getOrThrow;
//# sourceMappingURL=index.js.map