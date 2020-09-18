"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const constants_1 = require("../tests/constants");
const constants_2 = require("./constants");
/**
 * Class that wraps the JSON-RPC interface of \@statechannels/iframe-channel-provider
 *
 * @remarks
 * This class exposes a convenient API feturing event emitters and async methods returning Promises.
 * Together with \@statechannels/iframe-channel-provider, it allows a Dapp to speak to the statechannels wallet.
 *
 * @beta
 */
class ChannelClient {
    /**
     * Create a new instance of the Channel Client
     *
     * @remarks
     * It is possible to pass in a {@link @statechannels/channel-client#FakeChannelProvider | fake channel provider},
     * which simulates the behaviour of a wallet without requiring an iframe or browser. Useful for development.
     *
     * @param provider - An instance of the \@statechannels/iframe-channel-provider class, suitably configured
     */
    constructor(provider) {
        this.provider = provider;
        this.channelState = new rxjs_1.ReplaySubject(1);
        this.provider.on('ChannelUpdated', (result) => this.channelState.next(result));
    }
    /**
     * Get my state channel (ephemeral) signingAddress
     */
    get signingAddress() {
        return this.provider.signingAddress;
    }
    /**
     * Get my destination address
     *
     * @remarks
     * E.g. an address in MetaMask / other Ethereum wallet
     */
    get destinationAddress() {
        return this.provider.destinationAddress;
    }
    /**
     * Get the wallet version
     */
    get walletVersion() {
        return this.provider.walletVersion;
    }
    /**
     * Registers a callback that will fire when an outbound message is ready to be dispatched.
     *
     * @remarks
     * This method should be hooked up to your applications's messaging layer.
     *
     * @param callback - An function that accepts a MessageQueuedNotification.
     * @returns A function that will unregister the callback when invoked
     *
     */
    onMessageQueued(callback) {
        this.provider.on('MessageQueued', callback);
        return () => {
            this.provider.off('MessageQueued', callback);
        };
    }
    /**
     * Registers a callback that will fire when a state channel is updated.
     *
     * @remarks
     *
     * The ChannelUpdated event is emitted when any of the following occurs:
     * <ul>
     * <li> A state is received via {@link @statechannels/channel-client#ChannelClient.updateChannel| updateChannel()}</li>
     * <li> A state is received from another participant via {@link @statechannels/channel-client#ChannelClient.pushMessage | pushMessage()}</li>
     * <li> Changes to the state of the blockchain are detected (e.g funding or challenges)</li>
     * </ul>
     *
     * In the first two cases, this notification is only triggered when the wallet verifies that the state causes the 'top state' to change.
     *
     * The 'top state' is the state drawn from the set of supported states that has the highest turn number.
     *
     * (We have glossed over / left undefined what happens in the case where there is more than one top state).
     *
     * In particular, this means that
     * <ul>
     * <li> incorrectly formatted</li>
     * <li> incorrectly signed</li>
     * <li> otherwise unsupported</li>
     * <li> out-of-date</li>
     * </ul>
     *
     * states will not trigger this notification. Similarly, a countersignature on an already-supported state will not trigger this notification <b>unless</b> it means that a conclusion proof is now available.
     *
     * @param callback - A function that accepts a ChannelUpdatedNotification.
     * @returns A function that will unregister the callback when invoked.
     *
     */
    onChannelUpdated(callback) {
        return this.channelState.subscribe(callback).unsubscribe;
    }
    /**
     * Registers a callback that will fire when a state channel is proposed.
     *
     * @remarks
     *
     * Triggered when the wallet receives a message containing a new channel.
     * The App might respond by calling {@link @statechannels/channel-client#ChannelClient.joinChannel| joinChannel()}.
     * @param callback - A function that accepts a ChannelProposedNotification.
     * @returns A function that will unregister the callback when invoked.
     *
     */
    onChannelProposed(callback) {
        this.provider.on('ChannelProposed', callback);
        return () => {
            this.provider.off('ChannelProposed', callback);
        };
    }
    /**
     * Registers callback that will fire when a domain budget is updated.
     *
     * @param callback - A function that accepts a BudgetUpdatedNotification.
     * @returns A function that will unregister the callback when invoked.
     *
     */
    onBudgetUpdated(callback) {
        this.provider.on('BudgetUpdated', callback);
        return () => {
            this.provider.off('BudgetUpdated', callback);
        };
    }
    /**
     * Requests the latest state for all channels.
     *
     * @param includeClosed - If true, closed channels will be included in the response.
     * @returns A promise that resolves to an array of ChannelResults.
     *
     */
    getChannels(includeClosed) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('GetChannels', { includeClosed });
        });
    }
    /**
     * Requests a new channel to be created
     *
     * @param participants - Array of Participants for this channel
     * @param allocations - Initial allocation of funds for this channel
     * @param appDefinition - Address of ForceMoveApp deployed on chain
     * @param appData - Initial application data for this channel
     * @param fundingStrategy - Direct, Ledger or Virtual funding
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    createChannel(participants, allocations, appDefinition, appData, fundingStrategy) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('CreateChannel', {
                participants,
                allocations,
                appDefinition,
                appData,
                fundingStrategy
            });
        });
    }
    /**
     * Join a proposed state channel
     *
     * @param channelId - id for the state channel
  
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    joinChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('JoinChannel', { channelId });
        });
    }
    /**
     * Updates the state of a channel
     *
     * @param channelId - id for the state channel
     * @param allocations - Updated allocation of funds for this channel
     * @param appData - Updated application data for this channel
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    updateChannel(channelId, allocations, appData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('UpdateChannel', {
                channelId,
                allocations,
                appData
            });
        });
    }
    /**
     * Requests the latest state for a channel
     *
     * @param channelId - id for the state channel
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    getState(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('GetState', { channelId });
        });
    }
    /**
     * Requests a challenge for a channel
     *
     * @param channelId - id for the state channel
     * @returns A promise that resolves to a ChannelResult.
     *
     * @beta
     */
    challengeChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('ChallengeChannel', {
                channelId
            });
        });
    }
    /**
     * Requests a close for a channel
     *
     * @remarks
     *
     * The wallet will respond to this request with an error if it is not your turn.
     * If it is your turn, the wallet will respond as soon as it has signed an `isFinal` state, and the channel is updated to `closing` status.
     * The channel may later update to `closed` status only when other channel participants have responded in kind: this can be detected by listening to {@link @statechannels/channel-client#ChannelClient.onChannelUpdated | Channel Updated} events and filtering on the channel status.
     *
     * @param channelId - id for the state channel
     * @returns A promise that resolves to a ChannelResult.
     *
     * @beta
     */
    closeChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('CloseChannel', { channelId });
        });
    }
    /**
     * Accepts inbound messages from other state channel participants.
     *
     * @remarks
     * This method should be hooked up to your applications's messaging layer.
     *
     * @param message - An inbound message.
     * @param y - The second input number
     * @returns A promise that resolves to a PushMessageResult
     *
     */
    pushMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('PushMessage', message);
        });
    }
    /**
     * Requests approval for a new budget for this domain, as well as for an appropriately funded ledger channel with the hub
     * @param receiveCapacity -  Amount for me in the ledger channel
     * @param sendCapacity - Amount for the hub in the ledger channel
     * @param hubAddress - Address for the hub,
     * @param hubOutcomeAddress - Ethereum account for the hub
     * @returns A promise that resolves to a DomainBudget
     *
     */
    approveBudgetAndFund(receiveCapacity, sendCapacity, hubAddress, hubOutcomeAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('ApproveBudgetAndFund', {
                requestedReceiveCapacity: receiveCapacity,
                requestedSendCapacity: sendCapacity,
                token: constants_1.ETH_TOKEN_ADDRESS,
                playerParticipantId: this.signingAddress,
                hub: {
                    participantId: constants_2.HUB.participantId,
                    signingAddress: hubAddress,
                    destination: hubOutcomeAddress
                }
            });
        });
    }
    /**
     * Requests the latest budget for this domain
     *
     * @param hubParticipantId - The id of a state channel hub
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    getBudget(hubParticipantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('GetBudget', { hubParticipantId });
        });
    }
    /**
     * Requests the funds to be withdrawn from this domain's ledger channel
     *
     * @param hubAddress - The address of a state channel hub
     * @param hubOutcomeAddress - An ethereum account that the hub's funds will be paid out to TODO this doesn't make sense
     * @returns A promise that resolves to a DomainBudget.
     *
     */
    closeAndWithdraw(hubParticipantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.send('CloseAndWithdraw', {
                hubParticipantId
            });
        });
    }
}
exports.ChannelClient = ChannelClient;
//# sourceMappingURL=channel-client.js.map