import { FullChannelState, FullTransferState } from "./channel";
import { EngineParams } from "./schemas";

export const ChannelRpcMethods = {
  chan_getChannelState: "chan_getChannelState",
  chan_getChannelStateByParticipants: "chan_getChannelStateByParticipants",
  chan_getChannelStates: "chan_getChannelStates",
  chan_getTransferStateByRoutingId: "chan_getTransferStateByRoutingId",
  chan_getTransferStatesByRoutingId: "chan_getTransferStatesByRoutingId",
  // chan_getTransferState: "chan_getTransferState",
  chan_setup: "chan_setup",
  chan_deposit: "chan_deposit",
  chan_createTransfer: "chan_createTransfer",
  chan_resolveTransfer: "chan_resolveTransfer",
  chan_withdraw: "chan_withdraw",
} as const;
export type ChannelRpcMethod = typeof ChannelRpcMethods[keyof typeof ChannelRpcMethods];

export type ChannelRpcMethodsPayloadMap = {
  [ChannelRpcMethods.chan_getChannelState]: EngineParams.GetChannelState;
  [ChannelRpcMethods.chan_getChannelStateByParticipants]: EngineParams.GetChannelStateByParticipants;
  [ChannelRpcMethods.chan_getTransferStateByRoutingId]: EngineParams.GetTransferStateByRoutingId;
  [ChannelRpcMethods.chan_getTransferStatesByRoutingId]: EngineParams.GetTransferStatesByRoutingId;
  [ChannelRpcMethods.chan_getChannelStates]: undefined;
  [ChannelRpcMethods.chan_setup]: EngineParams.Setup;
  [ChannelRpcMethods.chan_deposit]: EngineParams.Deposit;
  [ChannelRpcMethods.chan_createTransfer]: EngineParams.ConditionalTransfer;
  [ChannelRpcMethods.chan_resolveTransfer]: EngineParams.ResolveTransfer;
  [ChannelRpcMethods.chan_withdraw]: EngineParams.Withdraw;
};

export type ChannelRpcMethodsResponsesMap = {
  [ChannelRpcMethods.chan_getChannelState]: FullChannelState | undefined;
  [ChannelRpcMethods.chan_getChannelStateByParticipants]: FullChannelState | undefined;
  [ChannelRpcMethods.chan_getChannelStates]: FullChannelState[];
  [ChannelRpcMethods.chan_getTransferStateByRoutingId]: FullTransferState | undefined;
  [ChannelRpcMethods.chan_getTransferStatesByRoutingId]: FullTransferState[];
  [ChannelRpcMethods.chan_setup]: FullChannelState;
  [ChannelRpcMethods.chan_deposit]: FullChannelState;
  [ChannelRpcMethods.chan_createTransfer]: FullChannelState;
  [ChannelRpcMethods.chan_resolveTransfer]: FullChannelState;
  [ChannelRpcMethods.chan_withdraw]: { channel: FullChannelState; transactionHash?: string };
};
