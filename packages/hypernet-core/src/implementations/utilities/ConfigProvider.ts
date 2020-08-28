import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { HypernetConfig } from "@interfaces/objects/HypernetConfig";

export class ConfigProvider implements IConfigProvider {
  public async getConfig(): Promise<HypernetConfig> {
    return Promise.resolve(new HypernetConfig("HypernetProtocol", "openChannels", "linkData"));
  }
}
