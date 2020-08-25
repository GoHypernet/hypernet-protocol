import { HypernetConfig } from "@interfaces/objects/HypernetConfig";

export interface IConfigProvider {
  getConfig(): Promise<HypernetConfig>;
}
