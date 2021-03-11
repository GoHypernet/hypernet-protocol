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
        {
          [1337]: {
            channelFactoryAddress: "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
            transferRegistryAddress: "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F",
          },
        },
        "merchantIframeUrl",
        false, // debug is off for testing
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
