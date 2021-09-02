import {
  BlockchainUnavailableError,
  InvalidParametersError,
  EthereumAddress,
  ChainId,
} from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IWCEthRpcConnectionOptions } from "@walletconnect/types";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, providers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import Web3Modal, { IProviderOptions } from "web3modal";

import {
  IGovernanceBlockchainProvider,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";
import { GovernanceAppConfig } from "@interfaces/objects";

// This is just a code of avoiding errors in mobile app.
// An actuall non metamask provider set up should be implemented in this class.
@injectable()
export class GovernanceBlockchainProvider
  implements IGovernanceBlockchainProvider
{
  protected initializeResult: ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  > | null = null;

  protected provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
    | null = null;
  protected signer: ethers.providers.JsonRpcSigner | null = null;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  /**
   * getProvider
   * @return ethers.providers.Web3Provider
   */
  public getProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    never
  > {
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
        throw new Error(
          "Initialization unsuccessful, you should not have called getProvider()",
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

  public getLatestBlock(): ResultAsync<
    ethers.providers.Block,
    BlockchainUnavailableError
  > {
    return this.getProvider().map(async (provider) => {
      return await provider.getBlock("latest");
    });
  }

  public initialize(): ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  > {
    if (this.initializeResult == null) {
      return this.configProvider.getConfig().andThen((config) => {
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

            // Return the values for use
            this.provider = provider;
            this.signer = provider.getSigner();

            const useMetamask = web3Modal.cachedProvider == "injected";
            const hypertokenAddress =
              config.chainAddresses[config.governanceChainId]
                ?.hypertokenAddress;
            /* if (useMetamask && hypertokenAddress != null) {
              return ResultUtils.combine([
                this.addNetwork(config.governanceChainId, config),
                this.addTokenAddress(
                  config,
                  useMetamask,
                  "HyperToken",
                  hypertokenAddress,
                ),
              ]).map(() => {});
            } */

            return okAsync(undefined);
          })
          .mapErr((e) => {
            this.logUtils.info(
              "Reverting to using JsonRPCProvider as the blockchain provider, waiting for a key or mnemonic to be provided.",
            );

            return e as BlockchainUnavailableError;
          });
      });
    }
    return this.initializeResult;
  }

  protected addNetwork(
    chainId: ChainId,
    config: GovernanceAppConfig,
  ): ResultAsync<void, BlockchainUnavailableError> {
    const network = config.chainProviders[chainId];
    if (network.includes("localhost")) {
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
    );
  }

  protected addTokenAddress(
    config: GovernanceAppConfig,
    useMetamask: boolean,
    tokenName: string,
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError> {
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
      );
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
    );
  }
}
