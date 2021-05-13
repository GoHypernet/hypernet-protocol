import {
  PersistenceError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICeramicListener {
  initialize(): ResultAsync<void, PersistenceError | BlockchainUnavailableError>;
}
