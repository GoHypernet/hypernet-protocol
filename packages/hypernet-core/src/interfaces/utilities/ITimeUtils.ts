import { ResultAsync } from "neverthrow";
import { BlockchainUnavailableError } from "@hypernetlabs/objects/errors";

export interface ITimeUtils {
  getUnixNow(): number;
  getBlockchainTimestamp(): ResultAsync<number, BlockchainUnavailableError>;
}
