/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
  GovernanceSignerUnavailableError,
  ProviderId,
} from "@hypernetlabs/objects";
import {
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ILogUtils,
  ILogUtilsType,
  ResultUtils,
} from "@hypernetlabs/utils";
import { IWCEthRpcConnectionOptions, IRPCMap } from "@walletconnect/types";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, providers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync, errAsync } from "neverthrow";
import Web3Modal, { IProviderOptions } from "web3modal";

import { CeramicEIP1193Bridge } from "@implementations/utilities";
import {
  IContextProvider,
  IConfigProvider,
  IContextProviderType,
  IConfigProviderType,
} from "@interfaces/utilities";
import {
  IInternalProviderFactory,
  IInternalProviderFactoryType,
} from "@interfaces/utilities/factory";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";

// This is just a code of avoiding errors in mobile app.
// An actuall non metamask provider set up should be implemented in this class.
@injectable()
export class EthersBlockchainProvider implements IBlockchainProvider {
  protected privateCredentialsPromiseResolve: (
    privateCredentials: PrivateCredentials,
  ) => void = () => null;
  protected walletConnectProviderIdPromiseResolve: (
    providerId: ProviderId,
  ) => void = () => null;
  protected initializeResult: ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  > | null = null;

  protected provider: ethers.providers.JsonRpcProvider | null = null;
  protected signer: ethers.providers.JsonRpcSigner | null = null;
  protected governanceProvider:
    | ethers.providers.JsonRpcProvider
    | ethers.providers.FallbackProvider
    | null = null;
  protected governanceSigner: ethers.providers.JsonRpcSigner | null = null;

  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILocalStorageUtilsType)
    protected localStorageUtils: ILocalStorageUtils,
    @inject(IInternalProviderFactoryType)
    protected internalProviderFactory: IInternalProviderFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public getProvider(): ResultAsync<ethers.providers.JsonRpcProvider, never> {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call BlockchainProvider.initialize() first before you can call getProvider()",
      );
    }

    return this.initializeResult
      .map(() => {
        return this.provider as
          | ethers.providers.Web3Provider
          | ethers.providers.JsonRpcProvider;
      })
      .orElse((e) => {
        this.logUtils.error(e);
        throw new Error(
          "Initialization unsuccessful, you should not have called getProvider()",
        );
      });
  }

  // TODO: Make this actualy return a guaranteed governance chain connected provider.
  public getGovernanceProvider(): ResultAsync<
    ethers.providers.Provider,
    never
  > {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call BlockchainProvider.initialize() first before you can call getGovernanceProvider()",
      );
    }

    return this.initializeResult
      .map(() => {
        return this.governanceProvider as ethers.providers.Provider;
      })
      .orElse((e) => {
        throw new Error(
          "Initialization unsuccessful, you should not have called getGovernanceProvider()",
        );
      });
  }

  public getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, never> {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call BlockchainProvider.initialize() first before you can call getSigner()",
      );
    }
    return this.initializeResult
      .map(() => {
        return this.signer as ethers.providers.JsonRpcSigner;
      })
      .orElse((e) => {
        throw new Error(
          "Initialization unsuccessful, you should not have called getSigner()",
        );
      });
  }

  public getGovernanceSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  > {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call BlockchainProvider.initialize() first before you can call getGovernanceSigner()",
      );
    }
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.initializeResult,
    ]).andThen((vals) => {
      const [config] = vals;

      if (this.governanceSigner != null) {
        return okAsync(this.governanceSigner);
      }
      return errAsync(
        new GovernanceSignerUnavailableError(
          `No governance signer available, using fallback provider. Change you main wallet to connect to chain ${config.governanceChainId}`,
        ),
      );
    });
  }

  private ceramicEIP1193Bridge: CeramicEIP1193Bridge | null = null;
  public getCeramicEIP1193Provider(): ResultAsync<CeramicEIP1193Bridge, never> {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call BlockchainProvider.initialize() first before you can call getEIP1193Provider()",
      );
    }

    return this.initializeResult
      .map(() => {
        if (this.ceramicEIP1193Bridge == null) {
          this.ceramicEIP1193Bridge = new CeramicEIP1193Bridge(
            this.signer!,
            this.provider!,
          );
        }

        return this.ceramicEIP1193Bridge;
      })
      .orElse((e) => {
        throw new Error(
          "Initialization unsuccessful, you should not have called eip1193Bridge()",
        );
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

  public supplyProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError> {
    if (providerId == null) {
      return errAsync(
        new InvalidParametersError("You must provide a providerId"),
      );
    }
    // Once we have provider id, we can resolve the promise
    this.walletConnectProviderIdPromiseResolve(providerId);
    return okAsync(undefined);
  }

  private _isMetamask = false;
  public isMetamask(): boolean {
    if (!this.initialized) {
      throw new Error("Initialization must be completed first!");
    }
    return this._isMetamask;
  }

  private initialized = false;
  public initialize(): ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  > {
    if (this.initializeResult == null) {
      this.logUtils.debug("Initializing BlockchainProvider");
      this.initializeResult = ResultUtils.combine([
        this.contextProvider.getContext(),
        this.configProvider.getConfig(),
      ])
        .andThen(([context, config]) => {
          // Convert all the chain information into an RPC map for wallet connect. This eliminates the need for infura
          const rpcMap = Array.from(config.chainInformation.entries()).reduce(
            (prev, [chainId, chainInfo]) => {
              prev[chainId] = chainInfo.providerUrls[0];
              return prev;
            },
            {} as IRPCMap,
          );

          const providerOptions: IProviderOptions = {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                rpc: rpcMap,
              } as IWCEthRpcConnectionOptions,
            },
          };
          this.logUtils.debug("Initializing Web3Modal");
          const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions,
          });

          let providerIdPromise: Promise<ProviderId>;

          if (web3Modal.cachedProvider) {
            providerIdPromise = new Promise((resolve) => {
              resolve(ProviderId(web3Modal.cachedProvider));
            });
          } else {
            // Emit an event for showing wallet connect options
            context.onWalletConnectOptionsDisplayRequested.next();
            providerIdPromise = new Promise((resolve) => {
              this.walletConnectProviderIdPromiseResolve = resolve;
            });
          }

          // Display the modal
          return ResultAsync.fromPromise(providerIdPromise, (e) => {
            return new BlockchainUnavailableError(
              "Unable to get providerId",
              e,
            );
          })
            .andThen((providerId) => {
              // Open the core iframe if metamas is not selected as provider
              if (providerId != "injected") {
                context.onCoreIFrameDisplayRequested.next();
              }
              return ResultAsync.fromPromise(
                web3Modal.connectTo(providerId) as Promise<
                  | ethers.providers.ExternalProvider
                  | ethers.providers.JsonRpcFetchFunc
                >,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Could not get the network for the main blockchain provider!",
                    e,
                  );
                },
              );
            })
            .map((modalProvider) => {
              this.logUtils.debug("Web3Modal initialized");
              const provider = new providers.Web3Provider(modalProvider);

              // Hide the iframe
              context.onCoreIFrameCloseRequested.next();

              // Return the values for use
              this.provider = provider;
              this.signer = provider.getSigner();

              this._isMetamask = web3Modal.cachedProvider == "injected";
            })
            .orElse((e) => {
              this.logUtils.info(
                "Reverting to using JsonRPCProvider as the blockchain provider, waiting for a key or mnemonic to be provided.",
              );

              // Fire an onPrivateCredentialsRequested
              const privateKeyPromise: Promise<PrivateCredentials> =
                new Promise((resolve) => {
                  this.privateCredentialsPromiseResolve = resolve;
                });

              // Emit an event that sends a callback to the user. The user can execute the callback to provide their private key or mnemonic._getAccountPromise
              context.onPrivateCredentialsRequested.next();

              // Wait on
              return ResultAsync.fromSafePromise<PrivateCredentials, never>(
                privateKeyPromise,
              )
                .andThen((privateCredentials) => {
                  if (privateCredentials.mnemonic != null) {
                    this.logUtils.info(
                      "Mnemonic provided, initializing JsonRPCprovider",
                    );
                  } else if (privateCredentials.privateKey != null) {
                    this.logUtils.info(
                      "Private key provided, initializing JsonRPCprovider",
                    );
                  } else {
                    this.logUtils.info(
                      "Neither a mnemonic nor a private key was provided, error iminent!",
                    );
                  }

                  // Inject a InternalProviderFactory to do this
                  return this.internalProviderFactory.factoryInternalProvider(
                    privateCredentials,
                  );
                })
                .andThen((internalProvider) => {
                  return internalProvider.getProvider();
                })
                .map((provider) => {
                  this.provider = provider;
                  this.signer = provider.getSigner();
                });
            })
            .andThen(() => {
              // Now we have the main provider, as given by the modal or provided externally. We now need to check if that provider is connected to
              // the governance chain. If it is, great! We're done. If it's not, we need to create a provider using our configured ProviderUrls.
              // In this case, a signer will not be available.
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const mainProvider = this.provider!;
              return ResultAsync.fromPromise(mainProvider.getNetwork(), (e) => {
                return new BlockchainUnavailableError(
                  "Could not get the network for the main blockchain provider!",
                  e,
                );
              }).andThen((mainNetwork) => {
                if (mainNetwork.chainId == config.governanceChainId) {
                  // Whoo-hoo!
                  this.governanceProvider = mainProvider;
                  this.governanceSigner = mainProvider.getSigner();
                  return okAsync(undefined);
                }

                // We will have to create a provider for the governance chain. We won't bother with the a signer.
                const providers =
                  config.governanceChainInformation.providerUrls.map(
                    (providerUrl) => {
                      return new ethers.providers.JsonRpcProvider(
                        providerUrl,
                        config.governanceChainId,
                      );
                    },
                  );
                this.governanceProvider = new ethers.providers.FallbackProvider(
                  providers,
                );
                return okAsync(undefined);
              });
            });
        })
        .map(() => {
          this.initialized = true;
        });
    }
    return this.initializeResult;
  }
}
