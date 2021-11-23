import {
  BigNumberString,
  EthereumContractAddress,
  PaymentId,
  PublicIdentifier,
  Signature,
  UnixTimestamp,
  PushPayment,
} from "@hypernetlabs/objects";

export interface ISignedSendFundsRequest {
  requestIdentifier: string;
  channelAddress: EthereumContractAddress;
  recipientPublicIdentifier: PublicIdentifier;
  amount: BigNumberString;
  expirationDate: UnixTimestamp;
  requiredStake: BigNumberString;
  paymentToken: EthereumContractAddress;
  metadata: string;
  paymentId: PaymentId;
  gatewaySignature: Signature;
  callback: (err: unknown | null, payment: PushPayment | null) => void;
}
