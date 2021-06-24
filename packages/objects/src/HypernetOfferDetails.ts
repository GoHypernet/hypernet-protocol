import { BigNumberString } from "@objects/BigNumberString";
import { EthereumAddress } from "@objects/EthereumAddress";
import { MerchantUrl } from "@objects/MerchantUrl";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { IRate } from "@objects/Rate";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export interface IHypernetOfferDetails extends IMessageTransferData {
  paymentId: PaymentId;
  creationDate: UnixTimestamp;
  to: PublicIdentifier;
  from: PublicIdentifier;
  requiredStake: BigNumberString;
  paymentAmount: BigNumberString;
  merchantUrl: MerchantUrl;
  paymentToken: EthereumAddress;
  expirationDate: UnixTimestamp;
  metadata: string | null;
  rate?: IRate;
}
