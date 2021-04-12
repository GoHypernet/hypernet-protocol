import { EthereumAddress } from "@objects/EthereumAddress";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { IRate } from "@objects/Rate";
import { PaymentId } from "@objects/PaymentId";
import { MerchantUrl } from "@objects/MerchantUrl";

export interface IHypernetOfferDetails extends IMessageTransferData {
  paymentId: PaymentId;
  creationDate: number;
  to: PublicIdentifier;
  from: PublicIdentifier;
  requiredStake: string;
  paymentAmount: string;
  merchantUrl: MerchantUrl;
  paymentToken: EthereumAddress;
  expirationDate: number;
  rate?: IRate;
}
