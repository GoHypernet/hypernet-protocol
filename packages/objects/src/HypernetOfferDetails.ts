import { EthereumAddress } from "@objects/EthereumAddress";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { IRate } from "@objects/Rate";

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
