import { BigNumber } from "ethers";

import { EthereumAddress } from "@objects/EthereumAddress";
import { MerchantUrl } from "@objects/MerchantUrl";
import { Payment } from "@objects/Payment";
import { PaymentId } from "@objects/PaymentId";
import { PaymentInternalDetails } from "@objects/PaymentInternalDetails";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { EPaymentState } from "@objects/typing";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export class PushPayment extends Payment {
  constructor(
    id: PaymentId,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    paymentToken: EthereumAddress,
    requiredStake: BigNumber,
    amountStaked: BigNumber,
    expirationDate: UnixTimestamp,
    collateralRecovered: BigNumber,
    merchantUrl: MerchantUrl,
    details: PaymentInternalDetails,
    public paymentAmount: BigNumber,
    public amountTransferred: BigNumber,
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
      collateralRecovered,
      merchantUrl,
      details,
    );
  }
}
