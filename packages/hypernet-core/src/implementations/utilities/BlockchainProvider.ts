import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

export class EthersBlockchainProvider implements IBlockchainProvider {
  protected provider: ethers.providers.Web3Provider | null;
  protected signer: ethers.providers.JsonRpcSigner | null;
  protected initializationPromise: ResultAsync<null, BlockchainUnavailableError> | null;

  constructor() {
    this.provider = null;
    this.signer = null;
    this.initializationPromise = null;
    window.ethereum.autoRefreshOnNetworkChange = false;
  }

  protected initialize(): ResultAsync<null, BlockchainUnavailableError> {
    this.initializationPromise = ResultAsync.fromPromise(window.ethereum.enable(),
      (e) => {
        return new BlockchainUnavailableError("Unable to initialize ethereum provider from the window");
      })
      .map(() => {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what Metamask injects as window.ethereum into each page
        this.provider = new ethers.providers.Web3Provider(window.ethereum);

        // The Metamask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        this.signer = this.provider.getSigner();

        return null;
      });
    return this.initializationPromise;
  }

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public getProvider(): ResultAsync<ethers.providers.Web3Provider, BlockchainUnavailableError> {
    return this.initialize()
      .map(() => {
        if (this.provider == null) {
          throw new BlockchainUnavailableError("No provider available!");
        }

        return this.provider;
      });
  }

  public getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, BlockchainUnavailableError> {
    return this.initialize()
      .map(() => {
        if (this.signer == null) {
          throw new BlockchainUnavailableError("No signer available!");
        }

        return this.signer;
      });
  }
}
