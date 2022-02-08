import {
  BlockchainUnavailableError,
  EthereumContractAddress,
  NonFungibleRegistryContractError,
  ChainId,
  ChainInformation,
} from "@hypernetlabs/objects";
import {
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ILogUtils,
  ILogUtilsType,
  ResultUtils,
} from "@hypernetlabs/utils";
import { IInjectedProviderService } from "@interfaces/business";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@interfaces/utilities";

@injectable()
export class InjectedProviderService implements IInjectedProviderService {
  protected switchNetworkPromiseResolve: ((value: any) => void) | null = null;

  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(ILocalStorageUtilsType)
    protected localStorageUtils: ILocalStorageUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public generateSwitchNetworkPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.switchNetworkPromiseResolve = resolve;
    });
  }

  public setupInjectedProvider(): ResultAsync<
    void,
    BlockchainUnavailableError | NonFungibleRegistryContractError
  > {
    if (this.blockchainProvider.isMetamask()) {
      return ResultUtils.combine([
        this.configProvider.getConfig(),
        this.blockchainProvider.getProvider(),
      ])
        .andThen(([config, provider]) => {
          return ResultUtils.combine([
            this.addNetwork(config.defaultGovernanceChainInformation, provider),
            this.addTokenAddress(
              "HyperToken",
              config.defaultGovernanceChainInformation.hypertokenAddress,
              provider,
            ),
          ]);
        })
        .map(() => {});
    }

    return okAsync(undefined);
  }

  public switchNetwork(
    chainId: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError> {
    if (this.blockchainProvider.isMetamask()) {
      return ResultUtils.combine([
        this.configProvider.getConfig(),
        this.contextProvider.getContext(),
        this.blockchainProvider.getProvider(),
      ]).andThen(([config, context, provider]) => {
        const chainInformation = config.chainInformation.get(chainId);

        if (chainInformation == null) {
          return errAsync(
            new BlockchainUnavailableError("Failed to switch network."),
          );
        }

        return ResultAsync.fromPromise(
          provider.send("wallet_switchEthereumChain", [
            {
              chainId: `0x${chainId.toString(16)}`,
            },
          ]),
          (switchError) => {
            return new BlockchainUnavailableError(
              "wallet_switchEthereumChain has failed!",
              switchError,
            );
          },
        ).orElse((error) => {
          const errorSource = (error as any)?.src;

          if (errorSource?.code == 4902) {
            this.logUtils.info(
              `Adding ${chainInformation.name} network to provider.`,
            );
            return this.addNetwork(chainInformation, provider);
          }
          if (errorSource?.code == -32002) {
            this.logUtils.info(
              errorSource?.message ||
                "Switching network request already pending.",
            );

            const switchNetworkPromise = this.generateSwitchNetworkPromise();

            const subscription = context.onChainChanged.subscribe(
              (newChainId) => {
                if (
                  this.switchNetworkPromiseResolve != null &&
                  newChainId === chainId
                ) {
                  this.switchNetworkPromiseResolve(null);
                }
              },
            );

            return ResultUtils.race([
              ResultAsync.fromSafePromise<void, never>(switchNetworkPromise),
              ResultUtils.delay(20000),
            ]).andThen(() => {
              subscription.unsubscribe();

              return this.blockchainProvider
                .getMainProviderChainId()
                .andThen((mainProviderChainId) => {
                  // Check if the user did actually switched to the correct network
                  if (mainProviderChainId !== chainId) {
                    return errAsync(
                      new BlockchainUnavailableError(
                        "Unable to switch network",
                        error.src,
                      ),
                    );
                  }
                  return okAsync(undefined);
                });
            });
          }

          return errAsync(
            new BlockchainUnavailableError(
              "Unable to switch network",
              error.src,
            ),
          );
        });
      });
    }
    return okAsync(undefined);
  }

  protected addNetwork(
    governanceChainInfo: ChainInformation,
    provider: ethers.providers.JsonRpcProvider,
  ): ResultAsync<void, BlockchainUnavailableError> {
    const network = governanceChainInfo.providerUrls[0];
    const storedNetworks = this._getStoredNetworks();
    if (network.includes("localhost") || storedNetworks.includes(network)) {
      return okAsync(undefined);
    }

    return ResultAsync.fromPromise(
      provider.send("wallet_addEthereumChain", [
        {
          chainId: `0x${governanceChainInfo.chainId.toString(16)}`,
          chainName: governanceChainInfo.name,
          rpcUrls: [network],
        },
      ]),
      (e) => {
        const errorMessage = "Unable to add network to provider";
        this.logUtils.error(errorMessage);
        return new BlockchainUnavailableError(errorMessage, e);
      },
    ).map(() => {
      return this._storeNetwork(network);
    });
  }

  protected addTokenAddress(
    tokenName: string,
    tokenAddress: EthereumContractAddress,
    provider: ethers.providers.JsonRpcProvider,
  ): ResultAsync<void, BlockchainUnavailableError> {
    const storedTokens = this._getStoredTokenAddresses();
    if (storedTokens.includes(tokenAddress)) {
      return okAsync(undefined);
    }

    return ResultAsync.fromPromise(
      provider.send("wallet_watchAsset", [
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
