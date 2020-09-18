import { JsonRpcNotification } from './jsonrpc-header-types';
import { ChannelResult, Message, DomainBudget } from './data-types';
export declare type ChannelUpdatedNotification = JsonRpcNotification<'ChannelUpdated', ChannelResult>;
export declare type ChannelProposedNotification = JsonRpcNotification<'ChannelProposed', ChannelResult>;
export declare type ChannelClosingNotification = JsonRpcNotification<'ChannelClosed', ChannelResult>;
export declare type MessageQueuedNotification = JsonRpcNotification<'MessageQueued', Message>;
export declare type BudgetUpdatedNotification = JsonRpcNotification<'BudgetUpdated', DomainBudget>;
export declare type UiNotification = JsonRpcNotification<'UIUpdate', {
    showWallet: boolean;
}>;
export declare type WalletReady = JsonRpcNotification<'WalletReady', {}>;
export declare type StateChannelsNotification = ChannelProposedNotification | ChannelUpdatedNotification | ChannelClosingNotification | BudgetUpdatedNotification | MessageQueuedNotification | UiNotification | WalletReady;
declare type FilterByMethod<T, Method> = T extends {
    method: Method;
} ? T : never;
export declare type StateChannelsNotificationType = {
    [T in StateChannelsNotification['method']]: [FilterByMethod<StateChannelsNotification, T>['params']];
};
export {};
//# sourceMappingURL=notifications.d.ts.map