import { BigNumber, EthereumAddress, PublicIdentifier, PublicKey, PullSettings } from "@interfaces/objects";
import { ELinkStatus } from "@interfaces/types";
import { Type, Transform } from "class-transformer";

export class HypernetLink {
  @Type(() => String)
  public id: string;

  @Type(() => String)
  public consumer: EthereumAddress;

  @Type(() => String)
  public provider: EthereumAddress;

  @Type(() => String)
  public paymentToken: EthereumAddress;

  @Type(() => String)
  public disputeMediator: PublicKey;

  @Type(() => PullSettings)
  public pullSettings: PullSettings | null;

  @Type(() => BigNumber)
  public consumerTotalDeposit: BigNumber;

  @Type(() => BigNumber)
  public consumerBalance: BigNumber;

  @Type(() => BigNumber)
  public providerBalance: BigNumber;

  @Type(() => BigNumber)
  public providerStake: BigNumber;

  @Transform((input) => ELinkStatus[input])
  public status: ELinkStatus;

  @Type(() => String)
  public internalChannelId: string | null;

  constructor(
    id: string,
    consumer: PublicIdentifier,
    provider: PublicIdentifier,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
    consumerTotalDeposit: BigNumber,
    consumerBalance: BigNumber,
    providerBalance: BigNumber,
    providerStake: BigNumber,
    status: ELinkStatus,
    internalChannelId: string | null,
  ) {
    this.id = id;
    this.consumer = consumer;
    this.provider = provider;
    this.paymentToken = paymentToken;
    this.disputeMediator = disputeMediator;
    this.pullSettings = pullSettings;
    this.consumerTotalDeposit = consumerTotalDeposit;
    this.consumerBalance = consumerBalance;
    this.providerBalance = providerBalance;
    this.providerStake = providerStake;
    this.status = status;
    this.internalChannelId = internalChannelId;
  }
}
