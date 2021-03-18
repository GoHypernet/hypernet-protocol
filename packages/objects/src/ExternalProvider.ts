import { ethers } from "ethers";
import { EthereumAddress } from "@objects/EthereumAddress";

export class ExternalProvider {
  constructor(
    public provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    public address: EthereumAddress,
  ) {}
}
