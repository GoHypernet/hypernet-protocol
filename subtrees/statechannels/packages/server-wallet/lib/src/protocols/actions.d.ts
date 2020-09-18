import { StateChannelsNotification } from '@statechannels/client-api-schema';
import { StateVariables } from '@statechannels/wallet-core';
import { providers } from 'ethers';
import { Bytes32 } from '../type-aliases';
export declare type Notice = Omit<StateChannelsNotification, 'jsonrpc'>;
export declare type SignState = {
    type: 'SignState';
    channelId: Bytes32;
} & StateVariables;
export declare type NotifyApp = {
    type: 'NotifyApp';
    notice: Notice;
};
export declare type SubmitTransaction = {
    type: 'SubmitTransaction';
    transactionRequest: providers.TransactionRequest;
    transactionId: string;
};
export declare const noAction: undefined;
export declare const submitTransaction: (props: Pick<SubmitTransaction, "transactionRequest" | "transactionId">) => SubmitTransaction;
export declare const notifyApp: (props: Pick<NotifyApp, "notice">) => NotifyApp;
export declare const signState: (props: Pick<SignState, "outcome" | "channelId" | "turnNum" | "appData" | "isFinal">) => SignState;
export declare const isSignState: (a: ProtocolAction) => a is SignState;
export declare const isNotifyApp: (a: ProtocolAction) => a is NotifyApp;
export declare const isSubmitTransaction: (a: ProtocolAction) => a is SubmitTransaction;
export declare type Outgoing = Notice;
export declare const isOutgoing: (a: ProtocolAction) => a is NotifyApp;
export declare type ProtocolAction = SignState | NotifyApp | SubmitTransaction;
//# sourceMappingURL=actions.d.ts.map