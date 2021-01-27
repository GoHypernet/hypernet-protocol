import { HypernetConfig } from "@interfaces/objects";
import { IConfigProvider } from "@interfaces/utilities";
import { chainId, routerPublicIdentifier } from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";

export class ConfigProviderMock implements IConfigProvider {
  public config: HypernetConfig;
  
    constructor(config: HypernetConfig | null = null) {
    this.config = config ?? new HypernetConfig(
        "iframeSource",
        "routerMnemonic",
        routerPublicIdentifier,
        chainId,
        "routerUrl",
        "hypertokenAddress",
        "hypernetProtocolDomain",
        5000,
        {
          [1337]: "http://localhost:8545",
        },
      );
  }
  
    getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
