import EventEmitter from 'eventemitter3';
import { StateChannelsNotificationType, StateChannelsNotification } from '@statechannels/client-api-schema';
/**
 * Globally-unique-identifier header
 * @internal
 */
export interface EventType extends StateChannelsNotificationType {
    [id: string]: [unknown];
}
declare const eventEmitter: EventEmitter<EventType>;
/**
 * @internal
 */
export declare type OnType = typeof eventEmitter.on;
/**
 * @internal
 */
export declare type OffType = typeof eventEmitter.off;
/**
 * @internal
 */
export declare type SubscribeType = (subscriptionType: StateChannelsNotification['method'], params?: any) => Promise<string>;
/**
 * @internal
 */
export declare type UnsubscribeType = (subscriptionId: string) => Promise<boolean>;
export {};
//# sourceMappingURL=events.d.ts.map