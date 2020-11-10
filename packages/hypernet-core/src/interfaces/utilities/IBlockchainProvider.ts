import { ethers } from "ethers";

export interface IBlockchainProvider {
  getSigner(): Promise<ethers.providers.JsonRpcSigner>;
  getProvider(): Promise<ethers.providers.Web3Provider>;
}
