import {
  BlockchainUnavailableError,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { ITimeUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainTimeUtils,
} from "@interfaces/utilities";
import { injectable } from "inversify";

injectable();
export class BlockchainTimeUtils implements IBlockchainTimeUtils {
  protected lastBlockchainCheck: UnixTimestamp | undefined;
  protected lastBlockchainTimestamp: UnixTimestamp | undefined;
  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected timeUtils: ITimeUtils,
  ) {}

  public getBlockchainTimestamp(): ResultAsync<
    UnixTimestamp,
    BlockchainUnavailableError
  > {
    const now = this.timeUtils.getUnixNow();

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
