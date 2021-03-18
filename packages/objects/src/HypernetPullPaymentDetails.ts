import { EthereumAddress } from "@objects/EthereumAddress";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export interface IHypernetPullPaymentDetails extends IMessageTransferData {
  paymentId: string;
  to: PublicIdentifier;
  from: PublicIdentifier;
  paymentToken: EthereumAddress;
  pullPaymentAmount: string;
}
