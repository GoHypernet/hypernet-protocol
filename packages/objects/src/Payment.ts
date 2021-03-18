import { EPaymentState } from "@objects/types";
import { EthereumAddress } from "@objects/EthereumAddress";
import { PaymentInternalDetails } from "@objects/PaymentInternalDetails";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { BigNumber } from "ethers";

export abstract class Payment {
  constructor(
    public id: string,
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
    public merchantUrl: string,
    public details: PaymentInternalDetails,
  ) {}
}
