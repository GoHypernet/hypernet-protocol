import { BigNumberString } from "@objects/BigNumberString";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export class SendFundsRequestData {
  constructor(
    public requestIdentifier: string,
    public channelAddress: EthereumContractAddress,
    public recipientPublicIdentifier: PublicIdentifier,
    public amount: BigNumberString,
    public expirationDate: UnixTimestamp,
    public requiredStake: BigNumberString,
    public paymentToken: EthereumContractAddress,
    public metadata: string | null,
  ) {}
}
