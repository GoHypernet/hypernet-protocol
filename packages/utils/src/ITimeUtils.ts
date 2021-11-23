import { UnixTimestamp } from "@hypernetlabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
