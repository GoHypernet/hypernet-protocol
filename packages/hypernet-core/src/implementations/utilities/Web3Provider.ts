import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import Web3 from "web3";
import { provider } from "web3-core";
// import detectEthereumProvider from "@metamask/detect-provider";

declare global {
  interface Window {
    ethereum: any;
  }
}

export class Web3Provider implements IWeb3Provider {
  protected web3: Web3 | null;
  protected provider: any | null;
  protected currentAccount: any | null;
  protected initializePromise: Promise<Web3> | null;

  constructor() {
    this.web3 = null;
    this.provider = null;
    this.currentAccount = null;
    this.initializePromise = null;
  }

  protected async initialize(): Promise<Web3> {
    await window.ethereum.enable();
    const ethereumProvider: provider = Web3.givenProvider;
    if (ethereumProvider) {
      this.provider = ethereumProvider;

      this.web3 = new Web3(this.provider);

      // Sanity check
      if (this.provider !== window.ethereum) {
        throw new Error("Do you have multiple wallets installed?");
      }

      if (this.provider == null || typeof this.provider === "string") {
        throw new Error("No provider available!");
      }

      /**********************************************************/
      /* Handle chain (network) and chainChanged (per EIP-1193) */
      /**********************************************************/
      // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
      // returns incorrectly formatted chain ID values.
      this.provider.on("chainChanged", (_chainId: number) => {
        // We recommend reloading the page, unless you must do otherwise
        window.location.reload();
      });

      // Note that this event is emitted on page load.
      // If the array of accounts is non-empty, you're already
      // connected.
      this.provider.on("accountsChanged", (accounts: any[]) => {
        this.handleAccountsChanged(accounts);
      });
      // For now, 'eth_accounts' will continue to always return an array
    } else {
      throw new Error("Please install MetaMask!");
    }
    if (this.web3 == null) {
      throw Error("No Web3 provider!");
    }
    return this.web3;
  }

  protected handleAccountsChanged(accounts: any[]) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      throw new Error("Please connect to MetaMask.");
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
      // Do any other work!
    }
  }

  /**
   * getWeb3
   * @return Web3
   */
  public async getWeb3(): Promise<Web3> {
    if (this.initializePromise != null) {
      return this.initializePromise;
    }
    return this.initialize();
  }

  public async getProvider(): Promise<provider> {
    return this.provider;
  }
}
