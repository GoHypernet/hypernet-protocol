import {
  AuthorizedGatewaysSchema,
  ChainId,
  DefinitionName,
  GovernanceChainInformation,
  SchemaUrl,
  chainConfig,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { HypernetConfig } from "@interfaces/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { IConfigProvider } from "@interfaces/utilities";

declare const __IFRAME_SOURCE__: string;
declare const __NATS_URL__: string;
declare const __AUTH_URL__: string;
declare const __VALIDATOR_IFRAME_URL__: string;
declare const __CERAMIC_NODE_URL__: string;
declare const __DEBUG__: boolean;

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(protected logUtils: ILogUtils, config?: Partial<HypernetConfig>) {
    const governanceChainId = config?.governanceChainId || ChainId(1); // default to mainnet
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
      config?.iframeSource || __IFRAME_SOURCE__, // iframeSource
      governanceChainId, // governanceChainId
      config?.chainInformation || chainConfig, // chainInfo
      config?.governanceChainInformation || governanceChainInformation, // governanceChainInformation
      config?.hypernetProtocolDomain || "Hypernet", // Hypernet Protocol Domain for Transfers
      config?.defaultPaymentExpiryLength || 5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      config?.natsUrl || __NATS_URL__, // natsUrl
      config?.authUrl || __AUTH_URL__, // authUrl
      config?.gatewayIframeUrl || __VALIDATOR_IFRAME_URL__, // gatewayIframeUrl
      config?.ceramicNodeUrl || __CERAMIC_NODE_URL__, // ceramicNodeUrl,
      config?.storageAliases ||
        new Map([
          [
            DefinitionName(AuthorizedGatewaysSchema.title),
            SchemaUrl(
              "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
            ),
          ],
        ]), // storageAliases
      config?.gatewayDeauthorizationTimeout || 5 * 1000,
      config?.controlClaimSubject || "HypernetProtocolControlClaims",
      config?.requireOnline || true, // requireOnline
      config?.debug || __DEBUG__, // debug
    );

    this.logUtils.debug("Using Configuration", this.config);
  }

  public getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
