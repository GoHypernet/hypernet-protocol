import { BigNumber } from "./BigNumber";

export class PullSettings {
  constructor(public maxAmountPerPull: BigNumber, public maxPullsPerHour: number) {}
}
