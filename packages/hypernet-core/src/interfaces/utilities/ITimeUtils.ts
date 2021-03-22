import { ResultAsync } from "neverthrow";
import { BlockchainUnavailableError } from "@hypernetlabs/objects";

export interface ITimeUtils {
  getUnixNow(): number;
  getBlockchainTimestamp(): ResultAsync<number, BlockchainUnavailableError>;
}
