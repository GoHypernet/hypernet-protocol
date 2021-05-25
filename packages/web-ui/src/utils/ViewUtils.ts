import { utils, BigNumber } from "ethers";

import { IViewUtils, PaymentStateOption } from "@web-ui/interfaces";
import {
  EPaymentState,
  PaymentStatusViewModel,
  PaymentStatusParams,
} from "@hypernetlabs/objects";
import { getColorFromStatus, EStatusColor } from "@web-ui/theme";

export class ViewUtils implements IViewUtils {
  public fromBigNumberWei(value: BigNumber): string {
    return utils.formatUnits(value, "wei");
  }

  public fromBigNumberEther(value: BigNumber): string {
    return utils.formatUnits(value, "ether");
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
        this._factoryPaymentStatusViewModel(EPaymentState.Challenged).state,
        EPaymentState.Challenged,
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

  private _factoryPaymentStatusViewModel(
    state: EPaymentState,
  ): PaymentStatusViewModel {
    return new PaymentStatusViewModel(new PaymentStatusParams(state));
  }
}
