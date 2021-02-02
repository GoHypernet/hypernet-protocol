import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError, ThreeBoxError } from "@interfaces/objects/errors";

export interface IMessagingListener {
  initialize(): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError>;
}
