import {
  BigNumberString,
  EPaymentState,
  EthereumAccountAddress,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { PaymentStateOption } from "@web-ui/interfaces";
import { BigNumber } from "ethers";

export interface IViewUtils {
  convertToWei(value: BigNumber | BigNumberString): string;
  convertToEther(value: BigNumber | BigNumberString): string;
  fromPaymentState(state: EPaymentState): string;
  fromPaymentStateColor(state: EPaymentState): string;
  getPaymentStateOptions(): PaymentStateOption[];
  getProposalName(description: string): string;
  getProposalDescriptionHash(description: string): string
  convertToBigNumber(value: number | string): BigNumber;
  isZeroAddress(
    address: EthereumAccountAddress | EthereumContractAddress,
  ): boolean;
}
