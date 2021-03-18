import { ResultAsync } from "neverthrow";
import { BlockchainUnavailableError, ThreeBoxError } from "@hypernetlabs/objects/errors";

export interface IMessagingListener {
  initialize(): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError>;
}
