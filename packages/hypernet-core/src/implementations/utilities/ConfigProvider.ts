import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { HypernetConfig } from "@interfaces/objects/HypernetConfig";

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(config?: HypernetConfig) {
    if (config == null) {
      this.config = new HypernetConfig(
        "https://messaging.connext.network",
        "ws://messaging.connext.network:4221",
        {
          "1337": {
            "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
            "channelMastercopyAddress": "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0",
            "transferRegistryAddress": "0x345cA3e014Aaf5dcA488057592ee47305D9B3e10"
          },
          "1338": {
            "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
            "channelMastercopyAddress": "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0",
            "transferRegistryAddress": "0x345cA3e014Aaf5dcA488057592ee47305D9B3e10"
          }
        },
        {
          "1337": "http://localhost:8545",
          "1338": "http://localhost:8546"
        },
        "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
      )
    }
    else {
      this.config = config;
    }
  }

  public async getConfig(): Promise<HypernetConfig> {
    return Promise.resolve(
      this.config
    );
  }
}


