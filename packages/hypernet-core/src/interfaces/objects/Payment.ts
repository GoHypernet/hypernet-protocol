import { BigNumber, EthereumAddress, PublicKey } from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import { PublicIdentifier } from "@connext/vector-types";

export class PaymentInternalDetails {
  constructor(
    public offerTransferId: string,
    public insuranceTransferId: string | null | undefined,
    public parameterizedTransferId: string | null | undefined,
    public pullTransferIds: string[],
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
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

// tslint:disable-next-line: max-classes-per-file
export class PushPayment extends Payment {
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

// tslint:disable-next-line: max-classes-per-file
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

// tslint:disable-next-line: max-classes-per-file
export class PullAmount {
  constructor(public amount: BigNumber, public date: number) {}
}
