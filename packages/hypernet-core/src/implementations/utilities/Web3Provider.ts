import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import { Wallet, ethers } from "ethers";
import { okAsync } from "neverthrow";

declare global {
  interface Window {
    ethereum: any;
  }
}

export class Web3Provider implements IWeb3Provider {
  protected web3Provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null;
  protected signer: ethers.providers.JsonRpcSigner | null;
  protected initializationPromise: ResultAsync<void, BlockchainUnavailableError> | null;

  constructor() {
    this.web3Provider = null;
    this.signer = null;
    this.initializationPromise = null;
    window.ethereum.autoRefreshOnNetworkChange = false;
  }

  protected initialize(): ResultAsync<void, BlockchainUnavailableError> {
    // if metamask is installed, use window.ethereum that metamask would iject to get the sigener
    if (window.ethereum) {
      this.initializationPromise = ResultAsync.fromPromise(window.ethereum.enable(), (e: any) => {
        return new BlockchainUnavailableError("Unable to initialize ethereum provider from the window");
      }).map(() => {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what Metamask injects as window.ethereum into each page
        this.web3Provider = new ethers.providers.Web3Provider(window.ethereum);

        // The Metamask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        this.signer = this.web3Provider.getSigner();
        return;
      });
    }
    // if metamask is not installed, use the wallet mnemonic to get the signer
    else {
      // get provider from JsonRpcProvider
      this.web3Provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

      // connect to a wallet to get the signer from.
      const owner = Wallet.fromMnemonic(
        "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
      ).connect(this.web3Provider);

      this.signer = this.web3Provider.getSigner(owner.address);

      this.initializationPromise = okAsync(undefined);
    }

    //this.initializationPromise = okAsync(this.web3Provider);
    return this.initializationPromise;
  }

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public getWeb3Provider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  > {
    return this.initialize().map(() => {
      if (this.web3Provider == null) {
        throw new BlockchainUnavailableError("No provider available!");
      }

      return this.web3Provider;
    });
  }

  public getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, BlockchainUnavailableError> {
    return this.initialize().map(() => {
      if (this.signer == null) {
        throw new BlockchainUnavailableError("No signer available!");
      }

      return this.signer;
    });
  }
}
