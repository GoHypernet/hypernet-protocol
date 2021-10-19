import {
  BigNumberString,
  EPaymentState,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { PaymentStateOption } from "@web-ui/interfaces";
import { BigNumber } from "ethers";

export interface IViewUtils {
  fromBigNumberWei(value: BigNumber | BigNumberString): string;
  fromBigNumberEther(value: BigNumber | BigNumberString): string;
  fromPaymentState(state: EPaymentState): string;
  fromPaymentStateColor(state: EPaymentState): string;
  getPaymentStateOptions(): PaymentStateOption[];
  toBigNumber(value: number | string): BigNumber;
  isZeroAddress(address: EthereumAddress): boolean;
}
