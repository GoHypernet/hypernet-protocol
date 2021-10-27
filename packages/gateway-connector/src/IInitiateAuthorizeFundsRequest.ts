import {
  AuthorizeFundsRequestData,
  BigNumberString,
  EthereumContractAddress,
  PaymentId,
  PublicIdentifier,
  Signature,
  UnixTimestamp,
} from "@hypernetlabs/objects";

export interface IInitiateAuthorizeFundsRequest
  extends AuthorizeFundsRequestData {
  /**
   * The request identifier is defined by the gateway connector, but should be a unique identifier for this particular payment.
   * Usually, you can just use the internal payment ID from the gateway for this. If that is not available, a nonce works just fine.
   * This must be signed with the rest of the request.
   */
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
  callback: (paymentId: PaymentId, protocolSignature: Signature) => void;
}
