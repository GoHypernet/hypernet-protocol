/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
  GovernanceSignerUnavailableError,
  ProviderId,
  ChainId,
  chainConfig,
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
      ethers.providers.JsonRpcProvider | ethers.providers.FallbackProvider,
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
  protected initialized = false;
  protected _isMetamask = false;

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
          `No governance signer available, using fallback provider. Change your main wallet to connect to chain ${config.defaultGovernanceChainId}`,
        ),
      );
    });
  }

  public setGovernanceSigner(
    chainId: ChainId,
  ): ResultAsync<
    void,
    | BlockchainUnavailableError
    | InvalidParametersError
    | GovernanceSignerUnavailableError
  > {
    return this.getMainProviderChainId().andThen((mainProviderChainId) => {
      if (mainProviderChainId == chainId) {
        this.governanceProvider = this.provider;
        this.governanceSigner = this.provider!.getSigner();
        return okAsync(undefined);
      } else {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Couldn't update governanceSigner because main Provider network chain id is different from governance chain id!",
          ),
        );
      }
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

  public isMetamask(): boolean {
    if (!this.initialized) {
      throw new Error("Initialization must be completed first!");
    }
    return this._isMetamask;
  }

  public initialize(
    chainId?: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError | InvalidParametersError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [config, context] = vals;

      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      let initializeProviderResult =
        this.initializeProviderResult.get(governanceChainId);

      if (initializeProviderResult == null) {
        this.logUtils.debug("Initializing BlockchainProvider");
        const web3Modal = this.getWalletConnectWeb3Modal(config);

        initializeProviderResult = this.getWalletConnectModalProvider(web3Modal)
          .map((modalProvider) => {
            this.logUtils.debug("Web3Modal initialized");
            const provider = new providers.Web3Provider(modalProvider, "any");

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
            const privateKeyPromise: Promise<PrivateCredentials> = new Promise(
              (resolve) => {
                this.privateCredentialsPromiseResolve = resolve;
              },
            );

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

            return this.getMainProviderChainId().andThen(
              (mainProviderChainId) => {
                if (mainProviderChainId == chainId) {
                  this.governanceProvider = this.provider;
                  this.governanceSigner = this.provider!.getSigner();
                }
                return okAsync(undefined);
              },
            );
          })
          .andThen(() => {
            // We will have to create a provider for the governance chain. We won't bother with the a signer.
            const chainInfo = chainConfig.get(governanceChainId);
            if (chainInfo == null) {
              return errAsync(
                new InvalidParametersError(
                  `Chain information does not exist for chain id:${governanceChainId} !`,
                ),
              );
            }

            const providers = chainInfo.providerUrls.map((providerUrl) => {
              return new ethers.providers.JsonRpcProvider(
                providerUrl,
                governanceChainId,
              );
            });
            this.governanceProvider = new ethers.providers.FallbackProvider(
              providers,
            );

            return okAsync(undefined);
          })
          .andThen(() => {
            this.initialized = true;
            if (this.governanceProvider == null) {
              return errAsync(
                new BlockchainUnavailableError(
                  "Cound not intialize governanceProvider!",
                ),
              );
            }
            this.initializeProviderResult.set(
              governanceChainId,
              okAsync(this.governanceProvider),
            );

            return okAsync(this.governanceProvider);
          });
      } else {
        initializeProviderResult.map((governanceProvider) => {
          this.governanceProvider = governanceProvider;
          this.governanceSigner = this.provider!?.getSigner();
        });
      }

      return initializeProviderResult.map(() => {});
    });
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
              "Could connectTo web3Modal!",
              e,
            );
          },
        );
      });
    });
  }

  private getInitializeProviderResult(): ResultAsync<
    ethers.providers.JsonRpcProvider | ethers.providers.FallbackProvider,
    BlockchainUnavailableError | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [config, context] = vals;

      const initializeProviderResult = this.initializeProviderResult.get(
        context.governanceChainInformation.chainId ||
          config.defaultGovernanceChainId,
      );

      if (initializeProviderResult == null) {
        throw new Error("Must call BlockchainProvider.initialize() first.");
      }

      return initializeProviderResult;
    });
  }

  public getMainProviderChainId(): ResultAsync<
    ChainId,
    BlockchainUnavailableError
  > {
    if (this.provider == null) {
      return errAsync(
        new BlockchainUnavailableError("Main provider is not ready yet!"),
      );
    }

    return ResultAsync.fromPromise(this.provider.getNetwork(), (e) => {
      return new BlockchainUnavailableError(
        "Counld not get main provider network chain id!",
        e,
      );
    }).andThen((mainNetwork) => {
      if (mainNetwork.chainId != null) {
        return okAsync(ChainId(mainNetwork.chainId));
      } else {
        return errAsync(
          new BlockchainUnavailableError(
            "Counld not get main provider network chain id!",
          ),
        );
      }
    });
  }
}
