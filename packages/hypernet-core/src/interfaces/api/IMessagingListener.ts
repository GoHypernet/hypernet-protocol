import { ResultAsync } from "neverthrow";
import { BlockchainUnavailableError, ThreeBoxError } from "@hypernetlabs/objects";

export interface IMessagingListener {
  initialize(): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError>;
}
