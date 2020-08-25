import { BigNumber, EthereumAddress, PublicKey, PullSettings } from "@interfaces/objects";
import { ELinkStatus } from "@interfaces/types";

export class HypernetLink {
  constructor(
    public id: string,
    public consumer: EthereumAddress,
    public provider: EthereumAddress,
    public paymentToken: EthereumAddress,
    public disputeMediator: PublicKey,
    public pullSettings: PullSettings,
    public consumerTotalDeposit: BigNumber,
    public consumerBalance: BigNumber,
    public providerBalance: BigNumber,
    public providerStake: BigNumber,
    public status: ELinkStatus,
    public internalChannelId: string | null,
    public threadAddress: EthereumAddress | null,
  ) {}
}
