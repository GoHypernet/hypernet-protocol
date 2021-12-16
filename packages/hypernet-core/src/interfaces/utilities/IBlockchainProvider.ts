import {
  BlockchainUnavailableError,
  GovernanceSignerUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
  ProviderId,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { CeramicEIP1193Bridge } from "@implementations/utilities";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IBlockchainProvider {
  /**
   * This initializes the blockchain provider, and makes sure
   */
  initialize(): ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  >;

  getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, never>;
  getGovernanceSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;

  getProvider(): ResultAsync<ethers.providers.JsonRpcProvider, never>;
  /**
   * Returns a provider that is connected to the governance chain, whatever that may be.
   * If the normal provider is not connected to the governance chain, then a dedicated provider
   * will be created and returned.
   */
  getGovernanceProvider(): ResultAsync<ethers.providers.Provider, never>;
  getCeramicEIP1193Provider(): ResultAsync<CeramicEIP1193Bridge, never>;
  getLatestBlock(): ResultAsync<
    ethers.providers.Block,
    BlockchainUnavailableError
  >;
  getBlockNumber(): ResultAsync<number, BlockchainUnavailableError>;
  supplyPrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError>;
  supplyProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError>;

  isMetamask(): boolean;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
