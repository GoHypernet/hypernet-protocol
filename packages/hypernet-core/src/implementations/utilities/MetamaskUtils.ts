import {
  BlockchainUnavailableError,
  IProviderSigner,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ILogUtils, ILocalStorageUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";

import { IConfigProvider } from "@interfaces/utilities";
import { IMetamaskUtils } from "@interfaces/utilities/IMetamaskUtils";

declare global {
  interface Window {
    ethereum: any;
  }
}

export class MetamaskUtils implements IMetamaskUtils {
  constructor(
    protected configProvider: IConfigProvider,
    protected localStorageUtils: ILocalStorageUtils,
    protected logUtils: ILogUtils,
  ) {}

  public enable(): ResultAsync<IProviderSigner, BlockchainUnavailableError> {
    window.ethereum.autoRefreshOnNetworkChange = false;
    return ResultAsync.fromPromise(
      window.ethereum.request({ method: "eth_requestAccounts" }),
      (e: unknown) => {
        const errorMessage: string =
          "Unable to initialize ethereum provider from the window";
        this.logUtils.error(errorMessage);
        return new BlockchainUnavailableError(errorMessage, e);
      },
    );
  }

  public addNetwork(): ResultAsync<unknown, BlockchainUnavailableError> {
    return this.configProvider.getConfig().andThen((config) => {
      const network = config.chainProviders[config.chainId];
      const storedNetworkes = this._getStoredNetworks();
      if (storedNetworkes.includes(network)) {
        return okAsync(undefined);
      }

      return ResultAsync.fromPromise(
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${config.chainId.toString(16)}`,
              chainName: "Hypernet protocol dev network",
              rpcUrls: [network],
            },
          ],
        }),
        (e: unknown) => {
          const errorMessage: string = "Unable to add network in metamask";
          this.logUtils.error(errorMessage);
          return new BlockchainUnavailableError(errorMessage, e);
        },
      ).map(() => {
        return this._storeNetwork(network);
      });
    });
  }

  public addTokenAddress(
    tokenName?: string,
    tokenAddress?: EthereumAddress,
  ): ResultAsync<unknown, BlockchainUnavailableError> {
    return this.configProvider.getConfig().andThen((config) => {
      const token = tokenAddress || config.hypertokenAddress;
      const storedTokens = this._getStoredTokenAddresses();
      if (storedTokens.includes(token)) {
        return okAsync(undefined);
      }

      return ResultAsync.fromPromise(
        window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token,
              symbol: tokenName || "HyperToken",
              decimals: 18,
            },
          },
        }),
        (e: unknown) => {
          const errorMessage: string = "Unable to add token in metamask";
          this.logUtils.error(errorMessage);
          return new BlockchainUnavailableError(errorMessage, e);
        },
      ).map(() => {
        return this._storeTokenAddress(token);
      });
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
