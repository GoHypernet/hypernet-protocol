import { EthereumAddress } from "./EthereumAddress";
import { IMessageTransferData } from "./MessageTransferData";
import { PublicIdentifier } from "./PublicIdentifier";
import { IRate } from "./Rate";

export interface IHypernetOfferDetails extends IMessageTransferData {
  paymentId: string;
  creationDate: number;
  to: PublicIdentifier;
  from: PublicIdentifier;
  requiredStake: string;
  paymentAmount: string;
  merchantUrl: string;
  paymentToken: EthereumAddress;
  expirationDate: number;
  rate?: IRate;
}
