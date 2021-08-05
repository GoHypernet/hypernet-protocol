import { Eip1193Bridge } from "@ethersproject/experimental";
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
  /**
   * This initializes the blockchain provider, and makes sure
   */
  initialize(): ResultAsync<void, BlockchainUnavailableError>;

  getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, never>;
  getProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    never
  >;
  getEIP1193Provider(): ResultAsync<Eip1193Bridge, never>;
  getLatestBlock(): ResultAsync<
    ethers.providers.Block,
    BlockchainUnavailableError
  >;
  supplyPrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
