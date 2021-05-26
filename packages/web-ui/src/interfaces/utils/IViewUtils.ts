import { BigNumber } from "ethers";
import { EPaymentState } from "@hypernetlabs/objects";
import { PaymentStateOption } from "@web-ui/interfaces";

export interface IViewUtils {
  fromBigNumberWei(value: BigNumber): string;
  fromBigNumberEther(value: BigNumber): string;
  fromPaymentState(state: EPaymentState): string;
  fromPaymentStateColor(state: EPaymentState): string;
  getPaymentStateOptions(): PaymentStateOption[];
  fromTimestampToUI(dateTimestamp: number): string;
}
