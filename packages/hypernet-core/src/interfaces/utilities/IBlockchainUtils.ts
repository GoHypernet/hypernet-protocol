import { TransactionResponse } from "@ethersproject/abstract-provider";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { EthereumAddress, Signature } from "@hypernetlabs/objects";
import { BlockchainUnavailableError } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainUtils {
  verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
    signature: Signature,
  ): EthereumAddress;

  erc20Transfer(
    assetAddress: EthereumAddress,
    channelAddress: string,
    amount: BigNumber,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError>;

  mintToken(
    amount: BigNumber,
    to: EthereumAddress,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError>;
}
