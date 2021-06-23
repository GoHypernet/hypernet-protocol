import {
  BlockchainUnavailableError,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getBlockchainTimestamp(): ResultAsync<
    UnixTimestamp,
    BlockchainUnavailableError
  >;
}
