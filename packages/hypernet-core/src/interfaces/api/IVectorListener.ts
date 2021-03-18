import { ResultAsync } from "neverthrow";
import { LogicalError } from "@hypernetlabs/objects/errors";

export interface IVectorListener {
  setup(): ResultAsync<void, LogicalError>;
}
