import { Eip1193Bridge } from "@ethersproject/experimental";
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { okAsync, ResultAsync, errAsync } from "neverthrow";

import {
  IConfigProvider,
  IContextProvider,
  IInternalProvider,
} from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";
declare global {
  interface Window {
    ethereum: any;
  }
}

interface IProviderSigner {
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
  signer: ethers.providers.JsonRpcSigner;
}

// This is just a code of avoiding errors in mobile app.
// An actuall non metamask provider set up should be implemented in this class.
export class EthersBlockchainProvider implements IBlockchainProvider {
  protected address: EthereumAddress | undefined;
  protected privateCredentialsPromiseResolve: (
    privateCredentials: PrivateCredentials,
  ) => void;
  protected initializeResult: ResultAsync<
    IProviderSigner,
    BlockchainUnavailableError
  > | null;
  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected internalProviderFactory: IInternalProviderFactory,
  ) {
    this.privateCredentialsPromiseResolve = () => null;
    this.address = undefined;
    this.initializeResult = null;
  }

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public getProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  > {
    return this.initialize().map((providerSigner) => {
      return providerSigner.provider;
    });
  }
  public getSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    BlockchainUnavailableError
  > {
    return this.initialize().map((providerSigner) => {
      return providerSigner.signer;
    });
  }

  public getEIP1193Provider(): ResultAsync<
    Eip1193Bridge,
    BlockchainUnavailableError
  > {
    return this.initialize().map((providerSigner) => {
      return new Eip1193Bridge(providerSigner.signer, providerSigner.provider);
    });
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

  private initialize(): ResultAsync<
    IProviderSigner,
    BlockchainUnavailableError
  > {
    if (this.initializeResult) return this.initializeResult;

    return this.configProvider.getConfig().andThen((config) => {
      if (config.metamaskEnabled === true) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        this.initializeResult = ResultAsync.fromPromise(
          window.ethereum.enable(),
          (e: unknown) => {
            return new BlockchainUnavailableError(
              "Unable to initialize ethereum provider from the window",
              e,
            );
          },
        )
          .map(() => {
            // A Web3Provider wraps a standard Web3 provider, which is
            // what Metamask injects as window.ethereum into each page
            return new ethers.providers.Web3Provider(window.ethereum);
          })
          .map((provider) => {
            return { provider, signer: provider.getSigner(this.address) };
          });

        return this.initializeResult;
      }

      let internalProvider: IInternalProvider = {} as IInternalProvider;
      this.initializeResult = this.contextProvider
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
        .map((provider) => {
          return { provider, signer: provider.getSigner(this.address) };
        })
        .mapErr((e) => {
          return e as BlockchainUnavailableError;
        });

      return this.initializeResult;
    });
  }
}
