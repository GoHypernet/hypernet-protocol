import { BigNumber } from "ethers";

import { EthereumAddress } from "@objects/EthereumAddress";
import { MerchantUrl } from "@objects/MerchantUrl";
import { PaymentId } from "@objects/PaymentId";
import { PaymentInternalDetails } from "@objects/PaymentInternalDetails";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { EPaymentState } from "@objects/types";

export abstract class Payment {
  constructor(
    public id: PaymentId,
    public to: PublicIdentifier,
    public from: PublicIdentifier,
    public state: EPaymentState,
    public paymentToken: EthereumAddress,
    public requiredStake: BigNumber,
    public amountStaked: BigNumber,
    public expirationDate: number,
    public createdTimestamp: number,
    public updatedTimestamp: number,
    public collateralRecovered: BigNumber,
    public merchantUrl: MerchantUrl,
    public details: PaymentInternalDetails,
  ) {}
}
