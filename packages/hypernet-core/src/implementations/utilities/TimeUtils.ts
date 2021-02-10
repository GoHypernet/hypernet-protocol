import { ITimeUtils } from "@interfaces/utilities";
import moment from "moment";

export class TimeUtils implements ITimeUtils {
  getUnixNow(): number {
    return moment().unix();
  }
}
