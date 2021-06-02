import { EthereumAddress, PublicIdentifier } from "@hypernetlabs/objects";

export interface IAuthorizeFundsRequest {
  recipientPublicIdentifier: PublicIdentifier;
  totalAuthorized: string;
  expirationDate: number;
  deltaAmount: string;
  deltaTime: number;
  requiredStake: string;
  paymentToken: EthereumAddress;
}
