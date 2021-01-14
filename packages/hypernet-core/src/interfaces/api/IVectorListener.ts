import { ResultAsync } from "@interfaces/objects";
import { LogicalError } from "@interfaces/objects/errors";

export interface IVectorListener {
  setup(): ResultAsync<void, LogicalError>;
}
