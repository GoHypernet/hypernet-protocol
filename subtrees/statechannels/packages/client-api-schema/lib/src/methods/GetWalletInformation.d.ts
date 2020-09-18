import { JsonRpcRequest, JsonRpcResponse } from '../jsonrpc-header-types';
import { Address } from '../data-types';
export declare type GetWalletInformationRequest = JsonRpcRequest<'GetWalletInformation', {}>;
export declare type GetWalletInformationResponse = JsonRpcResponse<{
    signingAddress: Address;
    destinationAddress: Address | undefined;
    walletVersion: string;
}>;
//# sourceMappingURL=GetWalletInformation.d.ts.map