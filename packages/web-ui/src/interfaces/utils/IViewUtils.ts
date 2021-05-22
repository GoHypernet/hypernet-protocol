import { EPaymentState } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";

export interface IViewUtils {
  fromBigNumberWei(value: any): string;
  fromBigNumberEther(value: any): string;
  fromPaymentState(state: EPaymentState): string;
  fromPaymentStateColor(state: EPaymentState): string;
}
