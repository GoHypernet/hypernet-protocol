import { StateChannelsNotification } from './notifications';
import { JsonRpcError, JsonRpcErrorResponse } from './jsonrpc-header-types';
import { CreateChannelRequest, JoinChannelRequest, UpdateChannelRequest, GetWalletInformationRequest, EnableEthereumRequest, GetStateRequest, PushMessageRequest, ChallengeChannelRequest, GetBudgetRequest, ApproveBudgetAndFundRequest, CloseChannelRequest, CloseAndWithdrawRequest, GetChannelsRequest, CreateChannelResponse, JoinChannelResponse, UpdateChannelResponse, EnableEthereumResponse, GetWalletInformationResponse, GetStateResponse, PushMessageResponse, ChallengeChannelResponse, GetBudgetResponse, CloseChannelResponse, ApproveBudgetAndFundResponse, CloseAndWithdrawResponse, GetChannelsResponse, EnableEthereumError, CloseAndWithdrawError, CloseChannelError, UpdateChannelError, PushMessageError, JoinChannelError, GetStateError, CreateChannelError, ChallengeChannelError } from './methods';
declare type GenericError = JsonRpcError<500, 'Wallet error'>;
export declare type StateChannelsRequest = CreateChannelRequest | JoinChannelRequest | UpdateChannelRequest | GetWalletInformationRequest | EnableEthereumRequest | GetStateRequest | PushMessageRequest | ChallengeChannelRequest | GetBudgetRequest | ApproveBudgetAndFundRequest | CloseChannelRequest | CloseAndWithdrawRequest | GetChannelsRequest;
export declare type StateChannelsResponse = CreateChannelResponse | JoinChannelResponse | UpdateChannelResponse | GetWalletInformationResponse | EnableEthereumResponse | GetStateResponse | PushMessageResponse | ChallengeChannelResponse | GetBudgetResponse | CloseChannelResponse | ApproveBudgetAndFundResponse | CloseAndWithdrawResponse | GetChannelsResponse;
export declare type StateChannelsError = EnableEthereumError | CloseAndWithdrawError | CloseChannelError | UpdateChannelError | PushMessageError | JoinChannelError | GetStateError | CreateChannelError | ChallengeChannelError | PushMessageError | GenericError;
export declare type StateChannelsErrorResponse = JsonRpcErrorResponse<StateChannelsError>;
export declare type StateChannelsJsonRpcMessage = StateChannelsRequest | StateChannelsResponse | StateChannelsNotification | StateChannelsErrorResponse;
export declare function isStateChannelsResponse(message: StateChannelsJsonRpcMessage): message is StateChannelsResponse;
export declare function isStateChannelsNotification(message: StateChannelsJsonRpcMessage): message is StateChannelsNotification;
export declare function isStateChannelsRequest(message: StateChannelsJsonRpcMessage): message is StateChannelsRequest;
export declare function isStateChannelsErrorResponse(message: StateChannelsJsonRpcMessage): message is StateChannelsErrorResponse;
export * from './notifications';
export * from './methods';
export * from './data-types';
export * from './error-codes';
//# sourceMappingURL=types.d.ts.map