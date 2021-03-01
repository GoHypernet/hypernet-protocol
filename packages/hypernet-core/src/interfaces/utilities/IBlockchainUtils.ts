import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { BigNumber, EthereumAddress, ResultAsync } from "@interfaces/objects";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BlockchainUnavailableError } from "@interfaces/objects/errors/BlockchainUnavailableError";

export interface IBlockchainUtils {
  verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
    signature: string,
  ): string;

  erc20Transfer(
    assetAddress: EthereumAddress,
    channelAddress: string,
    amount: BigNumber,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError>;

  mintToken(amount: BigNumber, to: EthereumAddress): ResultAsync<TransactionResponse, BlockchainUnavailableError>;
}
