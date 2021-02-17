import { EthereumAddress } from "./EthereumAddress";
import { IMessageTransferData } from "./MessageTransferData";
import { PublicIdentifier } from "./PublicIdentifier";

export interface IHypernetPullPaymentDetails extends IMessageTransferData {
  paymentId: string;
  to: PublicIdentifier;
  from: PublicIdentifier;
  paymentToken: EthereumAddress;
  pullPaymentAmount: string;
}
