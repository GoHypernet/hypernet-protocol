import { TransactionResponse } from "@ethersproject/abstract-provider";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  Signature,
  BlockchainUnavailableError,
  BigNumberString,
  HexString,
  ChainId,
  EthereumAccountAddress,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainUtils {
  verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
  ): EthereumAccountAddress;

  erc20Transfer(
    assetAddress: EthereumContractAddress,
    channelAddress: string,
    amount: BigNumberString,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError>;

  mintToken(
    amount: BigNumberString,
    to: EthereumAccountAddress,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError>;

  /**
   * Returns all the data relevant to dealing with canceled message transfers.
   * @returns An array consisting of the ABI for the EncodedCancel resolver and the encoded hexstring itself.
   */
  getMessageTransferEncodedCancelData(
    chainId: ChainId,
  ): ResultAsync<[string, HexString], BlockchainUnavailableError>;

  /**
   * Returns all the data relevant to dealing with canceled insurance transfers.
   * @returns An array consisting of the ABI for the EncodedCancel resolver and the encoded hexstring itself.
   */
  getInsuranceTransferEncodedCancelData(
    chainId: ChainId,
  ): ResultAsync<[string, HexString], BlockchainUnavailableError>;

  /**
   * Returns all the data relevant to dealing with canceled parameterized transfers.
   * @returns An array consisting of the ABI for the EncodedCancel resolver and the encoded hexstring itself.
   */
  getParameterizedTransferEncodedCancelData(
    chainId: ChainId,
  ): ResultAsync<[string, HexString], BlockchainUnavailableError>;

  getERC721Entry<T>(
    contractAddress: EthereumContractAddress,
    key: string,
  ): ResultAsync<T, BlockchainUnavailableError>;
}

export const IBlockchainUtilsType = Symbol.for("IBlockchainUtils");
