import { BlockchainUnavailableError } from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IGovernanceBlockchainProvider {
  /**
   * This initializes the blockchain provider, and makes sure
   */
  initialize(): ResultAsync<void, BlockchainUnavailableError>;

  getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, never>;
  getProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    never
  >;
}

export const IGovernanceBlockchainProviderType = Symbol.for(
  "IGovernanceBlockchainProvider",
);
