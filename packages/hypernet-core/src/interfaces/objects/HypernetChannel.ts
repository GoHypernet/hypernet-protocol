import { BigNumber, Address } from "@interfaces/objects";
import { EChannelState } from "@interfaces/types";

export class HypernetChannel {
  constructor(
    public consumer: Address,
    public provider: Address,
    public paymentToken: Address,
    public consumerTotalDeposit: BigNumber,
    public consumerBalance: BigNumber,
    public providerBalance: BigNumber,
    public providerStake: BigNumber,
    public state: EChannelState,
    public internalChannelId: string | null,
  ) {}

  public get id(): string {
    // return hash(this.consumer, this.provider);
    return "";
  }
}
