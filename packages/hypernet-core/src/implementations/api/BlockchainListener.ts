import { ChainId, EthereumAccountAddress } from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { IBlockchainListener } from "@interfaces/api";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ethers } from "ethers";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@interfaces/utilities";
import { HypernetContext } from "@interfaces/objects";

@injectable()
export class BlockchainListener implements IBlockchainListener {
  protected mainProviderInitialized: boolean = false;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.blockchainProvider.getProvider(),
      this.contextProvider.getContext(),
    ]).map((vals) => {
      const [provider, context] = vals;

      if (this.mainProviderInitialized === false) {
        this.initializeMainProviderEvents(provider, context);
      }
    });
  }

  private initializeMainProviderEvents(
    provider: ethers.providers.JsonRpcProvider,
    context: HypernetContext,
  ) {
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: EthereumAccountAddress[]) => {
      this.logUtils.debug(
        `Accounts changed to ${accounts}. Need to refresh iframe and the UI`,
      );
      context.onAccountChanged.next(accounts[0]);
    });

    // Subscribe to chainId change
    provider.on("network", (network: { chainId: ChainId }) => {
      this.logUtils.debug(`Main provider chain changed to ${network.chainId}.`);
      context.onChainChanged.next(network.chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: ChainId }) => {
      this.logUtils.debug(
        `Main provider successfully connected to chain ${info.chainId}`,
      );
      context.onChainConnected.next(info.chainId);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      this.logUtils.debug(
        `Main provider has disconnected from the chain with code ${error.code} and message ${error.message}`,
      );
    });

    provider.on("error", (e) => {
      this.logUtils.error("Main provider has experienced an error");
      this.logUtils.error(e);
    });

    this.mainProviderInitialized = true;
  }
}
