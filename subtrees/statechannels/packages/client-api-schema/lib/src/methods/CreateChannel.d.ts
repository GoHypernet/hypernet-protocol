import { Participant, Allocation, Address, ChannelResult } from '../data-types';
import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { ErrorCodes as AllErrors } from '../error-codes';
export declare type FundingStrategy = 'Direct' | 'Ledger' | 'Virtual';
export interface CreateChannelParams {
    participants: Participant[];
    allocations: Allocation[];
    appDefinition: Address;
    appData: string;
    fundingStrategy: FundingStrategy;
}
export declare type CreateChannelRequest = JsonRpcRequest<'CreateChannel', CreateChannelParams>;
export declare type CreateChannelResponse = JsonRpcResponse<ChannelResult>;
declare type ErrorCodes = AllErrors['CreateChannel'];
declare type SigningAddressNotFound = JsonRpcError<ErrorCodes['SigningAddressNotFound'], 'Could not find signing address'>;
declare type InvalidAppDefinition = JsonRpcError<ErrorCodes['InvalidAppDefinition'], 'Invalid App Definition'>;
declare type UnsupportedToken = JsonRpcError<ErrorCodes['UnsupportedToken'], 'This token is not supported'>;
export declare type CreateChannelError = SigningAddressNotFound | InvalidAppDefinition | UnsupportedToken;
export {};
//# sourceMappingURL=CreateChannel.d.ts.map