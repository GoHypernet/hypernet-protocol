import { BigNumber } from "ethers";

import { IViewUtils } from "@web-ui/interfaces";

export class ViewUtils implements IViewUtils {
  public fromBigNumber(value: BigNumber): number {
    return parseInt(value._hex) / 1000000000000000000;
  }
}
