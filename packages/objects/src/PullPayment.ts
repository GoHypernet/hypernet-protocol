import { Payment } from "@objects/Payment";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { EPaymentState } from "@objects/types";
import { EthereumAddress } from "@objects/EthereumAddress";
import { BigNumber } from "ethers";
import { PaymentInternalDetails } from "@objects/PaymentInternalDetails";
import { PullAmount } from "@objects/PullAmount";

export class PullPayment extends Payment {
  constructor(
    id: string,
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
    merchantUrl: string,
    details: PaymentInternalDetails,
    public authorizedAmount: BigNumber,
    public amountTransferred: BigNumber,
    public vestedAmount: BigNumber,
    public deltaTime: number,
    public deltaAmount: BigNumber,
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
    );
  }
}
