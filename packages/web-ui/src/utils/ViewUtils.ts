import { utils, BigNumber } from "ethers";

import { IViewUtils } from "@web-ui/interfaces";
import {
  EPaymentState,
  PaymentStatusViewModel,
  PaymentStatusParams,
} from "@hypernetlabs/objects";
import { getColorFromStatus, EStatusColor } from "@web-ui/theme";

export class ViewUtils implements IViewUtils {
  public fromBigNumberWei(value: any): string {
    return utils.formatUnits(value, "wei");
  }

  public fromBigNumberEther(value: any): string {
    return utils.formatUnits(value, "ether");
  }

  public fromPaymentState(state: EPaymentState): string {
    return this._factoryPaymentStatusViewModel(state).state;
  }

  public fromPaymentStateColor(state: EPaymentState): string {
    switch (state) {
      case EPaymentState.Finalized:
        return getColorFromStatus(EStatusColor.SUCCESS);

      case EPaymentState.Accepted ||
        EPaymentState.Approved ||
        EPaymentState.Staked:
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

  private _factoryPaymentStatusViewModel(
    state: EPaymentState,
  ): PaymentStatusViewModel {
    return new PaymentStatusViewModel(new PaymentStatusParams(state));
  }
}
