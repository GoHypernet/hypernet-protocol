import {
  BigNumberString,
  EthereumAddress,
  PublicIdentifier,
  UnixTimestamp,
} from "@hypernetlabs/objects";

export interface ISendFundsRequest {
  channelAddress: EthereumAddress;
  recipientPublicIdentifier: PublicIdentifier;
  amount: BigNumberString;
  expirationDate: UnixTimestamp;
  requiredStake: BigNumberString;
  paymentToken: EthereumAddress;
  metadata: string | null;
}
