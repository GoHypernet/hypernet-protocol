import { BigNumberString } from "@objects/BigNumberString";
import { ChainId } from "@objects/ChainId";
import { EthereumAddress } from "@objects/EthereumAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { Payment } from "@objects/Payment";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { SortedTransfers } from "@objects/SortedTransfers";
import { EPaymentState } from "@objects/typing";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export class PushPayment extends Payment {
  constructor(
    id: PaymentId,
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    paymentToken: EthereumAddress,
    requiredStake: BigNumberString,
    amountStaked: BigNumberString,
    expirationDate: UnixTimestamp,
    createdTimestamp: UnixTimestamp,
    updatedTimestamp: UnixTimestamp,
    collateralRecovered: BigNumberString,
    gatewayUrl: GatewayUrl,
    details: SortedTransfers,
    metadata: string | null,
    public paymentAmount: BigNumberString,
    public amountTransferred: BigNumberString,
  ) {
    super(
      id,
      routerPublicIdentifier,
      chainId,
      to,
      from,
      state,
      paymentToken,
      requiredStake,
      amountStaked,
      expirationDate,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      gatewayUrl,
      details,
      metadata,
    );
  }
}
