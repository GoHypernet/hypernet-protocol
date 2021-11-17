import { ChainId, EthereumAccountAddress } from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { IBlockchainListener } from "@interfaces/api";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@interfaces/utilities";

@injectable()
export class BlockchainListener implements IBlockchainListener {
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
      this.blockchainProvider.getGovernanceProvider(),
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map((vals) => {
      const [provider, governanceProvider, config, context] = vals;
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts: EthereumAccountAddress[]) => {
        this.logUtils.debug(
          `Accounts changed to ${accounts}. Need to refresh iframe and the UI`,
        );
        context.onAccountChanged.next(accounts[0]);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId: ChainId) => {
        this.logUtils.debug(
          `Main provider chain changed to ${chainId}. Need to refresh the iframe and the UI`,
        );
        context.onChainChanged.next(chainId);
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

      // The governance provider may or may not be the same as the main provider, but it does have a whole different set of events.
      governanceProvider.on(
        "accountsChanged",
        (accounts: EthereumAccountAddress[]) => {
          this.logUtils.warning(
            `Goveranance accounts changed. Governance is read only so this is not yet an error, but this should never happen. The accounts are: ${accounts}`,
          );
          context.onGovernanceAccountChanged.next(accounts[0]);
        },
      );

      // Subscribe to chainId change
      governanceProvider.on("chainChanged", (chainId: ChainId) => {
        this.logUtils.error(
          `Governance chain changed to ${chainId}, it should be ${config.governanceChainId}. This should never happen!`,
        );
        context.onGovernanceChainChanged.next(chainId);
      });

      // Subscribe to provider connection
      governanceProvider.on("connect", (info: { chainId: ChainId }) => {
        this.logUtils.debug(
          `Governance provider successfully connected to chain ${info.chainId}`,
        );
        context.onGovernanceChainConnected.next(info.chainId);
      });

      // Subscribe to provider disconnection
      governanceProvider.on(
        "disconnect",
        (error: { code: number; message: string }) => {
          this.logUtils.debug(
            `Governance provider has disconnected from the chain with code ${error.code} and message ${error.message}`,
          );
        },
      );

      governanceProvider.on("error", (e) => {
        this.logUtils.error("Governance provider has experienced an error");
        this.logUtils.error(e);
      });
    });
  }
}
