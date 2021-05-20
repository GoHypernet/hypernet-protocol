import { Eip1193Bridge } from "@ethersproject/experimental";
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { okAsync, ResultAsync, errAsync } from "neverthrow";

import { IContextProvider, IInternalProvider } from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";
import { ResultUtils } from "@web-integration/../../utils/src/ResultUtils";
declare global {
  interface Window {
    ethereum: any;
  }
}
// This is just a code of avoiding errors in mobile app.
// An actuall non metamask provider set up should be implemented in this class.
export class EthersBlockchainProvider implements IBlockchainProvider {
  protected provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
    | null;
  protected signer: ethers.providers.JsonRpcSigner | null;
  protected initializationPromise: ResultAsync<
    void,
    BlockchainUnavailableError
  > | null;
  protected address: EthereumAddress | undefined;
  protected privateCredentialsPromiseResolve: (
    privateCredentials: PrivateCredentials,
  ) => void;
  protected providerResult: ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  > | null;
  constructor(
    protected contextProvider: IContextProvider,
    protected internalProviderFactory: IInternalProviderFactory,
  ) {
    this.provider = null;
    this.signer = null;
    this.initializationPromise = null;
    this.privateCredentialsPromiseResolve = () => null;
    this.address = undefined;
    this.providerResult = null;
  }

  protected initialize(): ResultAsync<void, BlockchainUnavailableError> {
    this.initializationPromise = this._initializeProviderResult()
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
  public getSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    BlockchainUnavailableError
  > {
    return this.initialize().map(() => {
      if (this.signer == null) {
        throw new BlockchainUnavailableError("No signer available!");
      }
      return this.signer;
    });
  }

  public getEIP1193Provider(): ResultAsync<
    Eip1193Bridge,
    BlockchainUnavailableError
  > {
    return ResultUtils.combine([this.getProvider(), this.getSigner()]).map(
      (vals) => {
        const [provider, signer] = vals;

        return new Eip1193Bridge(signer, provider);
      },
    );
  }

  public getLatestBlock(): ResultAsync<
    ethers.providers.Block,
    BlockchainUnavailableError
  > {
    return this.getProvider().map(async (provider) => {
      return await provider.getBlock("latest");
    });
  }

  public supplyPrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError> {
    if (!privateCredentials.privateKey && !privateCredentials.mnemonic) {
      return errAsync(
        new InvalidParametersError(
          "You must provide a mnemonic or private key",
        ),
      );
    }
    // Once we have keys info, we can resolve the promise
    this.privateCredentialsPromiseResolve(privateCredentials);
    return okAsync(undefined);
  }

  private _initializeProviderResult(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  > {
    if (this.providerResult) return this.providerResult;

    if (window.ethereum != null) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      this.providerResult = ResultAsync.fromPromise(
        window.ethereum.enable(),
        (e: unknown) => {
          return new BlockchainUnavailableError(
            "Unable to initialize ethereum provider from the window",
          );
        },
      ).map(() => {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what Metamask injects as window.ethereum into each page
        return new ethers.providers.Web3Provider(window.ethereum);
      });
    } else {
      let internalProvider: IInternalProvider = {} as IInternalProvider;
      this.providerResult = this.contextProvider
        .getContext()
        .andThen((context) => {
          // Fire an onPrivateCredentialsRequested
          const privateKeyPromise: Promise<PrivateCredentials> = new Promise(
            (resolve) => {
              this.privateCredentialsPromiseResolve = resolve;
            },
          );

          // Emit an event that sends a callback to the user. The user can execute the callback to provide their private key or mnemonic._getAccountPromise
          context.onPrivateCredentialsRequested.next();
          return ResultAsync.fromSafePromise(privateKeyPromise);
        })
        .andThen((privateCredentials) => {
          // Inject a InternalProviderFactory to do this
          return this.internalProviderFactory.factoryInternalProvider(
            privateCredentials,
          );
        })
        .andThen((_internalProvider) => {
          internalProvider = _internalProvider;
          return internalProvider.getAddress();
        })
        .andThen((address) => {
          this.address = address;
          return internalProvider.getProvider();
        })
        .andThen((provider) => {
          this.provider = provider;
          return okAsync(this.provider);
        })
        .mapErr((e) => {
          return e as BlockchainUnavailableError;
        });
    }

    return this.providerResult;
  }
}
