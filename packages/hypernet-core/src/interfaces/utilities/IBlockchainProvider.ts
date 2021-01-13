import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";
import { ethers } from "ethers";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IBlockchainProvider {
  getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, BlockchainUnavailableError>;
  getProvider(): ResultAsync<ethers.providers.Web3Provider, BlockchainUnavailableError>;
}
