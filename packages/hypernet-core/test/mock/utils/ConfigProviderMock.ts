import { HypernetConfig } from "@interfaces/objects";
import { IConfigProvider } from "@interfaces/utilities";
import { chainId, defaultExpirationLength, hyperTokenAddress, routerPublicIdentifier } from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";

export class ConfigProviderMock implements IConfigProvider {
  public config: HypernetConfig;

  constructor(config: HypernetConfig | null = null) {
    this.config =
      config ??
      new HypernetConfig(
        "iframeSource",
        "routerMnemonic",
        routerPublicIdentifier,
        chainId,
        "routerUrl",
        hyperTokenAddress,
        "hypernetProtocolDomain",
        defaultExpirationLength,
        {
          [1337]: "http://localhost:8545",
        },
        "hypernetProtocolSpace",
        "openThreadKey",
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
