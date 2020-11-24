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
  protected initializationPromise: Promise<void> | null;

  constructor() {
    this.provider = null;
    this.signer = null;
    this.initializationPromise = null;
    window.ethereum.autoRefreshOnNetworkChange = false;
  }

  protected async initialize(): Promise<void> {
    await window.ethereum.enable();

    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    // The Metamask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    this.signer = this.provider.getSigner();
  }

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public async getProvider(): Promise<ethers.providers.Web3Provider> {
    if (this.initializationPromise == null) {
      this.initializationPromise = this.initialize();
    }
    await this.initializationPromise;

    if (this.provider == null) {
      throw Error("No provider available!");
    }

    return this.provider;
  }

  public async getSigner(): Promise<ethers.providers.JsonRpcSigner> {
    if (this.initializationPromise == null) {
      this.initializationPromise = this.initialize();
    }
    await this.initializationPromise;

    if (this.signer == null) {
      throw Error("No signer available!");
    }

    return this.signer;
  }
}
