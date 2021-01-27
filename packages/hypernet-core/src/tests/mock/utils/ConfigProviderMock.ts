import { HypernetConfig } from "@interfaces/objects";
import { IConfigProvider } from "@interfaces/utilities";
import { HyperMock } from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";

export class ConfigProviderMock extends HyperMock implements IConfigProvider {
  public config: HypernetConfig;
  
    constructor(config: HypernetConfig | null = null) {
      super();
    this.config = config ?? new HypernetConfig(
        "iframeSource",
        "routerMnemonic",
        "routerPublicIdentifier",
        1337,
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
    this.recordCall("getConfig", arguments);
    return okAsync(this.config);
  }
}
