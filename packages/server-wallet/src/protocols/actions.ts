import {StateChannelsNotification} from '@statechannels/client-api-schema';
import {StateVariables} from '@statechannels/wallet-core';
import {providers} from 'ethers';

import {Bytes32} from '../type-aliases';

/*
Actions that protocols can declare.
*/

export type Notice = Omit<StateChannelsNotification, 'jsonrpc'>;
export type SignState = {type: 'SignState'; channelId: Bytes32} & StateVariables;
export type NotifyApp = {type: 'NotifyApp'; notice: Notice};
export type SubmitTransaction = {
  type: 'SubmitTransaction';
  transactionRequest: providers.TransactionRequest;
  transactionId: string;
};

/*
Action creators
*/

export const noAction = undefined;

const actionConstructor = <A extends ProtocolAction = ProtocolAction>(type: A['type']) => (
  props: Omit<A, 'type'>
): A => ({...props, type} as A);
export const submitTransaction = actionConstructor<SubmitTransaction>('SubmitTransaction');
export const notifyApp = actionConstructor<NotifyApp>('NotifyApp');
export const signState = actionConstructor<SignState>('SignState');

const guard = <T extends ProtocolAction>(type: ProtocolAction['type']) => (
  a: ProtocolAction
): a is T => a.type === type;

export const isSignState = guard<SignState>('SignState');
export const isNotifyApp = guard<NotifyApp>('NotifyApp');
export const isSubmitTransaction = guard<SubmitTransaction>('SubmitTransaction');

export type Outgoing = Notice;
export const isOutgoing = isNotifyApp;

export type ProtocolAction = SignState | NotifyApp | SubmitTransaction;
