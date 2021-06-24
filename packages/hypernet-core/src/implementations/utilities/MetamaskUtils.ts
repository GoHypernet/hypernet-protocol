import {
  BlockchainUnavailableError,
  IProviderSigner,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

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
    protected logUtils: ILogUtils,
  ) {}

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
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
      return ResultAsync.fromPromise(
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${config.chainId.toString(16)}`,
              chainName: "Hypernet protocol dev network",
              rpcUrls: [config.chainProviders[config.chainId]],
            },
          ],
        }),
        (e: unknown) => {
          const errorMessage: string = "Unable to add network in metamask";
          this.logUtils.error(errorMessage);
          return new BlockchainUnavailableError(errorMessage, e);
        },
      );
    });
  }

  public addTokenAddress(
    tokenName?: string,
    tokenAddress?: EthereumAddress,
  ): ResultAsync<unknown, BlockchainUnavailableError> {
    return this.configProvider.getConfig().andThen((config) => {
      return ResultAsync.fromPromise(
        window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress || config.hypertokenAddress,
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
      );
    });
  }
}
