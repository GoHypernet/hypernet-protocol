import { Eip1193Bridge } from "@ethersproject/experimental";
import {
  BlockchainUnavailableError,
  GovernanceSignerUnavailableError,
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
  getGovernanceSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    GovernanceSignerUnavailableError
  >;

  getProvider(): ResultAsync<ethers.providers.JsonRpcProvider, never>;
  /**
   * Returns a provider that is connected to the governance chain, whatever that may be.
   * If the normal provider is not connected to the governance chain, then a dedicated provider
   * will be created and returned.
   */
  getGovernanceProvider(): ResultAsync<ethers.providers.Provider, never>;
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
