import { BigNumberString } from "@objects/BigNumberString";
import { ChainId } from "@objects/ChainId";
import { EthereumAddress } from "@objects/EthereumAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { SortedTransfers } from "@objects/SortedTransfers";
import { EPaymentState } from "@objects/typing";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export abstract class Payment {
  constructor(
    public id: PaymentId,
    public routerPublicIdentifier: PublicIdentifier,
    public chainId: ChainId,
    public to: PublicIdentifier,
    public from: PublicIdentifier,
    public state: EPaymentState,
    public paymentToken: EthereumAddress,
    public requiredStake: BigNumberString,
    public amountStaked: BigNumberString,
    public expirationDate: UnixTimestamp,
    public createdTimestamp: UnixTimestamp,
    public updatedTimestamp: UnixTimestamp,
    public collateralRecovered: BigNumberString,
    public gatewayUrl: GatewayUrl,
    public details: SortedTransfers,
    public metadata: string | null,
  ) {}
}
