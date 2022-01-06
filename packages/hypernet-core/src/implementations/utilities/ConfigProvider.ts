import {
  AuthorizedGatewaysSchema,
  LazyMintingSignatureSchema,
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
      config?.ceramicDataModel || {
        definitions: {
          [AuthorizedGatewaysSchema.title]:
            "kjzl6cwe1jw148xm690vbhrn5fwiiqjm4kmvnb8jzhktzdh3tcztzwuxoi8hl5n",
          [LazyMintingSignatureSchema.title]:
            "kjzl6cwe1jw149w5y2jco0iwlsinh9eqr1tcvke8g2vc8fuqnc27c03slt32xdg",
        },
        schemas: {
          [AuthorizedGatewaysSchema.title]:
            "ceramic://k3y52l7qbv1frycmgeghbfxd4qqh718tp4s2fd7wnmz5vhy7f3lvhcvl1w2lggglc",
          [LazyMintingSignatureSchema.title]:
            "ceramic://k3y52l7qbv1frxidmfxooh1msxevtqxv027zwc9t6bn9gcr6uytgr22snsj7lqxog",
        },
        tiles: {},
      }, // ceramicDataModel
      config?.gatewayDeauthorizationTimeout || 5 * 1000, // gatewayDeauthorizationTimeout
      config?.controlClaimSubject || "HypernetProtocolControlClaims",
      config?.requireOnline == null ? true : config?.requireOnline, // requireOnline
      config?.governanceRequired == null ? true : config?.governanceRequired, // governanceRequired
      config?.paymentsRequired == null ? true : config?.paymentsRequired, // paymentsRequired
      config?.debug == null ? __DEBUG__ : config?.debug, // debug
    );

    this.logUtils.debug("Using Configuration", this.config);
  }

  public getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
