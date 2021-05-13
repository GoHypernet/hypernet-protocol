import {
  BlockchainUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IBlockchainProvider {
  getSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    BlockchainUnavailableError
  >;
  getProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  >;
  getLatestBlock(): ResultAsync<
    ethers.providers.Block,
    BlockchainUnavailableError
  >;
  supplyPrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
