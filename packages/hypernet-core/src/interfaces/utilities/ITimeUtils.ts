import { BlockchainUnavailableError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITimeUtils {
  getUnixNow(): number;
  getBlockchainTimestamp(): ResultAsync<number, BlockchainUnavailableError>;
}
