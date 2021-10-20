import {
  BigNumberString,
  EPaymentState,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { PaymentStateOption } from "@web-ui/interfaces";
import { BigNumber } from "ethers";

export interface IViewUtils {
  convertToWei(value: BigNumber | BigNumberString): string;
  convertToEther(value: BigNumber | BigNumberString): string;
  fromPaymentState(state: EPaymentState): string;
  fromPaymentStateColor(state: EPaymentState): string;
  getPaymentStateOptions(): PaymentStateOption[];
  toBigNumber(value: number | string): BigNumber;
  isZeroAddress(address: EthereumAddress): boolean;
}
