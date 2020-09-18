import EventEmitter from 'eventemitter3';
import { StateChannelsNotificationType } from '@statechannels/client-api-schema';
import { IFrameChannelProviderInterface } from './types';
import { WalletJsonRpcAPI } from './types/wallet-api';
import { PostMessageService } from './postmessage-service';
import { IFrameService } from './iframe-service';
import { OnType, OffType, EventType, SubscribeType, UnsubscribeType } from './types/events';
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
 * Class instance that is attached to the window object
 *
 * @remarks
 * Accessible via `window.channelProvider`
 *
 * @beta
 */
declare const channelProvider: IFrameChannelProvider;
export { channelProvider };
//# sourceMappingURL=channel-provider.d.ts.map