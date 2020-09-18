import { ChannelProviderInterface } from '@statechannels/iframe-channel-provider';
import { PushMessageResult, ChannelResult, Participant, DomainBudget, ChannelUpdatedNotification, ChannelProposedNotification, BudgetUpdatedNotification, Message, MessageQueuedNotification, FundingStrategy } from '@statechannels/client-api-schema';
import { ReplaySubject } from 'rxjs';
import { BrowserChannelClientInterface, UnsubscribeFunction, TokenAllocations } from './types';
/**
 * Class that wraps the JSON-RPC interface of \@statechannels/iframe-channel-provider
 *
 * @remarks
 * This class exposes a convenient API feturing event emitters and async methods returning Promises.
 * Together with \@statechannels/iframe-channel-provider, it allows a Dapp to speak to the statechannels wallet.
 *
 * @beta
 */
export declare class ChannelClient implements BrowserChannelClientInterface {
    /**
     *  E.g. instance of the \@statechannels/iframe-channel-provider class, suitably configured
     */
    readonly provider: ChannelProviderInterface;
    /**
     * rxjs Observable which emits ChannelResults for all channels of interest
     */
    channelState: ReplaySubject<ChannelResult>;
    /**
     * Get my state channel (ephemeral) signingAddress
     */
    get signingAddress(): string | undefined;
    /**
     * Get my destination address
     *
     * @remarks
     * E.g. an address in MetaMask / other Ethereum wallet
     */
    get destinationAddress(): string | undefined;
    /**
     * Get the wallet version
     */
    get walletVersion(): string | undefined;
    /**
     * Create a new instance of the Channel Client
     *
     * @remarks
     * It is possible to pass in a {@link @statechannels/channel-client#FakeChannelProvider | fake channel provider},
     * which simulates the behaviour of a wallet without requiring an iframe or browser. Useful for development.
     *
     * @param provider - An instance of the \@statechannels/iframe-channel-provider class, suitably configured
     */
    constructor(provider: ChannelProviderInterface);
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
    onMessageQueued(callback: (result: MessageQueuedNotification['params']) => void): UnsubscribeFunction;
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
    onChannelUpdated(callback: (result: ChannelUpdatedNotification['params']) => void): UnsubscribeFunction;
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
    onChannelProposed(callback: (result: ChannelProposedNotification['params']) => void): UnsubscribeFunction;
    /**
     * Registers callback that will fire when a domain budget is updated.
     *
     * @param callback - A function that accepts a BudgetUpdatedNotification.
     * @returns A function that will unregister the callback when invoked.
     *
     */
    onBudgetUpdated(callback: (result: BudgetUpdatedNotification['params']) => void): UnsubscribeFunction;
    /**
     * Requests the latest state for all channels.
     *
     * @param includeClosed - If true, closed channels will be included in the response.
     * @returns A promise that resolves to an array of ChannelResults.
     *
     */
    getChannels(includeClosed: boolean): Promise<ChannelResult[]>;
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
    createChannel(participants: Participant[], allocations: TokenAllocations, appDefinition: string, appData: string, fundingStrategy: FundingStrategy): Promise<ChannelResult>;
    /**
     * Join a proposed state channel
     *
     * @param channelId - id for the state channel
  
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    joinChannel(channelId: string): Promise<ChannelResult>;
    /**
     * Updates the state of a channel
     *
     * @param channelId - id for the state channel
     * @param allocations - Updated allocation of funds for this channel
     * @param appData - Updated application data for this channel
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    updateChannel(channelId: string, allocations: TokenAllocations, appData: string): Promise<ChannelResult>;
    /**
     * Requests the latest state for a channel
     *
     * @param channelId - id for the state channel
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    getState(channelId: string): Promise<ChannelResult>;
    /**
     * Requests a challenge for a channel
     *
     * @param channelId - id for the state channel
     * @returns A promise that resolves to a ChannelResult.
     *
     * @beta
     */
    challengeChannel(channelId: string): Promise<ChannelResult>;
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
    closeChannel(channelId: string): Promise<ChannelResult>;
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
    pushMessage(message: Message): Promise<PushMessageResult>;
    /**
     * Requests approval for a new budget for this domain, as well as for an appropriately funded ledger channel with the hub
     * @param receiveCapacity -  Amount for me in the ledger channel
     * @param sendCapacity - Amount for the hub in the ledger channel
     * @param hubAddress - Address for the hub,
     * @param hubOutcomeAddress - Ethereum account for the hub
     * @returns A promise that resolves to a DomainBudget
     *
     */
    approveBudgetAndFund(receiveCapacity: string, sendCapacity: string, hubAddress: string, hubOutcomeAddress: string): Promise<DomainBudget>;
    /**
     * Requests the latest budget for this domain
     *
     * @param hubParticipantId - The id of a state channel hub
     * @returns A promise that resolves to a ChannelResult.
     *
     */
    getBudget(hubParticipantId: string): Promise<DomainBudget | {}>;
    /**
     * Requests the funds to be withdrawn from this domain's ledger channel
     *
     * @param hubAddress - The address of a state channel hub
     * @param hubOutcomeAddress - An ethereum account that the hub's funds will be paid out to TODO this doesn't make sense
     * @returns A promise that resolves to a DomainBudget.
     *
     */
    closeAndWithdraw(hubParticipantId: string): Promise<DomainBudget | {}>;
}
//# sourceMappingURL=channel-client.d.ts.map