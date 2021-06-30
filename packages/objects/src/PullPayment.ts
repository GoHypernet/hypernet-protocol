import { BigNumber } from "ethers";

import { BigNumberString } from "@objects/BigNumberString";
import { EthereumAddress } from "@objects/EthereumAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { Payment } from "@objects/Payment";
import { PaymentId } from "@objects/PaymentId";
import { PaymentInternalDetails } from "@objects/PaymentInternalDetails";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PullAmount } from "@objects/PullAmount";
import { EPaymentState } from "@objects/typing";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export class PullPayment extends Payment {
  constructor(
    id: PaymentId,
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
    merchantUrl: GatewayUrl,
    details: PaymentInternalDetails,
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
      merchantUrl,
      details,
      metadata,
    );
  }
}
