import { ethers } from "ethers";
import { EthereumAddress } from "./EthereumAddress";

export class ExternalProvider {
  constructor(
    public provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    public address: EthereumAddress,
  ) {}
}
