import { ChainAddresses, ChainProviders } from "@connext/vector-types";
import {
  EthereumAddress,
  HypernetConfig,
  PublicIdentifier,
  AuthorizedMerchantsSchema,
  DefinitionName,
  SchemaUrl,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { constants } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";

import { IConfigProvider } from "@interfaces/utilities";

declare const __IFRAME_SOURCE__: string;
declare const __ROUTER_PUBLIC_IDENTIFIER__: PublicIdentifier;
declare const __CHAIN_ID__: number;
declare const __CHAIN_PROVIDERS__: string;
declare const __CHAIN_ADDRESSES__: string;
declare const __NATS_URL__: string;
declare const __AUTH_URL__: string;
declare const __VALIDATOR_IFRAME_URL__: string;
declare const __CERAMIC_NODE_URL__: string;
declare const __DEBUG__: boolean;

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(protected logUtils: ILogUtils, config?: HypernetConfig) {
    if (config != null) {
      this.config = config;
      return;
    }

    this.config = new HypernetConfig(
      __IFRAME_SOURCE__, // iframeSource
      __ROUTER_PUBLIC_IDENTIFIER__, // routerPublicIdentifier
      __CHAIN_ID__, // Chain ID
      EthereumAddress(constants.AddressZero), // Hypertoken address,
      "Hypernet", // Hypernet Protocol Domain for Transfers
      5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      JSON.parse(__CHAIN_PROVIDERS__) as ChainProviders, // chainProviders
      JSON.parse(__CHAIN_ADDRESSES__) as ChainAddresses, // chainAddresses
      JSON.parse(__NATS_URL__), // natsUrl
      JSON.parse(__AUTH_URL__), // authUrl
      __VALIDATOR_IFRAME_URL__, // merchantIframeUrl
      __CERAMIC_NODE_URL__, // ceramicNodeUrl,
      new Map([
        [
          DefinitionName(AuthorizedMerchantsSchema.title),
          SchemaUrl(
            "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
          ),
        ],
      ]),
      __DEBUG__, // debug
    );
  }

  public getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
