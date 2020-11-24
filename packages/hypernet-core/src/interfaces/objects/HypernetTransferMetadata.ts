import { EthereumAddress } from "./EthereumAddress";
import { PublicIdentifier } from "./PublicIdentifier";

export interface IHypernetTransferMetadata {
  paymentId: string;
  creationDate: number;
  to: PublicIdentifier;
  from: PublicIdentifier;
  requiredStake: string;
  paymentAmount: string;
  disputeMediator: EthereumAddress;
  paymentToken: EthereumAddress;
  expirationDate: moment.Moment;
}
