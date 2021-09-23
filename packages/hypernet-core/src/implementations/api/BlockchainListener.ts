import { ChainId, EthereumAddress } from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { IBlockchainListener } from "@interfaces/api";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";

@injectable()
export class BlockchainListener implements IBlockchainListener {
  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.blockchainProvider.getProvider(),
      this.blockchainProvider.getGovernanceProvider(),
      this.configProvider.getConfig(),
    ]).map((vals) => {
      const [provider, governanceProvider, config] = vals;
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts: EthereumAddress[]) => {
        this.logUtils.debug(accounts);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId: ChainId) => {
        this.logUtils.debug(chainId);
      });

      // Subscribe to provider connection
      provider.on("connect", (info: { chainId: ChainId }) => {
        this.logUtils.debug(info);
      });

      // Subscribe to provider disconnection
      provider.on("disconnect", (error: { code: number; message: string }) => {
        this.logUtils.debug(error);
      });

      governanceProvider.on(
        "accountsChanged",
        (accounts: EthereumAddress[]) => {
          this.logUtils.warning(
            `Goveranance accounts changed. Governance is read only so this is not yet an error, but this should never happen. The accounts are: ${accounts}`,
          );
        },
      );

      // Subscribe to chainId change
      governanceProvider.on("chainChanged", (chainId: ChainId) => {
        this.logUtils.error(
          `Governance chain changed to ${chainId}, it should be ${config.governanceChainId}. This should never happen!`,
        );
      });

      // Subscribe to provider connection
      governanceProvider.on("connect", (info: { chainId: ChainId }) => {
        this.logUtils.debug(info);
      });

      // Subscribe to provider disconnection
      governanceProvider.on(
        "disconnect",
        (error: { code: number; message: string }) => {
          this.logUtils.debug(error);
        },
      );

      governanceProvider.on("error", (e) => {
        this.logUtils.error(e);
      });
    });
  }
}
