import { Eip1193Bridge } from "@ethersproject/experimental";
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  PrivateCredentials,
  EthereumAddress,
  ChainId,
  GovernanceSignerUnavailableError,
} from "@hypernetlabs/objects";
import {
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ILogUtils,
  ILogUtilsType,
  ResultUtils,
} from "@hypernetlabs/utils";
import { HypernetConfig } from "@interfaces/objects";
import { IWCEthRpcConnectionOptions } from "@walletconnect/types";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, providers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync, errAsync } from "neverthrow";
import Web3Modal, { IProviderOptions } from "web3modal";

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
  protected address: EthereumAddress | undefined;
  protected privateCredentialsPromiseResolve: (
    privateCredentials: PrivateCredentials,
  ) => void;
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
  ) {
    this.privateCredentialsPromiseResolve = () => null;
    this.address = undefined;
  }

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
    GovernanceSignerUnavailableError
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

  private eip1193Bridge: Eip1193Bridge | null = null;
  public getEIP1193Provider(): ResultAsync<Eip1193Bridge, never> {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call BlockchainProvider.initialize() first before you can call getEIP1193Provider()",
      );
    }

    return this.initializeResult
      .map(() => {
        if (this.eip1193Bridge == null) {
          this.eip1193Bridge = new Eip1193Bridge(
            this.signer as ethers.providers.JsonRpcSigner,
            this.provider as
              | ethers.providers.Web3Provider
              | ethers.providers.JsonRpcProvider,
          );
        }

        return this.eip1193Bridge;
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

  public initialize(): ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  > {
    if (this.initializeResult == null) {
      this.initializeResult = ResultUtils.combine([
        this.contextProvider.getContext(),
        this.configProvider.getConfig(),
      ]).andThen((vals) => {
        const [context, config] = vals;
        const providerOptions: IProviderOptions = {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: config.infuraId,
              rpc: {
                1337: "http://localhost:8545",
                1369: "https://eth-provider-dev.hypernetlabs.io",
              },
            } as IWCEthRpcConnectionOptions,
          },
        };
        this.logUtils.debug("Initializing Web3Modal");
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions,
        });

        // Open the core iframe if we don't have a cached provider
        if (web3Modal.cachedProvider != "injected") {
          context.onCoreIFrameDisplayRequested.next();
        }

        // Display the modal
        return ResultAsync.fromPromise(web3Modal.connect(), (e) => {
          return new BlockchainUnavailableError(
            "Unable to create Web3Modal",
            e,
          );
        })
          .andThen((modalProvider) => {
            this.logUtils.debug("Web3Modal initialized");
            const provider = new providers.Web3Provider(modalProvider);

            // Hide the iframe
            context.onCoreIFrameCloseRequested.next();

            // Return the values for use
            this.provider = provider;
            this.signer = provider.getSigner();

            const useMetamask = web3Modal.cachedProvider == "injected";
            const hypertokenAddress =
              config.chainAddresses[config.governanceChainId]
                ?.hypertokenAddress;
            if (useMetamask && hypertokenAddress != null) {
              return ResultUtils.combine([
                this.addNetwork(config.governanceChainId, config),
                this.addTokenAddress(
                  config,
                  useMetamask,
                  "HyperToken",
                  hypertokenAddress,
                ),
              ]).map(() => {});
            }

            return okAsync(undefined);
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
              const providers = config.governanceEthProviderUrls.map(
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
      });
    }
    return this.initializeResult;
  }

  protected addNetwork(
    chainId: ChainId,
    config: HypernetConfig,
  ): ResultAsync<void, BlockchainUnavailableError> {
    const network = config.chainProviders[chainId];
    const storedNetworks = this._getStoredNetworks();
    if (network.includes("localhost") || storedNetworks.includes(network)) {
      return okAsync(undefined);
    }

    if (this.provider == null) {
      throw new Error("addNetwork requires the provider to be set");
    }

    return ResultAsync.fromPromise(
      this.provider.send("wallet_addEthereumChain", [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: "Hypernet Protocol Dev Network",
          rpcUrls: [network],
        },
      ]),
      (e: unknown) => {
        const errorMessage = "Unable to add network to provider";
        this.logUtils.error(errorMessage);
        return new BlockchainUnavailableError(errorMessage, e);
      },
    ).map(() => {
      return this._storeNetwork(network);
    });
  }

  protected addTokenAddress(
    config: HypernetConfig,
    useMetamask: boolean,
    tokenName: string,
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError> {
    const storedTokens = this._getStoredTokenAddresses();
    if (storedTokens.includes(tokenAddress)) {
      return okAsync(undefined);
    }

    if (this.provider == null) {
      throw new Error("addTokenAddress requires the provider to be set");
    }

    if (useMetamask) {
      return ResultAsync.fromPromise(
        this.provider.send("wallet_watchAsset", {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenName,
            decimals: 18,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as unknown as any[]),
        (e) => {
          const errorMessage = "Unable to add token to provider";
          this.logUtils.error(errorMessage);
          return new BlockchainUnavailableError(errorMessage, e);
        },
      ).map(() => {
        return this._storeTokenAddress(tokenAddress);
      });
    }

    return ResultAsync.fromPromise(
      this.provider.send("wallet_watchAsset", [
        {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenName,
            decimals: 18,
          },
        },
      ]),
      (e) => {
        const errorMessage = "Unable to add token to provider";
        this.logUtils.error(errorMessage);
        return new BlockchainUnavailableError(errorMessage, e);
      },
    ).map(() => {
      return this._storeTokenAddress(tokenAddress);
    });
  }

  private _getStoredNetworks(): string[] {
    const networksStr = this.localStorageUtils.getItem("AddedNetworks");
    return networksStr == null ? [] : (JSON.parse(networksStr) as string[]);
  }

  private _storeNetwork(network: string): void {
    const addedNetworks = this._getStoredNetworks();
    this.localStorageUtils.setItem(
      "AddedNetworks",
      JSON.stringify([...addedNetworks, network]),
    );
  }

  private _getStoredTokenAddresses(): string[] {
    const tokenAddressesStr = this.localStorageUtils.getItem("TokenAddresses");
    return tokenAddressesStr == null
      ? []
      : (JSON.parse(tokenAddressesStr) as string[]);
  }

  private _storeTokenAddress(token: string): void {
    const addedTokenAdresses = this._getStoredTokenAddresses();
    this.localStorageUtils.setItem(
      "TokenAddresses",
      JSON.stringify([...addedTokenAdresses, token]),
    );
  }
}
