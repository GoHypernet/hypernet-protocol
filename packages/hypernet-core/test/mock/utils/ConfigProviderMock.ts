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
        {
          definitions: {
            [AuthorizedGatewaysSchema.title]:
              "kjzl6cwe1jw147sl129srofw2tmyw8ln80janj1he23vp95bly1zahc9mdkpzw5",
          },
          schemas: {
            [AuthorizedGatewaysSchema.title]:
              "ceramic://k3y52l7qbv1fryi3az9mgiugaxh6jsny0jua15ztop9em6xx3p4wqx1g39fclpnuo",
          },
          tiles: {},
        }, // ceramicDataModel
        5 * 1000, // gatewayDeauthorizationTimeout
        "HypernetProtocolControlClaims", // controlClaimSubject
        false, // requireOnline
        true,
        true,
        "ipfsApiUrl",
        "ipfsGatewayUrl",
        false, // debug is off for testing
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
