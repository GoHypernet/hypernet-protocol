import { BigNumberString } from "@objects/BigNumberString";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export class AuthorizeFundsRequestData {
  constructor(
    public requestIdentifier: string,
    public channelAddress: EthereumContractAddress,
    public recipientPublicIdentifier: PublicIdentifier,
    public totalAuthorized: BigNumberString,
    public expirationDate: UnixTimestamp,
    public deltaAmount: BigNumberString,
    public deltaTime: number,
    public requiredStake: BigNumberString,
    public paymentToken: EthereumContractAddress,
    public metadata: string,
  ) {}
}
