import { BigNumberString } from "@objects/BigNumberString";
import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { IMessageTransferData } from "@objects/MessageTransferData";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { IRate } from "@objects/Rate";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export interface IHypernetOfferDetails extends IMessageTransferData {
  paymentId: PaymentId;
  routerPublicIdentifier: PublicIdentifier;
  chainId: ChainId;
  creationDate: UnixTimestamp;
  to: PublicIdentifier;
  from: PublicIdentifier;
  requiredStake: BigNumberString;
  paymentAmount: BigNumberString;
  gatewayUrl: GatewayUrl;
  paymentToken: EthereumContractAddress;
  insuranceToken: EthereumContractAddress;
  expirationDate: UnixTimestamp;
  metadata: string | null;
  rate?: IRate;
}
