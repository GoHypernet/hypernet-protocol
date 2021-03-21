import { ResultAsync } from "neverthrow";
import { LogicalError } from "@hypernetlabs/objects";

export interface IVectorListener {
  setup(): ResultAsync<void, LogicalError>;
}
