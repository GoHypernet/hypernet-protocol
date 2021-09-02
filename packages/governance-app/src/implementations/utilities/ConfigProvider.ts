import { ILogUtils } from "@hypernetlabs/utils";
import { ChainId } from "@hypernetlabs/objects";
import {
  GovernanceAppConfig,
  HypernetChainAddresses,
} from "@governance-app/interfaces/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { IConfigProvider } from "@governance-app/interfaces/utilities";
import { ChainProviders } from "@governance-app/interfaces/objects";

declare const __CHAIN_PROVIDERS__: string;
declare const __CHAIN_ADDRESSES__: string;
declare const __GOVERNANCE_CHAIN_ID__: string;
declare const __INFURA_ID__: string;
declare const __DEBUG__: boolean;

export class ConfigProvider implements IConfigProvider {
  protected config: GovernanceAppConfig;

  constructor(protected logUtils: ILogUtils, config?: GovernanceAppConfig) {
    if (config != null) {
      this.config = config;
      return;
    }

    // Convert the __CHAIN_PROVIDERS__ and __CHAIN_ADDRESSES__ json to
    // proper objects
    const chainProvidersObj = JSON.parse(__CHAIN_PROVIDERS__);
    const chainProviders: ChainProviders = {};
    for (const chainIdStr in chainProvidersObj) {
      chainProviders[parseInt(chainIdStr)] = chainProvidersObj[chainIdStr];
    }

    const chainAddressesObj = JSON.parse(__CHAIN_ADDRESSES__);
    const chainAddresses: HypernetChainAddresses = {};
    for (const chainIdStr in chainAddressesObj) {
      chainAddresses[parseInt(chainIdStr)] = chainAddressesObj[chainIdStr];
    }

    this.config = new GovernanceAppConfig(
      chainProviders, // chainProviders
      chainAddresses, // chainAddresses
      ChainId(parseInt(__GOVERNANCE_CHAIN_ID__)), // governanceChainId
      __INFURA_ID__, // infuraId
      __DEBUG__, // debug
    );
  }

  public getConfig(): ResultAsync<GovernanceAppConfig, never> {
    return okAsync(this.config);
  }
}
