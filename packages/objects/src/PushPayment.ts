import { BigNumberString } from "@objects/BigNumberString";
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
    requiredStake: BigNumberString,
    amountStaked: BigNumberString,
    expirationDate: UnixTimestamp,
    createdTimestamp: UnixTimestamp,
    updatedTimestamp: UnixTimestamp,
    collateralRecovered: BigNumberString,
    merchantUrl: MerchantUrl,
    details: PaymentInternalDetails,
    metadata: string | null,
    public paymentAmount: BigNumberString,
    public amountTransferred: BigNumberString,
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
