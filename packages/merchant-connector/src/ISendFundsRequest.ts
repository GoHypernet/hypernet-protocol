import {
  BigNumberString,
  EthereumAddress,
  PublicIdentifier,
  UnixTimestamp,
} from "@hypernetlabs/objects";

export interface ISendFundsRequest {
  recipientPublicIdentifier: PublicIdentifier;
  amount: BigNumberString;
  expirationDate: UnixTimestamp;
  requiredStake: BigNumberString;
  paymentToken: EthereumAddress;
  metadata: string;
}
