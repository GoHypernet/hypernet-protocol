import {
  BigNumberString,
  EthereumContractAddress,
  PaymentId,
  PublicIdentifier,
  Signature,
  UnixTimestamp,
} from "@hypernetlabs/objects";

export interface ISignedAuthorizeFundsRequest {
  requestIdentifier: string;
  channelAddress: EthereumContractAddress;
  recipientPublicIdentifier: PublicIdentifier;
  totalAuthorized: BigNumberString;
  expirationDate: UnixTimestamp;
  deltaAmount: BigNumberString;
  deltaTime: number;
  requiredStake: BigNumberString;
  paymentToken: EthereumContractAddress;
  metadata: string;
  paymentId: PaymentId;
  gatewaySignature: Signature;
}
