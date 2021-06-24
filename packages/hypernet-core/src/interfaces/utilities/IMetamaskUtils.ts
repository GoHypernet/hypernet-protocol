import { EthereumAddress } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import {
  BlockchainUnavailableError,
  IProviderSigner,
} from "@hypernetlabs/objects";

export interface IMetamaskUtils {
  enable(): ResultAsync<IProviderSigner, BlockchainUnavailableError>;
  addNetwork(): ResultAsync<unknown, BlockchainUnavailableError>;
  addTokenAddress(
    tokenName?: string,
    tokenAddress?: EthereumAddress,
  ): ResultAsync<unknown, BlockchainUnavailableError>;
}
