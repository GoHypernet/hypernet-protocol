import { Payment } from "@objects/Payment";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { EPaymentState } from "@objects/types";
import { EthereumAddress } from "@objects/EthereumAddress";
import { BigNumber } from "ethers";
import { PaymentInternalDetails } from "@objects/PaymentInternalDetails";
import { PaymentId } from "@objects/PaymentId";
import { MerchantUrl } from "@objects/MerchantUrl";

export class PushPayment extends Payment {
  constructor(
    id: PaymentId,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    paymentToken: EthereumAddress,
    requiredStake: BigNumber,
    amountStaked: BigNumber,
    expirationDate: number,
    createdTimestamp: number,
    updatedTimestamp: number,
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
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      merchantUrl,
      details,
    );
  }
}
