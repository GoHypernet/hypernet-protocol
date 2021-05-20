import { BigNumber } from "ethers";

export interface IViewUtils {
  fromBigNumber(value: BigNumber): number;
}
