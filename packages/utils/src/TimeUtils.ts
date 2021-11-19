import { UnixTimestamp } from "@hypernetlabs/objects";
import { injectable } from "inversify";

import { ITimeUtils } from "@utils/ITimeUtils";

@injectable()
export class TimeUtils implements ITimeUtils {
  protected lastBlockchainCheck: UnixTimestamp | undefined;
  protected lastBlockchainTimestamp: UnixTimestamp | undefined;
  constructor() {}

  public getUnixNow(): UnixTimestamp {
    return UnixTimestamp(Math.floor(Date.now() / 1000));
  }
}
