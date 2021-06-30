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
declare const __CHAIN_ID__: string;
declare const __CHAIN_PROVIDERS__: string;
declare const __CHAIN_ADDRESSES__: string;
declare const __NATS_URL__: string;
declare const __AUTH_URL__: string;
declare const __VALIDATOR_IFRAME_URL__: string;
declare const __CERAMIC_NODE_URL__: string;
declare const __DEBUG__: boolean;
declare const __HYPERTOKEN_ADDRESS__: EthereumAddress;

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(protected logUtils: ILogUtils, config?: HypernetConfig) {
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
    const chainAddresses: ChainAddresses = {};
    for (const chainIdStr in chainAddressesObj) {
      chainAddresses[parseInt(chainIdStr)] = chainAddressesObj[chainIdStr];
    }

    this.config = new HypernetConfig(
      __IFRAME_SOURCE__, // iframeSource
      __ROUTER_PUBLIC_IDENTIFIER__, // routerPublicIdentifier
      parseInt(__CHAIN_ID__, 10), // Chain ID
      __HYPERTOKEN_ADDRESS__, // Hypertoken address,
      "Hypernet", // Hypernet Protocol Domain for Transfers
      5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      chainProviders, // chainProviders
      chainAddresses, // chainAddresses
      __NATS_URL__, // natsUrl
      __AUTH_URL__, // authUrl
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
      5 * 1000,
      "HypernetProtocolControl",
      __DEBUG__, // debug
    );
  }

  public getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
