import { ethers } from "ethers";

export interface IProviderSigner {
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
  signer: ethers.providers.JsonRpcSigner;
}
