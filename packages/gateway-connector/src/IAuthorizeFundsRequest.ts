import {
  BigNumberString,
  EthereumAddress,
  PublicIdentifier,
  UnixTimestamp,
} from "@hypernetlabs/objects";

export interface IAuthorizeFundsRequest {
  channelAddress: EthereumAddress;
  recipientPublicIdentifier: PublicIdentifier;
  totalAuthorized: BigNumberString;
  expirationDate: UnixTimestamp;
  deltaAmount: BigNumberString;
  deltaTime: number;
  requiredStake: BigNumberString;
  paymentToken: EthereumAddress;
  metadata: string;
}
