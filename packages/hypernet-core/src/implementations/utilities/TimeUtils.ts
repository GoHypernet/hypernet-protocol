import { okAsync, ResultAsync } from "neverthrow";
import { BlockchainUnavailableError } from "@hypernetlabs/objects";
import { IBlockchainProvider, ITimeUtils } from "@interfaces/utilities";
import moment from "moment";

export class TimeUtils implements ITimeUtils {
  protected lastBlockchainCheck: number | undefined;
  protected lastBlockchainTimestamp: number | undefined;
  constructor(protected blockchainProvider: IBlockchainProvider) {}

  public getUnixNow(): number {
    return moment().unix();
  }

  public getBlockchainTimestamp(): ResultAsync<number, BlockchainUnavailableError> {
    const now = this.getUnixNow();

    // We can return a cached value if the last time we checked was this second
    if (this.lastBlockchainCheck != null && this.lastBlockchainTimestamp != null && this.lastBlockchainCheck >= now) {
      return okAsync(this.lastBlockchainTimestamp);
    }

    this.lastBlockchainCheck = now;
    return this.blockchainProvider.getLatestBlock().map((block) => {
      this.lastBlockchainTimestamp = block.timestamp;
      return block.timestamp;
    });
  }
}
