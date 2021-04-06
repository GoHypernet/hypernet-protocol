import { EthereumAddress } from "@objects/EthereumAddress";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PaymentId } from "@objects/PaymentId";

export interface IHypernetPullPaymentDetails extends IMessageTransferData {
  paymentId: PaymentId;
  to: PublicIdentifier;
  from: PublicIdentifier;
  paymentToken: EthereumAddress;
  pullPaymentAmount: string;
}
