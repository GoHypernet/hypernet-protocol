import {
  AuthorizedGatewaysSchema,
  DefinitionName,
  HypernetConfig,
  SchemaUrl,
} from "@hypernetlabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IConfigProvider } from "@interfaces/utilities";
import {
  chainId,
  defaultExpirationLength,
  hyperTokenAddress,
  routerPublicIdentifier,
} from "@mock/mocks";

export class ConfigProviderMock implements IConfigProvider {
  public config: HypernetConfig;

  constructor(config: HypernetConfig | null = null) {
    this.config =
      config ??
      new HypernetConfig(
        "iframeSource",
        routerPublicIdentifier,
        chainId,
        hyperTokenAddress,
        "hypernetProtocolDomain",
        defaultExpirationLength,
        {
          [1337]: "http://localhost:8545",
        },
        {
          [1337]: {
            channelFactoryAddress: "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
            transferRegistryAddress:
              "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F",
          },
        },
        "natsUrl",
        "authUrl",
        "merchantIframeUrl",
        "https://ceramic-clay.3boxlabs.com",
        new Map([
          [
            DefinitionName(AuthorizedGatewaysSchema.title),
            SchemaUrl(
              "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
            ),
          ],
        ]),
        5 * 1000,
        "HypernetProtocolControlClaims", // controlClaimSubject
        false, // debug is off for testing
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
