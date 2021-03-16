import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";

export interface ITimeUtils {
  getUnixNow(): number;
  getBlockchainTimestamp(): ResultAsync<number, BlockchainUnavailableError>;
}
