import { LogicalError } from "@hypernetlabs/objects";
import { HypernetConfig } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IConfigProvider {
  getConfig(): ResultAsync<HypernetConfig, never>;
}
