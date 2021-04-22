import {
  BlockchainUnavailableError,
  ThreeBoxError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMessagingListener {
  initialize(): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError>;
}
