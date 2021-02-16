import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";
import { IWeb3Provider } from "@interfaces/utilities";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";
import { ethers } from "ethers";

export class EthersBlockchainProvider implements IBlockchainProvider {
  protected provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null;
  protected signer: ethers.providers.JsonRpcSigner | null;

  constructor(protected web3Provider: IWeb3Provider) {
    this.web3Provider = web3Provider;
    this.provider = null;
    this.signer = null;
  }

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public getProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  > {
    return this.web3Provider.getWeb3Provider();
  }

  public getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, BlockchainUnavailableError> {
    return this.web3Provider.getSigner();
  }
}
