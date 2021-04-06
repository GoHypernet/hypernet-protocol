import { BlockchainUnavailableError, IPrivateCredentials } from "@hypernetlabs/objects";
import { IContextProvider } from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
declare global {
  interface Window {
    ethereum: any;
  }
}
// This is just a code of avoiding errors in mobile app.
// An actuall non metamask provider set up should be implemented in this class.
export class EthersBlockchainProvider implements IBlockchainProvider {
  protected provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null;
  protected signer: ethers.providers.JsonRpcSigner | null;
  protected initializationPromise: ResultAsync<void, BlockchainUnavailableError> | null;
  protected privateCredentialsPromiseResolve: (privateCredentials: IPrivateCredentials) => void;
  protected address: string | undefined;
  constructor(
    protected contextProvider: IContextProvider,
    protected internalProviderFactory: IInternalProviderFactory,
  ) {
    this.provider = null;
    this.signer = null;
    this.initializationPromise = null;
    this.privateCredentialsPromiseResolve = () => null;
    this.address = undefined;
  }
  protected initialize(): ResultAsync<void, BlockchainUnavailableError> {
    let providerResult: ResultAsync<
      ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
      BlockchainUnavailableError
    >;
    if (window.ethereum != null) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      providerResult = ResultAsync.fromPromise(window.ethereum.enable(), (e: any) => {
        return new BlockchainUnavailableError("Unable to initialize ethereum provider from the window");
      }).map(() => {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what Metamask injects as window.ethereum into each page
        return new ethers.providers.Web3Provider(window.ethereum);
      });
    } else {
      // Fire an onPrivateCredentialsRequested
      const privateKeyPromise: Promise<IPrivateCredentials> = new Promise((resolve) => {
        this.privateCredentialsPromiseResolve = resolve;
      });
      providerResult = this.contextProvider
        .getContext()
        .andThen((context) => {
          // Emit an event that sends a callback to the user. The user can execute the callback to provide their private key or mnemonic._getAccountPromise
          context.onPrivateCredentialsRequested.next((privateCredentials) => {
            // Once we have their info, we can continue
            this.privateCredentialsPromiseResolve(privateCredentials);
          });
          return ResultAsync.fromSafePromise(privateKeyPromise);
        })
        .andThen((privateCredentials) => {
          // Inject a InternalProviderFactory to do this
          return this.internalProviderFactory.factoryInternalProvider(privateCredentials);
        })
        .andThen((internalProvider) => {
          this.address = internalProvider.address;
          return internalProvider.provider;
        })
        .mapErr((e) => {
          return e as BlockchainUnavailableError;
        });
    }

    this.initializationPromise = providerResult
      .map((provider) => {
        this.provider = provider;
        // The Metamask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        this.signer = provider.getSigner(this.address);
        return null;
      })
      .map(() => {
        return;
      });
    return this.initializationPromise;
  }
  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public getProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  > {
    return this.initialize().map(() => {
      if (this.provider == null) {
        throw new BlockchainUnavailableError("No provider available!");
      }
      return this.provider;
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
  public getLatestBlock(): ResultAsync<ethers.providers.Block, BlockchainUnavailableError> {
    return this.getProvider().map(async (provider) => {
      return await provider.getBlock("latest");
    });
  }
}
