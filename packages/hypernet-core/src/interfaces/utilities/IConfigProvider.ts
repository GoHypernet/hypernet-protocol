import { ResultAsync } from "@interfaces/objects";
import { HypernetConfig } from "@interfaces/objects/HypernetConfig";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IConfigProvider {
  getConfig(): ResultAsync<HypernetConfig, Error>;
}
