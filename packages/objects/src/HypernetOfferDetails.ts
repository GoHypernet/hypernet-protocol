import { BigNumberString } from "@objects/BigNumberString";
import { EthereumAddress } from "@objects/EthereumAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
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
  merchantUrl: GatewayUrl;
  paymentToken: EthereumAddress;
  expirationDate: UnixTimestamp;
  metadata: string | null;
  rate?: IRate;
}
