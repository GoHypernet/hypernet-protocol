import {
  BigNumberString,
  EthereumContractAddress,
  PaymentId,
  PublicIdentifier,
  Signature,
  UnixTimestamp,
} from "@hypernetlabs/objects";

export interface ISignedSendFundsRequest {
  requestIdentifier: string;
  channelAddress: EthereumContractAddress;
  recipientPublicIdentifier: PublicIdentifier;
  amount: BigNumberString;
  expirationDate: UnixTimestamp;
  requiredStake: BigNumberString;
  paymentToken: EthereumContractAddress;
  metadata: string | null;
  paymentId: PaymentId;
  protocolSignature: Signature;
  gatewaySignature: Signature;
}
