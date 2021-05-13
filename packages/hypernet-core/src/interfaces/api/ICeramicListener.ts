import {
  CeramicError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICeramicListener {
  initialize(): ResultAsync<void, CeramicError | BlockchainUnavailableError>;
}
