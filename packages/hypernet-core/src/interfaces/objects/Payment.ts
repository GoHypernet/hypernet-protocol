import * as moment from "moment";
import { BigNumber } from "@interfaces/objects";

export enum EPaymentState {
  Sent,
  Approved,
  Challenged,
}

export class Payment {
  constructor(
    public channelId: string,
    public amount: BigNumber,
    public createdTimestamp: moment.Moment,
    public updatedTimestamp: moment.Moment,
    public state: EPaymentState,
  ) {}
}
