import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { Address } from '../data-types';
import { ErrorCodes } from '../error-codes';
export declare type EnableEthereumRequest = JsonRpcRequest<'EnableEthereum', {}>;
export declare type EnableEthereumResponse = JsonRpcResponse<{
    signingAddress: Address;
    destinationAddress: Address;
    walletVersion: string;
}>;
export declare type EnableEthereumError = JsonRpcError<ErrorCodes['EnableEthereum']['EthereumNotEnabled'], 'Ethereum Not Enabled'>;
//# sourceMappingURL=EnableEthereum.d.ts.map