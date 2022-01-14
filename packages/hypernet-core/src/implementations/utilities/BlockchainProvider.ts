/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
  GovernanceSignerUnavailableError,
  ProviderId,
  ChainId,
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
import { HypernetConfig } from "@interfaces/objects";

// This is just a code of avoiding errors in mobile app.
// An actuall non metamask provider set up should be implemented in this class.
@injectable()
export class BlockchainProvider implements IBlockchainProvider {
  protected privateCredentialsPromiseResolve: (
    privateCredentials: PrivateCredentials,
  ) => void = () => null;
  protected walletConnectProviderIdPromiseResolve: (
    providerId: ProviderId,
  ) => void = () => null;
  protected initializeProviderResult: Map<
    ChainId,
    ResultAsync<
      ethers.providers.JsonRpcProvider,
      BlockchainUnavailableError | InvalidParametersError
    >
  > = new Map();

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
    return this.getInitializeProviderResult()
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
    return this.getInitializeProviderResult()
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
    return this.getInitializeProviderResult()
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
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getInitializeProviderResult(),
    ]).andThen((vals) => {
      const [config] = vals;

      if (this.governanceSigner != null) {
        return okAsync(this.governanceSigner);
      }
      return errAsync(
        new GovernanceSignerUnavailableError(
          `No governance signer available, using fallback provider. Change you main wallet to connect to chain ${config.defaultGovernanceChainId}`,
        ),
      );
    });
  }

  private ceramicEIP1193Bridge: CeramicEIP1193Bridge | null = null;
  public getCeramicEIP1193Provider(): ResultAsync<CeramicEIP1193Bridge, never> {
    return this.getInitializeProviderResult()
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
  public initialize(
    chainId?: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError | InvalidParametersError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ])
      .andThen((vals) => {
        const [config, context] = vals;

        const governanceChainId = chainId || config.defaultGovernanceChainId;

        let initializeProviderResult =
          this.initializeProviderResult.get(governanceChainId);

        if (initializeProviderResult == null) {
          this.logUtils.debug("Initializing BlockchainProvider");
          const web3Modal = this.getWalletConnectWeb3Modal(config);

          initializeProviderResult = this.getWalletConnectModalProvider(
            web3Modal,
          )
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
            // TODO: do not forget to bring back the orElse for the internal provider stuff
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
                if (mainNetwork.chainId == config.defaultGovernanceChainId) {
                  // Whoo-hoo!
                  this.governanceProvider = mainProvider;
                  this.governanceSigner = mainProvider.getSigner();

                  if (this.provider == null) {
                    return errAsync(
                      new BlockchainUnavailableError(
                        "Blockchain provider unavailable!",
                      ),
                    );
                  }

                  return okAsync(this.provider);
                }

                // We will have to create a provider for the governance chain. We won't bother with the a signer.
                const providers =
                  config.governanceChainInformation.providerUrls.map(
                    (providerUrl) => {
                      return new ethers.providers.JsonRpcProvider(
                        providerUrl,
                        config.defaultGovernanceChainId,
                      );
                    },
                  );
                this.governanceProvider = new ethers.providers.FallbackProvider(
                  providers,
                );
                if (this.provider == null) {
                  return errAsync(
                    new BlockchainUnavailableError(
                      "Blockchain provider unavailable!",
                    ),
                  );
                }
                return okAsync(this.provider);
              });
            })
            .map((val) => {
              this.initialized = true;
              return val;
            });

          if (initializeProviderResult == null) {
            return errAsync(
              new BlockchainUnavailableError(
                "Blockchain provider unavailable!",
              ),
            );
          }

          // TODO: this provider is for the chain id or the network that is selected in metamask not the actuall chain id that user wants to get the provider for.
          this.initializeProviderResult.set(
            governanceChainId,
            initializeProviderResult,
          );
        }

        return initializeProviderResult.map(() => {});
      })
      .map(() => {});
  }

  private getWalletConnectWeb3Modal(config: HypernetConfig): Web3Modal {
    // Convert all the chain information into an RPC map for wallet connect. This eliminates the need for infura
    const rpcMap = Array.from(config.chainInformation.entries()).reduce(
      (prev, [selfChainId, chainInfo]) => {
        prev[selfChainId] = chainInfo.providerUrls[0];
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
    return new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });
  }

  private getWalletConnectModalProvider(
    web3Modal: Web3Modal,
  ): ResultAsync<
    ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc,
    BlockchainUnavailableError
  > {
    return this.contextProvider.getContext().andThen((context) => {
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
        return new BlockchainUnavailableError("Unable to get providerId", e);
      }).andThen((providerId) => {
        // Open the core iframe if metamask is not selected as provider
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
      });
    });
  }

  private getInitializeProviderResult(): ResultAsync<
    ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [config, context] = vals;

      const initializeProviderResult = this.initializeProviderResult.get(
        context.governanceChainId || config.defaultGovernanceChainId,
      );

      if (initializeProviderResult == null) {
        throw new Error(
          "Before must call BlockchainProvider.initialize() first.",
        );
      }

      return initializeProviderResult;
    });
  }
}
