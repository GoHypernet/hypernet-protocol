import {
  EPaymentState,
  PaymentStatusViewModel,
  PaymentStatusParams,
  BigNumberString,
  EthereumAccountAddress,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { IViewUtils, PaymentStateOption } from "@web-ui/interfaces";
import { utils, BigNumber } from "ethers";

import { getColorFromStatus, EStatusColor } from "@web-ui/theme";

export class ViewUtils implements IViewUtils {
  public convertToWei(value: BigNumber | BigNumberString): string {
    return utils.formatUnits(value, "wei");
  }

  public convertToEther(value: BigNumber | BigNumberString): string {
    return utils.formatUnits(value, "ether");
  }

  public convertToBigNumber(value: number | string): BigNumber {
    return BigNumber.from(value);
  }

  public isZeroAddress(
    address: EthereumAccountAddress | EthereumContractAddress,
  ): boolean {
    return BigNumber.from(address).isZero();
  }

  public fromPaymentState(state: EPaymentState): string {
    return this._factoryPaymentStatusViewModel(state).state;
  }

  public fromPaymentStateColor(state: EPaymentState): string {
    switch (state) {
      case EPaymentState.Finalized ||
        EPaymentState.Accepted ||
        EPaymentState.Approved:
        return getColorFromStatus(EStatusColor.SUCCESS);

      case EPaymentState.Proposed || EPaymentState.Staked:
        return getColorFromStatus(EStatusColor.PRIMARY);

      case EPaymentState.InvalidFunds ||
        EPaymentState.InvalidProposal ||
        EPaymentState.InvalidStake ||
        EPaymentState.Rejected:
        return getColorFromStatus(EStatusColor.DANGER);

      default:
        return getColorFromStatus(EStatusColor.IDLE);
    }
  }

  public getPaymentStateOptions(): PaymentStateOption[] {
    return [
      new PaymentStateOption("All", "all"),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Accepted).state,
        EPaymentState.Accepted,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Approved).state,
        EPaymentState.Approved,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Borked).state,
        EPaymentState.Borked,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Canceled).state,
        EPaymentState.Canceled,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Finalized).state,
        EPaymentState.Finalized,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(
          EPaymentState.InsuranceReleased,
        ).state,
        EPaymentState.InsuranceReleased,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.InvalidFunds).state,
        EPaymentState.InvalidFunds,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(
          EPaymentState.InvalidProposal,
        ).state,
        EPaymentState.InvalidProposal,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.InvalidStake).state,
        EPaymentState.InvalidStake,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Proposed).state,
        EPaymentState.Proposed,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Rejected).state,
        EPaymentState.Rejected,
      ),
      new PaymentStateOption(
        this._factoryPaymentStatusViewModel(EPaymentState.Staked).state,
        EPaymentState.Staked,
      ),
    ];
  }
  public getProposalName(description: string): string {
    const seperatorIndex = description.lastIndexOf(":");
    const proposalName = description.substring(0, seperatorIndex);

    return proposalName;
  }

  public getProposalDescriptionHash(description: string): string {
    const seperatorIndex = description.lastIndexOf(":");
    const descriptionHash = description.substring(
      seperatorIndex + 1,
      description.length,
    );

    return descriptionHash;
  }

  private _factoryPaymentStatusViewModel(
    state: EPaymentState,
  ): PaymentStatusViewModel {
    return new PaymentStatusViewModel(new PaymentStatusParams(state));
  }
}
