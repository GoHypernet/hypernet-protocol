import { EthereumAddress } from "@objects/EthereumAddress";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export interface IHypernetPullPaymentDetails extends IMessageTransferData {
  paymentId: PaymentId;
  to: PublicIdentifier;
  from: PublicIdentifier;
  paymentToken: EthereumAddress;
  pullPaymentAmount: string;
}
