import { EPaymentState } from "@hypernetlabs/objects";
import { PaymentStateOption } from "@web-ui/interfaces";
import { BigNumber } from "ethers";

export interface IViewUtils {
  fromBigNumberWei(value: BigNumber): string;
  fromBigNumberEther(value: BigNumber): string;
  fromPaymentState(state: EPaymentState): string;
  fromPaymentStateColor(state: EPaymentState): string;
  getPaymentStateOptions(): PaymentStateOption[];
}
