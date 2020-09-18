/**
 * @packageDocumentation Make requests to a statechannels wallet using async methods
 *
 * @remarks
 * The {@link @statechannels/channel-client#ChannelClient | ChannelClient} class wraps an object implementing the {@link @statechannels/iframe-channel-provider#ChannelProviderInterface | Channel Provider Interface} and exposes methods which return Promises. This object could be a {@link @statechannels/channel-client#FakeChannelProvider | Fake Channel Provider}.
 */

import { Allocation } from '@statechannels/client-api-schema';
import { ApproveBudgetAndFundParams } from '@statechannels/client-api-schema';
import { BudgetUpdatedNotification } from '@statechannels/client-api-schema';
import { ChannelProposedNotification } from '@statechannels/client-api-schema';
import { ChannelProviderInterface } from '@statechannels/iframe-channel-provider';
import { ChannelResult } from '@statechannels/client-api-schema';
import { ChannelUpdatedNotification } from '@statechannels/client-api-schema';
import { CloseAndWithdrawParams } from '@statechannels/client-api-schema';
import { CloseChannelParams } from '@statechannels/client-api-schema';
import { CreateChannelParams } from '@statechannels/client-api-schema';
import { DomainBudget } from '@statechannels/client-api-schema';
import { ErrorCodes } from '@statechannels/client-api-schema';
import EventEmitter from 'eventemitter3';
import { EventType } from '@statechannels/iframe-channel-provider';
import { FundingStrategy } from '@statechannels/client-api-schema';
import { GetBudgetParams } from '@statechannels/client-api-schema';
import { GetStateParams } from '@statechannels/client-api-schema';
import { IFrameChannelProviderInterface } from '@statechannels/iframe-channel-provider';
import { JoinChannelParams } from '@statechannels/client-api-schema';
import { Message } from '@statechannels/client-api-schema';
import { MessageQueuedNotification } from '@statechannels/client-api-schema';
import { OffType } from '@statechannels/iframe-channel-provider';
import { OnType } from '@statechannels/iframe-channel-provider';
import { Participant } from '@statechannels/client-api-schema';
import { PushMessageResult } from '@statechannels/client-api-schema';
import { ReplaySubject } from 'rxjs';
import { UpdateChannelParams } from '@statechannels/client-api-schema';
import { WalletJsonRpcAPI } from '@statechannels/iframe-channel-provider';

/**
 * @beta
 */
export declare interface BrowserChannelClientInterface extends ChannelClientInterface {
    onBudgetUpdated: (callback: (result: DomainBudget) => void) => UnsubscribeFunction;
    approveBudgetAndFund(playerAmount: string, hubAmount: string, hubAddress: string, hubOutcomeAddress: string): Promise<DomainBudget>;
    closeAndWithdraw(hubParticipantId: string): Promise<DomainBudget | {}>;
    getBudget(hubAddress: string): Promise<DomainBudget | {}>;
}

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

/**
 * @beta
 */
export declare interface ChannelClientInterface {
    onMessageQueued: (callback: (message: Message) => void) => UnsubscribeFunction;
    onChannelUpdated: (callback: (result: ChannelResult) => void) => UnsubscribeFunction;
    onChannelProposed: (callback: (result: ChannelResult) => void) => UnsubscribeFunction;
    provider: ChannelProviderInterface;
    channelState: ReplaySubject<ChannelResult>;
    walletVersion?: string;
    signingAddress?: string;
    destinationAddress?: string;
    pushMessage: (message: Message) => Promise<PushMessageResult>;
    createChannel: (participants: Participant[], allocations: Allocation[], appDefinition: string, appData: string, fundingStrategy: FundingStrategy) => Promise<ChannelResult>;
    joinChannel: (channelId: string) => Promise<ChannelResult>;
    updateChannel: (channelId: string, allocations: Allocation[], appData: string) => Promise<ChannelResult>;
    getState: (channelId: string) => Promise<ChannelResult>;
    challengeChannel: (channelId: string) => Promise<ChannelResult>;
    closeChannel: (channelId: string) => Promise<ChannelResult>;
    getChannels(includeClosed: boolean): Promise<ChannelResult[]>;
}

declare type ChannelId = string;
export { ChannelResult }

/**
 * @beta
 */
export declare const ErrorCode: ErrorCodes;

/**
 * @beta
 */
export declare const EthereumNotEnabledErrorCode: 100;

/**
 * Extension of FakeChannelProvider which adds support for browser-specific wallet API
 * methods such as EnableEthereum and ApproveBudgetAndFund. Also, exposes the browser
 * specific provider method enable() (i.e., for MetaMask approval).
 */
/**
 * @beta
 */
export declare class FakeBrowserChannelProvider extends FakeChannelProvider implements IFrameChannelProviderInterface {
    budget: DomainBudget;
    mountWalletComponent(url?: string): Promise<void>;
    enable(): Promise<void>;
    send<M extends keyof WalletJsonRpcAPI>(method: M, params: WalletJsonRpcAPI[M]['request']['params']): Promise<WalletJsonRpcAPI[M]['response']['result']>;
    notifyAppBudgetUpdated(data: DomainBudget): void;
    approveBudgetAndFund(params: ApproveBudgetAndFundParams): Promise<DomainBudget>;
    closeAndWithdraw(_params: CloseAndWithdrawParams): Promise<{
        success: boolean;
    }>;
    getBudget(_params: GetBudgetParams): Promise<DomainBudget>;
}

export declare class FakeChannelProvider implements ChannelProviderInterface {
    signingAddress?: string;
    destinationAddress?: string;
    walletVersion?: string;
    protected events: EventEmitter<EventType>;
    protected url: string;
    playerIndex: Record<ChannelId, 0 | 1>;
    opponentIndex: Record<ChannelId, 0 | 1>;
    internalAddress: string;
    opponentAddress: Record<ChannelId, string>;
    latestState: Record<ChannelId, ChannelResult>;
    send<M extends keyof WalletJsonRpcAPI>(method: M, params: WalletJsonRpcAPI[M]['request']['params']): Promise<WalletJsonRpcAPI[M]['response']['result']>;
    on: OnType;
    off: OffType;
    subscribe(): Promise<string>;
    unsubscribe(): Promise<boolean>;
    setState(state: ChannelResult): void;
    setAddress(address: string): void;
    updatePlayerIndex(channelId: ChannelId, playerIndex: 0 | 1): void;
    protected getAddress(): string;
    protected getPlayerIndex(channelId: ChannelId): number;
    getOpponentIndex(channelId: ChannelId): number;
    verifyTurnNum(channelId: ChannelId, turnNum: number): Promise<void>;
    findChannel(channelId: string): ChannelResult;
    protected createChannel(params: CreateChannelParams): Promise<ChannelResult>;
    protected joinChannel(params: JoinChannelParams): Promise<ChannelResult>;
    protected getState({ channelId }: GetStateParams): Promise<ChannelResult>;
    protected updateChannel(params: UpdateChannelParams): Promise<ChannelResult>;
    protected closeChannel(params: CloseChannelParams): Promise<ChannelResult>;
    protected notifyAppChannelUpdated(data: ChannelResult): void;
    protected notifyAppBudgetUpdated(data: DomainBudget): void;
    protected notifyOpponent(data: ChannelResult, notificationType: string): void;
    protected isChannelResult(data: unknown): data is ChannelResult;
    protected pushMessage(params: Message): Promise<PushMessageResult>;
}

/**
 * @beta
 */
export declare type TokenAllocations = Allocation[];

/**
 * @beta
 */
export declare type UnsubscribeFunction = () => void;

/**
 * @beta
 */
export declare const UserDeclinedErrorCode: 200;

export { }
