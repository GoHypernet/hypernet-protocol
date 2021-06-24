import { BigNumberString } from "@objects/BigNumberString";
import { EthereumAddress } from "@objects/EthereumAddress";
import { MerchantUrl } from "@objects/MerchantUrl";
import { PaymentId } from "@objects/PaymentId";
import { PaymentInternalDetails } from "@objects/PaymentInternalDetails";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { EPaymentState } from "@objects/typing";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export abstract class Payment {
  constructor(
    public id: PaymentId,
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
    public merchantUrl: MerchantUrl,
    public details: PaymentInternalDetails,
    public metadata: string | null,
  ) {}
}
