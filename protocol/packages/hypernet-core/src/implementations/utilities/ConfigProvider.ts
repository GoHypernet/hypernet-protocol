import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { HypernetConfig } from "@interfaces/objects/HypernetConfig";

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(config?: HypernetConfig) {
    if (config == null) {
      this.config = new HypernetConfig(
        "HypernetProtocol",
        "openChannels",
        "linkData",
        "HypernetLinkDiscovery",
        "HypernetControl",
        "openThreads",
        "localhost:3055"
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
