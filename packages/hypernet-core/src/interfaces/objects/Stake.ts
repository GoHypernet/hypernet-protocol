import { BigNumber } from "@interfaces/objects";

export class Stake {
  constructor(
    public id: number,
    public amount: BigNumber,
    public type: "deposit" | "withdrawal",
    public state: string,
  ) {}
}
