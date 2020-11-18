import { ethers } from "ethers";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IBlockchainProvider {
  getSigner(): Promise<ethers.providers.JsonRpcSigner>;
  getProvider(): Promise<ethers.providers.Web3Provider>;
}
