import { BigNumber } from "ethers";

export class PullAmount {
  constructor(public amount: BigNumber, public date: number) {}
}
