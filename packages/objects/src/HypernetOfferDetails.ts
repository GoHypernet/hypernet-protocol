import { EthereumAddress } from "@objects/EthereumAddress";
import { MerchantUrl } from "@objects/MerchantUrl";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { IRate } from "@objects/Rate";

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
