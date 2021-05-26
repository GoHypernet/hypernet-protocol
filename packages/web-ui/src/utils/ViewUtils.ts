import { IViewUtils } from "@web-ui/interfaces";
import { BigNumber } from "ethers";

export class ViewUtils implements IViewUtils {
  public fromBigNumber(value: BigNumber): number {
    return parseInt(value._hex) / 1000000000000000000;
  }
}
