import { UnixTimestamp } from "@hypernetlabs/objects";
import moment from "moment";

import { ITimeUtils } from "@utils/ITimeUtils";

export class TimeUtils implements ITimeUtils {
  protected lastBlockchainCheck: UnixTimestamp | undefined;
  protected lastBlockchainTimestamp: UnixTimestamp | undefined;
  constructor() {}

  public getUnixNow(): UnixTimestamp {
    return UnixTimestamp(moment().unix());
  }
}
