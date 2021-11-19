import {
  AuthorizedGatewaysSchema,
  ChainId,
  DefinitionName,
  GovernanceChainInformation,
  SchemaUrl,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { HypernetConfig } from "@interfaces/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { chainConfig } from "@implementations/configuration/chains.config";
import { IConfigProvider } from "@interfaces/utilities";

declare const __IFRAME_SOURCE__: string;
declare const __NATS_URL__: string;
declare const __AUTH_URL__: string;
declare const __VALIDATOR_IFRAME_URL__: string;
declare const __CERAMIC_NODE_URL__: string;
declare const __DEBUG__: boolean;
declare const __GOVERNANCE_CHAIN_ID__: string;

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(protected logUtils: ILogUtils, config?: HypernetConfig) {
    if (config != null) {
      this.config = config;
      return;
    }

    const governanceChainId = ChainId(parseInt(__GOVERNANCE_CHAIN_ID__));
    const governanceChainInformation = chainConfig.get(governanceChainId);

    if (governanceChainInformation == null) {
      throw new Error(
        `Invalid configuration! No ChainInformation exists for governance chain ${governanceChainId}`,
      );
    }

    if (!(governanceChainInformation instanceof GovernanceChainInformation)) {
      throw new Error(
        `Invalid configuration! Governance chain ${governanceChainId} is not a GovernanceChainInformation`,
      );
    }

    this.config = new HypernetConfig(
      __IFRAME_SOURCE__, // iframeSource
      governanceChainId, // governanceChainId
      chainConfig, // chainInfo
      governanceChainInformation, // governanceChainInformation
      "Hypernet", // Hypernet Protocol Domain for Transfers
      5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      __NATS_URL__, // natsUrl
      __AUTH_URL__, // authUrl
      __VALIDATOR_IFRAME_URL__, // gatewayIframeUrl
      __CERAMIC_NODE_URL__, // ceramicNodeUrl,
      new Map([
        [
          DefinitionName(AuthorizedGatewaysSchema.title),
          SchemaUrl(
            "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
          ),
        ],
      ]), // storageAliases
      5 * 1000,
      "HypernetProtocolControlClaims",
      true, // requireOnline
      __DEBUG__, // debug
    );

    this.logUtils.debug("Using Configuration", this.config);
  }

  public getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
