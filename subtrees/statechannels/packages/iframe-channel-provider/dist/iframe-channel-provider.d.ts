/**
 * @packageDocumentation Communicate with a statechannels wallet via JSON-RPC over postMessage
 *
 * @remarks
 * Attaches a channelProvider to the window object.
 */

/// <reference types="node" />
import { ApproveBudgetAndFundRequest } from '@statechannels/client-api-schema';
import { ApproveBudgetAndFundResponse } from '@statechannels/client-api-schema';
import { ChallengeChannelRequest } from '@statechannels/client-api-schema';
import { ChallengeChannelResponse } from '@statechannels/client-api-schema';
import { CloseAndWithdrawRequest } from '@statechannels/client-api-schema';
import { CloseAndWithdrawResponse } from '@statechannels/client-api-schema';
import { CloseChannelRequest } from '@statechannels/client-api-schema';
import { CloseChannelResponse } from '@statechannels/client-api-schema';
import { CreateChannelRequest } from '@statechannels/client-api-schema';
import { CreateChannelResponse } from '@statechannels/client-api-schema';
import { EnableEthereumRequest } from '@statechannels/client-api-schema';
import { EnableEthereumResponse } from '@statechannels/client-api-schema';
import EventEmitter from 'eventemitter3';
import { GetBudgetRequest } from '@statechannels/client-api-schema';
import { GetBudgetResponse } from '@statechannels/client-api-schema';
import { GetChannelsRequest } from '@statechannels/client-api-schema';
import { GetChannelsResponse } from '@statechannels/client-api-schema';
import { GetStateRequest } from '@statechannels/client-api-schema';
import { GetStateResponse } from '@statechannels/client-api-schema';
import { GetWalletInformationRequest } from '@statechannels/client-api-schema';
import { GetWalletInformationResponse } from '@statechannels/client-api-schema';
import { JoinChannelRequest } from '@statechannels/client-api-schema';
import { JoinChannelResponse } from '@statechannels/client-api-schema';
import { JsonRpcRequest } from '@statechannels/client-api-schema';
import { PushMessageRequest } from '@statechannels/client-api-schema';
import { PushMessageResponse } from '@statechannels/client-api-schema';
import { StateChannelsNotification } from '@statechannels/client-api-schema';
import { StateChannelsNotificationType } from '@statechannels/client-api-schema';
import { StateChannelsResponse } from '@statechannels/client-api-schema';
import { UpdateChannelRequest } from '@statechannels/client-api-schema';
import { UpdateChannelResponse } from '@statechannels/client-api-schema';

/**
 * Class instance that is attached to the window object
 *
 * @remarks
 * Accessible via `window.channelProvider`
 *
 * @beta
 */
export declare const channelProvider: IFrameChannelProvider;

/**
 * The generic JsonRPC provider interface that mimics {@link https://eips.ethereum.org/EIPS/eip-1193 | EIP-1193} and the window.ethereum
 * object in the browser.
 *
 * @remarks
 * Expectation is bidirectional communication between application
 * and the wallet.
 *
 * @beta
 */
export declare interface ChannelProviderInterface {
    /**
     * The public part of the ephemeral key pair used for signing state channel updates.
     */
    signingAddress?: string;
    /**
     * The ethereum address where on-chain funds will be sent.
     */
    destinationAddress?: string;
    /**
     * The ethereum address where on-chain funds will be sent.
     */
    walletVersion?: string;
    /**
     * Method for sending requests to the wallet
     */
    send<MethodName extends keyof WalletJsonRpcAPI>(method: MethodName, params: WalletJsonRpcAPI[MethodName]['request']['params']): Promise<WalletJsonRpcAPI[MethodName]['response']['result']>;
    /**
     * eventemitter 'on' for JSON-RPC Notifications. Use this to register callbacks.
     */
    on: OnType;
    /**
     * eventemitter 'off' for JSON-RPC Notifications. Use this to unregister callbacks.
     */
    off: OffType;
    subscribe: SubscribeType;
    unsubscribe: UnsubscribeType;
}

declare const eventEmitter: EventEmitter<EventType>;

/**
 * Globally-unique-identifier header
 * @internal
 */
export declare interface EventType extends StateChannelsNotificationType {
    [id: string]: [unknown];
}

/**
 * Class for interacting with a statechannels wallet
 *
 * @beta
 */
export declare class IFrameChannelProvider implements IFrameChannelProviderInterface {
    /**
     * Has the wallet iFrame been mounted?
     */
    protected mounted: boolean;
    /**
     * EventEmitter instance emitting wallet notifications
     */
    protected readonly events: EventEmitter<EventType>;
    /**
     * Service handling embedding of an iframe onto the page
     *
     * @remarks
     * This iframe runs the wallet code
     */
    protected readonly iframe: IFrameService;
    /**
     * Handles messaging to and from the wallet using postMessage
     */
    protected readonly messaging: PostMessageService;
    protected readonly subscriptions: {
        [T in keyof StateChannelsNotificationType]: string[];
    };
    /**
     * The url of the hosted statechannels wallet
     */
    protected url: string;
    /**
     * The public part of the ephemeral key pair
     * @remarks The private part is used for signing state channel updates.
     */
    signingAddress?: string;
    /**
     * The ethereum address where on-chain funds will be sent.
     */
    destinationAddress?: string;
    /**
     * The ethereum address where on-chain funds will be sent.
     */
    walletVersion?: string;
    /**
     * Create a new instance of this class
     *
     * @beta
     */
    constructor();
    /**
     * Is the wallet ready to receive requests?
     */
    walletReady: (url: string) => Promise<unknown>;
    /**
     * Trigger the mounting of the <iframe/> element
     */
    mountWalletComponent(url: string): Promise<void>;
    /**
     * Enable the channel provider
     *
     * @remarks
     * This causes the provider to cache {@link IFrameChannelProvider.signingAddress | signingAddress}, {@link IFrameChannelProvider.destinationAddress | destinationAddress} and {@link IFrameChannelProvider.walletVersion | walletVersion} from the wallet.
     * @returns Promise which resolves when the wallet has completed the Enable Ethereum workflow.
     */
    enable(): Promise<void>;
    send<M extends keyof WalletJsonRpcAPI>(method: M, params: WalletJsonRpcAPI[M]['request']['params']): Promise<WalletJsonRpcAPI[M]['response']['result']>;
    subscribe: SubscribeType;
    unsubscribe: UnsubscribeType;
    /**
     * eventemitter 'on' for JSON-RPC Notifications. Use this to register callbacks.
     */
    on: OnType;
    /**
     * eventemitter 'off' for JSON-RPC Notifications. Use this to unregister callbacks.
     */
    off: OffType;
    protected onMessage(event: MessageEvent): Promise<void>;
}

/**
 * For environments where the wallet is proxied within an iFrame embedded on the
 * application's DOM.
 *
 * @remarks
 * This is as opposed to being injected via an extension background script,
 * in which case the "mounting" is effectively done via the background script and not by
 * the application.
 * @beta
 */
export declare interface IFrameChannelProviderInterface extends Web3ChannelProviderInterface {
    /**
     * Trigger the mounting of the <iframe/> element which loads the wallet.
     */
    mountWalletComponent(url?: string): Promise<void>;
}

declare class IFrameService {
    protected get container(): HTMLDivElement | null;
    protected get iframe(): HTMLIFrameElement | null;
    protected get styles(): HTMLStyleElement | null;
    protected url: string;
    setUrl(url: string): void;
    mount(): Promise<void>;
    unmount(): void;
    setVisibility(visible: boolean): void;
    getTarget(): Promise<Window>;
}

/**
 * @internal
 */
export declare type OffType = typeof eventEmitter.off;

/**
 * @internal
 */
export declare type OnType = typeof eventEmitter.on;

declare class PostMessageService {
    protected timeoutListener?: NodeJS.Timeout;
    protected attempts: number;
    protected url: string;
    protected readonly timeoutMs: number;
    protected readonly maxRetries: number;
    constructor({ timeoutMs, maxRetries }?: PostMessageServiceOptions);
    setUrl(url: string): void;
    send(target: Window, message: JsonRpcRequest, corsUrl: string): void;
    private requestNumber;
    request<ResultType = any>(target: Window, messageWithOptionalId: Omit<JsonRpcRequest, 'id'> & {
        id?: number;
    }, // Make id an optional key
    callback?: (result: ResultType) => void): Promise<ResultType>;
    acknowledge(): void;
    protected createListenerForRequest<ResultType extends StateChannelsResponse['result']>(request: JsonRpcRequest, resolve: (value?: ResultType) => void, reject: (reason?: any) => void, callback?: (result: ResultType) => void): (event: MessageEvent) => void;
}

declare interface PostMessageServiceOptions {
    timeoutMs?: number;
    maxRetries?: number;
}

/**
 * @internal
 */
export declare type SubscribeType = (subscriptionType: StateChannelsNotification['method'], params?: any) => Promise<string>;

/**
 * @internal
 */
export declare type UnsubscribeType = (subscriptionId: string) => Promise<boolean>;

/**
 * @beta
 */
export declare type WalletJsonRpcAPI = {
    /**
     * Requests a new channel to be created
     */
    CreateChannel: {
        request: CreateChannelRequest;
        response: CreateChannelResponse;
    };
    /**
     * Updates the state of a channel
     */
    UpdateChannel: {
        request: UpdateChannelRequest;
        response: UpdateChannelResponse;
    };
    /**
     * Accepts inbound messages from other state channel participants.
     */
    PushMessage: {
        request: PushMessageRequest;
        response: PushMessageResponse;
    };
    /**
     * Requests a close for a channel
     */
    CloseChannel: {
        request: CloseChannelRequest;
        response: CloseChannelResponse;
    };
    /**
     * Join a proposed state channel
     */
    JoinChannel: {
        request: JoinChannelRequest;
        response: JoinChannelResponse;
    };
    /**
     * Requests the latest state for a channel
     */
    GetState: {
        request: GetStateRequest;
        response: GetStateResponse;
    };
    /**
     * Requests basic information from the wallet
     */
    GetWalletInformation: {
        request: GetWalletInformationRequest;
        response: GetWalletInformationResponse;
    };
    EnableEthereum: {
        request: EnableEthereumRequest;
        response: EnableEthereumResponse;
    };
    /**
     * Requests a challenge for a channel
     */
    ChallengeChannel: {
        request: ChallengeChannelRequest;
        response: ChallengeChannelResponse;
    };
    /**
     * Requests approval for a new budget for this domain, as well as for an appropriately funded ledger channel with the hub
     */
    ApproveBudgetAndFund: {
        request: ApproveBudgetAndFundRequest;
        response: ApproveBudgetAndFundResponse;
    };
    /**
     * Requests the latest budget for this domain
     */
    GetBudget: {
        request: GetBudgetRequest;
        response: GetBudgetResponse;
    };
    /**
     * Requests the funds to be withdrawn from this domain's ledger channel
     */
    CloseAndWithdraw: {
        request: CloseAndWithdrawRequest;
        response: CloseAndWithdrawResponse;
    };
    /**
     * Requests the latest state for all channels.
     */
    GetChannels: {
        request: GetChannelsRequest;
        response: GetChannelsResponse;
    };
};

/**
 * For environments where the destinationAddress is secret until the wallet is "enabled".
 *
 * @remarks
 * This is the case e.g. with {@link https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents | MetaMask } and its connected accounts feature.
 *
 * @beta
 */
export declare interface Web3ChannelProviderInterface extends ChannelProviderInterface {
    /**
     * Enable the wallet, causing it to run the Ethereum Enable workflow
     */
    enable(): Promise<void>;
}

export { }
