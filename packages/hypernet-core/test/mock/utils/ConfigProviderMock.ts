import {
  AuthorizedGatewaysSchema,
  ChainId,
  ChainInformation,
  DefinitionName,
  SchemaUrl,
} from "@hypernetlabs/objects";
import { HypernetConfig } from "@interfaces/objects";
import {
  chainId,
  defaultExpirationLength,
  governanceChainInformation,
} from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";

import { IConfigProvider } from "@interfaces/utilities";

export class ConfigProviderMock implements IConfigProvider {
  public config: HypernetConfig;

  constructor(config: HypernetConfig | null = null) {
    this.config =
      config ??
      new HypernetConfig(
        "iframeSource", // iframeSource
        chainId, // governanceChainId
        new Map<ChainId, ChainInformation>([
          [chainId, governanceChainInformation],
        ]), // chainInformation
        governanceChainInformation, // governanceChainInformation
        "hypernetProtocolDomain", // hypernetProtocolDomain
        defaultExpirationLength, // defaultPaymentExpiryLength
        "natsUrl", // natsUrl
        "authUrl", // authUrl
        "gatewayIframeUrl", // gatewayIframeUrl
        "https://ceramic-clay.3boxlabs.com", // ceramicNodeUrl
        new Map([
          [
            DefinitionName(AuthorizedGatewaysSchema.title),
            SchemaUrl(
              "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
            ),
          ],
        ]), // storageAliases
        5 * 1000, // gatewayDeauthorizationTimeout
        "HypernetProtocolControlClaims", // controlClaimSubject
        false, // requireOnline
        true,
        true,
        false, // debug is off for testing
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
