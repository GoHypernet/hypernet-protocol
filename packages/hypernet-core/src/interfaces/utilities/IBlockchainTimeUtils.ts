import {
  BlockchainUnavailableError,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainTimeUtils {
  getBlockchainTimestamp(): ResultAsync<
    UnixTimestamp,
    BlockchainUnavailableError
  >;
}

export const IBlockchainTimeUtilsType = Symbol.for("IBlockchainTimeUtils");
