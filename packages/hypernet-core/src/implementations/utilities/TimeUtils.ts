import {
  BlockchainUnavailableError,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import moment from "moment";
import { okAsync, ResultAsync } from "neverthrow";

import { IBlockchainProvider, ITimeUtils } from "@interfaces/utilities";

export class TimeUtils implements ITimeUtils {
  protected lastBlockchainCheck: UnixTimestamp | undefined;
  protected lastBlockchainTimestamp: UnixTimestamp | undefined;
  constructor(protected blockchainProvider: IBlockchainProvider) {}

  public getUnixNow(): UnixTimestamp {
    return UnixTimestamp(moment().unix());
  }

  public getBlockchainTimestamp(): ResultAsync<
    UnixTimestamp,
    BlockchainUnavailableError
  > {
    const now = this.getUnixNow();

    // We can return a cached value if the last time we checked was this second
    if (
      this.lastBlockchainCheck != null &&
      this.lastBlockchainTimestamp != null &&
      this.lastBlockchainCheck >= now
    ) {
      return okAsync(this.lastBlockchainTimestamp);
    }

    this.lastBlockchainCheck = now;
    return this.blockchainProvider.getLatestBlock().map((block) => {
      this.lastBlockchainTimestamp = UnixTimestamp(block.timestamp);
      return this.lastBlockchainTimestamp;
    });
  }
}
