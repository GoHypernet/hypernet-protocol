import { BigNumberString } from "@objects/BigNumberString";
import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { Payment } from "@objects/Payment";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PullAmount } from "@objects/PullAmount";
import { SortedTransfers } from "@objects/SortedTransfers";
import { EPaymentState } from "@objects/typing";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export class PullPayment extends Payment {
  constructor(
    id: PaymentId,
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    paymentToken: EthereumContractAddress,
    requiredStake: BigNumberString,
    amountStaked: BigNumberString,
    expirationDate: UnixTimestamp,
    createdTimestamp: UnixTimestamp,
    updatedTimestamp: UnixTimestamp,
    collateralRecovered: BigNumberString,
    gatewayUrl: GatewayUrl,
    details: SortedTransfers,
    metadata: string | null,
    public authorizedAmount: BigNumberString,
    public amountTransferred: BigNumberString,
    public vestedAmount: BigNumberString,
    public deltaTime: number,
    public deltaAmount: BigNumberString,
    public ledger: PullAmount[],
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
