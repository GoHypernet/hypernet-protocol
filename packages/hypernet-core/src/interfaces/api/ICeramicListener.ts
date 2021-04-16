import { ResultAsync } from "neverthrow";
import { CeramicError, BlockchainUnavailableError } from "@hypernetlabs/objects";

export interface ICeramicListener {
  initialize(): ResultAsync<void, CeramicError | BlockchainUnavailableError>;
}
