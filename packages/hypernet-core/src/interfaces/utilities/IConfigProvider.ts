import { ResultAsync } from "neverthrow";
import { LogicalError } from "@hypernetlabs/objects";
import { HypernetConfig } from "@hypernetlabs/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IConfigProvider {
  getConfig(): ResultAsync<HypernetConfig, never>;
}
