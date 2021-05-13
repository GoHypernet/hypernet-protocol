import { EthereumAddress, PublicIdentifier } from "@hypernetlabs/objects";

export interface ISendFundsRequest {
  recipientPublicIdentifier: PublicIdentifier;
  amount: string;
  expirationDate: number;
  requiredStake: string;
  paymentToken: EthereumAddress;
}
